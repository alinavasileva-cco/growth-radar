import { EmailLogin } from "./email-login";

type Props = { searchParams: Promise<{ error?: string }> };

const errors: Record<string, string> = {
  oauth_state: "Сессия подключения устарела.",
  not_allowed: "Этот аккаунт не разрешён для входа.",
  oauth_failed: "Google не завершил подключение."
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <main className="loginPage">
      <section className="loginCard">
        <span className="eyebrow">GROWTH RADAR</span>
        <h1>Персональные письма без массовой рассылки</h1>
        <p>Компании синхронизируются из Growth Radar. Каждое письмо сначала проверяется и одобряется вручную.</p>
        {params.error ? <div className="alert error">{errors[params.error] ?? "Ошибка входа"}</div> : null}
        <EmailLogin />
        <small>Вход выполняется по одноразовому коду. Обычный пароль Gmail приложение не получает.</small>
      </section>
    </main>
  );
}
