import { CompanyStatus, DraftStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { gmailForUser } from "@/lib/google";
import { buildMimeMessage } from "@/lib/mime";
import { hasUnfilledVariables } from "@/lib/templates";

async function checkLimits(userId: string, recipient: string, ignoreDuplicate = false) {
  const settings = await db.applicationSettings.findUnique({ where: { userId } });
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const sentToday = await db.sentEmail.count({ where: { userId, sentAt: { gte: start } } });
  if (sentToday >= (settings?.dailyLimit ?? 15)) throw new Error("Достигнут дневной лимит");

  const suppressed = await db.suppressionList.findUnique({ where: { userId_email: { userId, email: recipient } } });
  if (suppressed) throw new Error("Адрес находится в списке исключений");

  if (!ignoreDuplicate) {
    const duplicate = await db.sentEmail.findFirst({ where: { userId, recipient } });
    if (duplicate) throw new Error("На этот адрес уже отправлялось письмо");
  }

  const last = await db.sentEmail.findFirst({ where: { userId }, orderBy: { sentAt: "desc" } });
  const interval = (settings?.minimumIntervalMin ?? 10) * 60_000;
  if (last && Date.now() - last.sentAt.getTime() < interval) {
    throw new Error("Минимальный интервал между письмами ещё не прошёл");
  }
}

async function sendRaw(userId: string, to: string, subject: string, body: string) {
  if (!/^\S+@\S+\.\S+$/.test(to)) throw new Error("Некорректный email");
  if (hasUnfilledVariables(subject) || hasUnfilledVariables(body)) throw new Error("В письме остались незаполненные переменные");

  const [account, attachment] = await Promise.all([
    db.emailAccount.findUnique({ where: { userId } }),
    db.attachment.findFirst({ where: { userId, isDefault: true }, orderBy: { createdAt: "desc" } })
  ]);
  if (!account) throw new Error("Gmail не подключён");
  const gmail = await gmailForUser(userId);
  const raw = buildMimeMessage({ from: account.providerEmail, to, subject, body, attachment });
  const draft = await gmail.users.drafts.create({ userId: "me", requestBody: { message: { raw } } });
  if (!draft.data.id) throw new Error("Gmail не создал черновик");
  const sent = await gmail.users.drafts.send({ userId: "me", requestBody: { id: draft.data.id } });
  if (!sent.data.id) throw new Error("Gmail не подтвердил отправку");
  return { gmailDraftId: draft.data.id, gmailMessageId: sent.data.id, gmailThreadId: sent.data.threadId ?? null };
}

export async function sendApprovedDraft(draftId: string, userId: string) {
  const draft = await db.emailDraft.findFirst({ where: { id: draftId, userId }, include: { company: true } });
  if (!draft) throw new Error("Черновик не найден");
  if (![DraftStatus.APPROVED, DraftStatus.SCHEDULED].includes(draft.status)) throw new Error("Письмо не одобрено");
  if (!draft.company.email) throw new Error("У компании нет email");
  await checkLimits(userId, draft.company.email);
  const result = await sendRaw(userId, draft.company.email, draft.subject, draft.body);

  await db.$transaction([
    db.sentEmail.create({
      data: {
        userId,
        draftId,
        gmailMessageId: result.gmailMessageId,
        gmailThreadId: result.gmailThreadId,
        recipient: draft.company.email,
        subject: draft.subject
      }
    }),
    db.emailDraft.update({ where: { id: draftId }, data: { status: DraftStatus.SENT, gmailDraftId: result.gmailDraftId } }),
    db.company.update({ where: { id: draft.companyId }, data: { status: CompanyStatus.SENT } }),
    db.scheduledEmail.updateMany({ where: { draftId, status: "PENDING" }, data: { status: "CANCELLED" } }),
    db.activityLog.create({ data: { userId, action: "EMAIL_SENT", entity: "EmailDraft", entityId: draftId } })
  ]);
  return result;
}

export async function sendTestToSelf(draftId: string, userId: string, ownEmail: string) {
  const draft = await db.emailDraft.findFirst({ where: { id: draftId, userId } });
  if (!draft) throw new Error("Черновик не найден");
  await checkLimits(userId, ownEmail, true);
  const result = await sendRaw(userId, ownEmail, `[ТЕСТ] ${draft.subject}`, draft.body);
  await db.activityLog.create({ data: { userId, action: "TEST_EMAIL_SENT", entity: "EmailDraft", entityId: draftId } });
  return result;
}
