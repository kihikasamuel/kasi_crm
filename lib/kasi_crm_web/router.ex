defmodule KasiCrmWeb.Router do
  use KasiCrmWeb, :router

  import KasiCrmWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {KasiCrmWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :admin_context do
    plug(:put_root_layout, html: {KasiCrmWeb.Layouts, :admin})
  end

  scope "/", KasiCrmWeb do
    pipe_through :browser

    get "/", UserSessionController, :new
  end

  # Other scopes may use custom stacks.
  # scope "/api", KasiCrmWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:kasi_crm, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: KasiCrmWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/", KasiCrmWeb do
    pipe_through [:browser, :redirect_if_user_is_authenticated]

    get "/users/signup", UserRegistrationController, :new
    post "/users/signup", UserRegistrationController, :create
    get "/users/login", UserSessionController, :new
    post "/users/login", UserSessionController, :create
    get "/users/reset-password", UserResetPasswordController, :new
    post "/users/reset-password", UserResetPasswordController, :create
    get "/users/reset-password/:token", UserResetPasswordController, :edit
    put "/users/reset-password/:token", UserResetPasswordController, :update
  end

  scope "/", KasiCrmWeb do
    pipe_through [:browser, :admin_context, :require_authenticated_user]

    # org admin routes
    live_session :admin_portal, on_mount: [
      {KasiCrmWeb.UserAuth, :mount_current_user}
      ] do
        scope "/admin" do
          live "/dashboard", DashboardLive, :index
        end
      end

    # maintainer admin routes
    live_session :support_portal, on_mount: [
      {KasiCrmWeb.UserAuth, :mount_current_user}
      ] do
        scope "/support/portal" do
          live "/users", UserLive.Index, :index
          live "/users/new", UserLive.Index, :new
          live "/users/:id/edit", UserLive.Index, :edit

          live("/users/:id", UserLive.Show, :show)
          live "/users/:id/show/edit", UserLive.Show, :edit
        end
      end

    # user settings routes
    scope "/" do
      get "/user/settings", UserSettingsController, :edit
      put "/user/settings", UserSettingsController, :update
      get "/user/settings/confirm_email/:token", UserSettingsController, :confirm_email
      get "/users/:id/edit", UserSettingsController, :edit
      get "/users/:id/show/edit", UserSettingsController, :edit
    end
  end

  scope "/", KasiCrmWeb do
    pipe_through [:browser]

    get "/users/log-out", UserSessionController, :delete
    get "/users/confirm", UserConfirmationController, :new
    post "/users/confirm", UserConfirmationController, :create
    get "/users/confirm/:token", UserConfirmationController, :edit
    post "/users/confirm/:token", UserConfirmationController, :update
  end
end
