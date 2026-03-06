Rails.application.config.middleware.use ActionDispatch::Cookies
Rails.application.config.middleware.use ActionDispatch::Session::CookieStore,
  key: "_fondeo_session",
  same_site: :lax,
  secure: Rails.env.production?,
  httponly: true,
  expire_after: 14.days
