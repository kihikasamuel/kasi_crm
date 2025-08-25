defmodule KasiCrm.Repo do
  use Ecto.Repo,
    otp_app: :kasi_crm,
    adapter: Ecto.Adapters.Postgres
end
