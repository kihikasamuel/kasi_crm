defmodule KasiCrmWeb.Partials do
  @moduledoc """
  Defines all layout partials components like footers, sidebars, and top navbars
  """
  use KasiCrmWeb, :html

  embed_templates "partials/*"
end
