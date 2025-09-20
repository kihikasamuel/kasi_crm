defmodule KasiCrmWeb.DashboardLive do
  use KasiCrmWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <span>Hello World</span>
    """
  end
end
