defmodule KasiCrm.PlansFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `KasiCrm.Plans` context.
  """

  @doc """
  Generate a plan.
  """
  def plan_fixture(attrs \\ %{}) do
    {:ok, plan} =
      attrs
      |> Enum.into(%{})
      |> KasiCrm.Plans.create_plan()

    plan
  end
end
