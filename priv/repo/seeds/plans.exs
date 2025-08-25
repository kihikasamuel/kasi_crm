defmodule KasiCrm.Seeds.Plans do
  require Logger

  def run() do
    Logger.info("Seeding payment plans...")
    time = DateTime.utc_now() |> DateTime.truncate(:second)
    fields = ~w(name description cost)a

    "#{__DIR__}/plans.json"
    |> File.read!()
    |> Jason.decode!(keys: :atoms)
    |> Enum.map(fn %{
                     name: _name,
                     slug: _slug,
                     description: _description,
                     features: _features,
                     cost: cost
                   } = plan ->
      plan
      |> Map.drop([:features])
      |> Map.put(:cost, Decimal.new(cost))
      |> Map.merge(%{
        inserted_at: time,
        updated_at: time
      })
    end)
    |> then(
      &KasiCrm.Repo.insert_all(KasiCrm.Plans.Plan, &1,
        on_conflict: {:replace, fields},
        conflict_target: [:slug]
      )
    )
  end
end

require Logger

KasiCrm.Seeds.Plans.run()
|> then(fn {count, _} ->
  Logger.info("Seeded #{count} payment plans.")
end)
