defmodule Server.PageController do
  use Server.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
