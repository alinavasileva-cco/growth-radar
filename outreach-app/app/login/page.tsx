type Props = { searchParams: Promise<{ error?: string }> };

const errors: Record<string, string> = {
  oauth_state: "Сессия подключения устарела. Нажмите кнопку ещё раз.",
  not_allowed: "Этот Google-аккаунт не разрешён для входа.",
  oauth_failed: "Google не завершил подключение. Проверьте настройки OAuth."
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <main className="loginPage">
      <section className="loginCard">
        <span className="eyebrow">GROWTH RADAR</span>
        <h1>Персональные письма без массовой рассылки</h1>
        <p>Компании синхронизируются из Growth Radar. Каждое письмо сначала проверяется и одобряется вручную.</p>
        {params.error ? <div className="alert error">{errors[params.error] ?? "Ошибка подключения"}</div> : null}
        <a className="button primary large" href="/api/auth/google">Войти и подключить Gmail</a>
        <small>Пароль от почты приложение не получает и не хранит.</small>
      </section>
    </main>
  );
}
