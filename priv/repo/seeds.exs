# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     KasiCrm.Repo.insert!(%KasiCrm.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
defmodule KasiCrm.Seeds do
  require Logger

  Logger.configure(level: :info)

  if Application.compile_env(:kasi_crm, :env) not in [:test] do
    [
      "plans.exs"
    ]
    |> Enum.each(fn file ->
      Code.require_file("#{:code.priv_dir(:kasi_crm)}/repo/seeds/#{file}", __DIR__)
    end)
  else
    Logger.info("Skipping seeds for #{Application.compile_env(:kasi_crm, :env)}")
  end
end
