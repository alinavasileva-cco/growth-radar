"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Tab = "overview" | "companies" | "drafts" | "settings";
type Json = Record<string, any>;

async function request<T = any>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Ошибка запроса");
  return data;
}

function formatSize(bytes?: number) {
  if (!bytes) return "—";
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

export function DashboardApp() {
  const [tab, setTab] = useState<Tab>("overview");
  const [me, setMe] = useState<Json | null>(null);
  const [stats, setStats] = useState<Json | null>(null);
  const [companies, setCompanies] = useState<Json[]>([]);
  const [drafts, setDrafts] = useState<Json[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  const activeDraft = drafts.find((draft) => draft.id === activeDraftId) ?? null;

  const notify = useCallback((text: string, isError = false) => {
    setMessage(isError ? "" : text);
    setError(isError ? text : "");
    window.setTimeout(() => { setMessage(""); setError(""); }, 5000);
  }, []);

  const loadAll = useCallback(async () => {
    const [meData, statsData, companiesData, draftsData] = await Promise.all([
      request("/api/me"),
      request("/api/dashboard"),
      request("/api/companies"),
      request("/api/drafts")
    ]);
    setMe(meData);
    setStats(statsData);
    setCompanies(companiesData);
    setDrafts(draftsData);
    if (!activeDraftId && draftsData[0]) setActiveDraftId(draftsData[0].id);
  }, [activeDraftId]);

  useEffect(() => {
    void loadAll().catch((err) => notify(err.message, true));
  }, [loadAll, notify]);

  const filteredCompanies = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return companies;
    return companies.filter((company) => [company.name, company.legalName, company.email, company.inn]
      .filter(Boolean).some((value) => String(value).toLowerCase().includes(query)));
  }, [companies, search]);

  async function action(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try { await fn(); } catch (err) { notify(err instanceof Error ? err.message : "Ошибка", true); }
    finally { setBusy(false); }
  }

  function toggleCompany(id: string) {
    setSelectedCompanies((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function syncRadar() {
    await action(async () => {
      const result = await request("/api/sync-growth-radar", { method: "POST" });
      notify(`Синхронизация завершена: добавлено ${result.created}, обновлено ${result.updated}`);
      await loadAll();
    });
  }

  async function generateDrafts() {
    if (!selectedCompanies.length) return notify("Выберите хотя бы одну компанию", true);
    await action(async () => {
      const result = await request("/api/drafts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ companyIds: selectedCompanies })
      });
      notify(`Создано писем: ${result.length}`);
      setSelectedCompanies([]);
      setTab("drafts");
      await loadAll();
    });
  }

  async function addCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await action(async () => {
      await request("/api/companies", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email") || null,
          contactName: form.get("contactName") || null,
          contactPosition: form.get("contactPosition") || null,
          industry: form.get("industry") || null,
          signalSummary: form.get("signalSummary") || null,
          growthPoints: form.get("growthPoints") || null,
          sourceUrl: form.get("sourceUrl") || null
        })
      });
      notify("Компания добавлена");
      setShowCompanyForm(false);
      await loadAll();
    });
  }

  async function importFile(file?: File) {
    if (!file) return;
    await action(async () => {
      const form = new FormData();
      form.append("file", file);
      const result = await request("/api/import", { method: "POST", body: form });
      notify(`Импортировано: ${result.created}, пропущено: ${result.skipped}`);
      await loadAll();
    });
  }

  async function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeDraft) return;
    const form = new FormData(event.currentTarget);
    await action(async () => {
      await request(`/api/drafts/${activeDraft.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject: form.get("subject"), body: form.get("body") })
      });
      notify("Черновик сохранён и возвращён на проверку");
      await loadAll();
    });
  }

  async function draftAction(path: string, success: string, body?: Json) {
    if (!activeDraft) return;
    await action(async () => {
      await request(`/api/drafts/${activeDraft.id}/${path}`, {
        method: "POST",
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      notify(success);
      await loadAll();
    });
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await action(async () => {
      await request("/api/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          role: form.get("role"),
          positioning: form.get("positioning") || null,
          phone: form.get("phone") || null,
          telegram: form.get("telegram") || null,
          linkedin: form.get("linkedin") || null,
          websiteUrl: form.get("websiteUrl") || null,
          resumeUrl: form.get("resumeUrl") || null,
          signature: form.get("signature") || null,
          dailyLimit: Number(form.get("dailyLimit")),
          minimumIntervalMin: Number(form.get("minimumIntervalMin")),
          workdayStartHour: Number(form.get("workdayStartHour")),
          workdayEndHour: Number(form.get("workdayEndHour")),
          timezone: form.get("timezone"),
          queuePaused: form.get("queuePaused") === "on"
        })
      });
      notify("Настройки сохранены");
      await loadAll();
    });
  }

  async function uploadPdf(file?: File) {
    if (!file) return;
    await action(async () => {
      const form = new FormData();
      form.append("file", file);
      await request("/api/settings/attachment", { method: "POST", body: form });
      notify("Презентация загружена");
      await loadAll();
    });
  }

  async function logout() {
    await request("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div><span className="eyebrow">GROWTH RADAR</span><h2>Outreach</h2></div>
        <nav>
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Обзор</button>
          <button className={tab === "companies" ? "active" : ""} onClick={() => setTab("companies")}>Компании</button>
          <button className={tab === "drafts" ? "active" : ""} onClick={() => setTab("drafts")}>Письма</button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Настройки</button>
        </nav>
        <div className="accountBox"><small>{me?.account?.providerEmail || "Gmail не подключён"}</small><button className="linkButton" onClick={logout}>Выйти</button></div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div><span className="eyebrow">БЕЗОПАСНЫЙ OUTREACH</span><h1>{tab === "overview" ? "Главная панель" : tab === "companies" ? "Компании" : tab === "drafts" ? "Письма" : "Настройки"}</h1></div>
          <button className="button primary" disabled={busy} onClick={syncRadar}>Синхронизировать Growth Radar</button>
        </header>

        {message ? <div className="alert success">{message}</div> : null}
        {error ? <div className="alert error">{error}</div> : null}

        {tab === "overview" && <section>
          <div className="statsGrid">
            {[
              ["Компании", stats?.companies], ["Без email", stats?.noEmail], ["На проверке", stats?.review],
              ["Одобрено", stats?.approved], ["Запланировано", stats?.scheduled], ["Отправлено", stats?.sent],
              ["Ответы", stats?.replied], ["Ошибки", stats?.errors]
            ].map(([label, value]) => <article className="statCard" key={String(label)}><strong>{value ?? "—"}</strong><span>{label}</span></article>)}
          </div>
          <div className="panel quickPanel">
            <h3>Безопасная проверка</h3>
            <p>Сначала заполните профиль и загрузите PDF, затем синхронизируйте компании, создайте одно письмо и отправьте тест самой себе.</p>
            <div className="buttonRow">
              <button className="button" onClick={() => setTab("settings")}>1. Материалы</button>
              <button className="button" onClick={() => setTab("companies")}>2. Компания</button>
              <button className="button" onClick={() => setTab("drafts")}>3. Тест письма</button>
            </div>
          </div>
          <div className="panel">
            <h3>Последние действия</h3>
            <div className="activityList">{stats?.activities?.length ? stats.activities.map((item: Json) => <div key={item.id}><b>{item.action}</b><span>{new Date(item.createdAt).toLocaleString("ru-RU")}</span></div>) : <p>Действий пока нет.</p>}</div>
          </div>
        </section>}

        {tab === "companies" && <section>
          <div className="toolbar">
            <input className="searchInput" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по компании, email или ИНН" />
            <button className="button" onClick={() => setShowCompanyForm((value) => !value)}>Добавить компанию</button>
            <label className="button fileButton">Импорт XLSX/CSV<input type="file" accept=".xlsx,.xls,.csv" onChange={(event) => void importFile(event.target.files?.[0])} /></label>
            <a className="button" href="/api/export">Экспорт CSV</a>
            <button className="button primary" disabled={!selectedCompanies.length || busy} onClick={generateDrafts}>Создать письма ({selectedCompanies.length})</button>
          </div>
          {showCompanyForm && <form className="panel formGrid" onSubmit={addCompany}>
            <h3>Новая компания</h3>
            <label>Название<input name="name" required /></label><label>Email<input name="email" type="email" /></label>
            <label>Контактное лицо<input name="contactName" /></label><label>Должность<input name="contactPosition" /></label>
            <label>Отрасль<input name="industry" /></label><label>Источник<input name="sourceUrl" /></label>
            <label className="wide">Подтверждённая задача<textarea name="signalSummary" /></label>
            <label className="wide">Гипотеза пользы<textarea name="growthPoints" /></label>
            <button className="button primary" type="submit">Сохранить</button>
          </form>}
          <div className="companyGrid">
            {filteredCompanies.map((company) => <article className={`companyCard ${selectedCompanies.includes(company.id) ? "selected" : ""}`} key={company.id}>
              <label className="selectLine"><input type="checkbox" checked={selectedCompanies.includes(company.id)} onChange={() => toggleCompany(company.id)} /><span className={`status ${company.status.toLowerCase()}`}>{company.status}</span></label>
              <h3>{company.name}</h3><p>{company.industry || "Отрасль не указана"}</p>
              <dl><dt>Контакт</dt><dd>{company.contactName || "—"}</dd><dt>Email</dt><dd>{company.email || "Нет email"}</dd><dt>Сигнал</dt><dd>{company.signalSummary || "—"}</dd><dt>Гипотеза</dt><dd>{company.growthPoints || "—"}</dd></dl>
              {company.sourceUrl ? <a href={company.sourceUrl} target="_blank" rel="noreferrer">Открыть источник</a> : null}
            </article>)}
          </div>
        </section>}

        {tab === "drafts" && <section className="draftLayout">
          <div className="draftList">
            {drafts.map((draft) => <button key={draft.id} className={draft.id === activeDraftId ? "draftItem active" : "draftItem"} onClick={() => setActiveDraftId(draft.id)}>
              <b>{draft.company.name}</b><span>{draft.subject}</span><small>{draft.status}</small>
            </button>)}
            {!drafts.length ? <div className="panel"><p>Черновиков пока нет.</p></div> : null}
          </div>
          {activeDraft && <form className="panel editor" onSubmit={saveDraft} key={`${activeDraft.id}-${activeDraft.updatedAt}`}>
            <div className="editorMeta"><div><span className="eyebrow">{activeDraft.company.name}</span><h3>{activeDraft.company.email || "Email не указан"}</h3></div><span className={`status ${activeDraft.status.toLowerCase()}`}>{activeDraft.status}</span></div>
            <label>Тема<input name="subject" defaultValue={activeDraft.subject} /></label>
            <label>Текст<textarea name="body" className="letterBody" defaultValue={activeDraft.body} /></label>
            <div className="sourceBox"><b>Использованные данные</b><p>{activeDraft.company.signalSummary || "Нет подтверждённого сигнала"}</p><p>{activeDraft.company.growthPoints || "Нет гипотезы"}</p></div>
            <div className="buttonRow"><button className="button" type="submit">Сохранить</button><button className="button" type="button" onClick={() => void draftAction("approve", "Письмо одобрено")}>Одобрить</button><button className="button" type="button" onClick={() => void draftAction("test", "Тест отправлен вам")}>Тест себе</button><button className="button danger" type="button" onClick={() => { if (window.confirm(`Отправить письмо на ${activeDraft.company.email}?`)) void draftAction("send", "Письмо отправлено"); }}>Отправить сейчас</button></div>
            <div className="scheduleRow"><input id="schedule" type="datetime-local" /><button className="button" type="button" onClick={() => { const value = (document.getElementById("schedule") as HTMLInputElement)?.value; if (!value) return notify("Выберите дату и время", true); void draftAction("schedule", "Письмо запланировано", { scheduledAt: new Date(value).toISOString() }); }}>Запланировать</button></div>
          </form>}
        </section>}

        {tab === "settings" && me?.settings && <section className="settingsGrid">
          <form className="panel formGrid" onSubmit={saveSettings} key={me.settings.updatedAt}>
            <h3>Материалы Алины</h3>
            <label>Имя<input name="fullName" defaultValue={me.settings.fullName} required /></label><label>Роль<input name="role" defaultValue={me.settings.role} required /></label>
            <label>Телефон<input name="phone" defaultValue={me.settings.phone || ""} /></label><label>Telegram<input name="telegram" defaultValue={me.settings.telegram || ""} /></label>
            <label>Сайт<input name="websiteUrl" defaultValue={me.settings.websiteUrl || ""} /></label><label>LinkedIn<input name="linkedin" defaultValue={me.settings.linkedin || ""} /></label>
            <label className="wide">Позиционирование<textarea name="positioning" defaultValue={me.settings.positioning || ""} /></label>
            <label className="wide">Подпись<textarea name="signature" defaultValue={me.settings.signature || ""} /></label>
            <h3>Ограничения отправки</h3>
            <label>Лимит в день<input name="dailyLimit" type="number" min="1" max="50" defaultValue={me.settings.dailyLimit} /></label><label>Интервал, минут<input name="minimumIntervalMin" type="number" min="1" defaultValue={me.settings.minimumIntervalMin} /></label>
            <label>Начало окна<input name="workdayStartHour" type="number" min="0" max="23" defaultValue={me.settings.workdayStartHour} /></label><label>Конец окна<input name="workdayEndHour" type="number" min="1" max="24" defaultValue={me.settings.workdayEndHour} /></label>
            <label>Часовой пояс<input name="timezone" defaultValue={me.settings.timezone} /></label><label className="checkboxLabel"><input name="queuePaused" type="checkbox" defaultChecked={me.settings.queuePaused} /> Очередь остановлена</label>
            <button className="button primary" type="submit">Сохранить настройки</button>
          </form>
          <div className="panel attachmentPanel"><h3>Презентация PDF</h3><p>{me.attachment ? `${me.attachment.fileName} · ${formatSize(me.attachment.size)}` : "Файл ещё не загружен"}</p><label className="button fileButton">Выбрать PDF<input type="file" accept="application/pdf" onChange={(event) => void uploadPdf(event.target.files?.[0])} /></label><small>До 10 МБ. Этот файл будет прикрепляться к письмам.</small></div>
        </section>}
      </main>

      <nav className="mobileNav"><button onClick={() => setTab("overview")}>Обзор</button><button onClick={() => setTab("companies")}>Компании</button><button onClick={() => setTab("drafts")}>Письма</button><button onClick={() => setTab("settings")}>Настройки</button></nav>
    </div>
  );
}
