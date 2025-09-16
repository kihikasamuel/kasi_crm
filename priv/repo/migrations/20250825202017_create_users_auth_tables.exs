defmodule KasiCrm.Repo.Migrations.CreateUsersAuthTables do
  use Ecto.Migration

  def up do
    execute "CREATE EXTENSION IF NOT EXISTS citext", ""

    create_if_not_exists table(:plans) do
      add :name, :citext, null: false
      add :slug, :string
      add :description, :string
      add :features, {:array, :map}
      add :cost, :decimal, default: 0.00

      timestamps()
    end

    create_if_not_exists unique_index(:plans, [:slug], name: :uidx_plan_identifier)

    create_if_not_exists table(:users) do
      add :email, :citext, null: false
      add :hashed_password, :string, null: false
      add :confirmed_at, :utc_datetime
      add :plan_id, references(:plans, on_delete: :nothing)
      add :msisdn, :string
      add :name, :citext, null: false
      add :avatar, :string

      timestamps()
    end

    create_if_not_exists unique_index(:users, [:email])

    create_if_not_exists table(:users_tokens) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :token, :binary, null: false
      add :context, :string, null: false
      add :sent_to, :string

      timestamps(updated_at: false)
    end

    create_if_not_exists index(:users_tokens, [:user_id])
    create_if_not_exists unique_index(:users_tokens, [:context, :token])
  end

  def down do
    drop_if_exists index(:users_tokens, [:user_id])
    drop_if_exists unique_index(:users_tokens, [:context, :token])
    drop_if_exists table(:users_tokens)

    drop_if_exists unique_index(:plans, [:slug], name: :uidx_plan_identifier)
    drop_if_exists unique_index(:users, [:email])
    drop_if_exists table(:users)
    drop_if_exists table(:plans)


  end
end
