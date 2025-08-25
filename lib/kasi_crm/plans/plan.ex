defmodule KasiCrm.Plans.Plan do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "plans" do
    field :name, :string
    field :slug, :string
    field :description, :string
    field :features, {:array, :map}
    field :cost, :decimal, default: 0.00

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(plan, attrs) do
    plan
    |> cast(attrs, [])
    |> validate_required([])
  end
end
