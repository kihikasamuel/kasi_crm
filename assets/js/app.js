// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html";
// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix";
import { LiveSocket } from "phoenix_live_view";
import topbar from "../vendor/topbar";
import "./index.js"
import "./config.js";
import "./phoenix.js";
import "./dashboards/crm-dashboard.js";

let csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");
let liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: { _csrf_token: csrfToken },
});

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", (_info) => topbar.show(300));
window.addEventListener("phx:page-loading-stop", (_info) => topbar.hide());

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;

// ### direction ##
var phoenixIsRTL = window.config.config.phoenixIsRTL;
// Set RTL or LTR mod
if (phoenixIsRTL) {
  var linkDefault = document.getElementById("style-default");
  var userLinkDefault = document.getElementById("user-style-default");
  linkDefault.setAttribute("disabled", true);
  userLinkDefault.setAttribute("disabled", true);
  document.querySelector("html").setAttribute("dir", "rtl");
} else {
  var linkRTL = document.getElementById("style-rtl");
  var userLinkRTL = document.getElementById("user-style-rtl");
  linkRTL.setAttribute("disabled", true);
  userLinkRTL.setAttribute("disabled", true);
}
// ### theme settings ###
var navbarTopShape = window.config.config.phoenixNavbarTopShape;
var navbarPosition = window.config.config.phoenixNavbarPosition;
var body = document.querySelector("body");
var navbarDefault = document.querySelector("#navbarDefault");
var navbarTop = document.querySelector("#navbarTop");
var topNavSlim = document.querySelector("#topNavSlim");
var navbarTopSlim = document.querySelector("#navbarTopSlim");
var navbarCombo = document.querySelector("#navbarCombo");
var navbarComboSlim = document.querySelector("#navbarComboSlim");
var dualNav = document.querySelector("#dualNav");

var documentElement = document.documentElement;
var navbarVertical = document.querySelector(".navbar-vertical");

if (navbarPosition === "dual-nav") {
  topNavSlim?.remove();
  navbarTop?.remove();
  navbarTopSlim?.remove();
  navbarCombo?.remove();
  navbarComboSlim?.remove();
  navbarDefault?.remove();
  navbarVertical?.remove();
  dualNav.removeAttribute("style");
  document.documentElement.setAttribute("data-navigation-type", "dual");
} else if (navbarTopShape === "slim" && navbarPosition === "vertical") {
  navbarDefault?.remove();
  navbarTop?.remove();
  navbarTopSlim?.remove();
  navbarCombo?.remove();
  navbarComboSlim?.remove();
  topNavSlim.style.display = "block";
  navbarVertical.style.display = "inline-block";
  document.documentElement.setAttribute("data-navbar-horizontal-shape", "slim");
} else if (navbarTopShape === "slim" && navbarPosition === "horizontal") {
  navbarDefault?.remove();
  navbarVertical?.remove();
  navbarTop?.remove();
  topNavSlim?.remove();
  navbarCombo?.remove();
  navbarComboSlim?.remove();
  dualNav?.remove();
  navbarTopSlim.removeAttribute("style");
  document.documentElement.setAttribute("data-navbar-horizontal-shape", "slim");
} else if (navbarTopShape === "slim" && navbarPosition === "combo") {
  navbarDefault?.remove();
  navbarTop?.remove();
  topNavSlim?.remove();
  navbarCombo?.remove();
  navbarTopSlim?.remove();
  dualNav?.remove();
  navbarComboSlim.removeAttribute("style");
  navbarVertical.removeAttribute("style");
  document.documentElement.setAttribute("data-navbar-horizontal-shape", "slim");
} else if (navbarTopShape === "default" && navbarPosition === "horizontal") {
  navbarDefault?.remove();
  topNavSlim?.remove();
  navbarVertical?.remove();
  navbarTopSlim?.remove();
  navbarCombo?.remove();
  navbarComboSlim?.remove();
  dualNav?.remove();
  navbarTop.removeAttribute("style");
  document.documentElement.setAttribute("data-navigation-type", "horizontal");
} else if (navbarTopShape === "default" && navbarPosition === "combo") {
  topNavSlim?.remove();
  navbarTop?.remove();
  navbarTopSlim?.remove();
  navbarDefault?.remove();
  navbarComboSlim?.remove();
  dualNav?.remove();
  navbarCombo.removeAttribute("style");
  navbarVertical.removeAttribute("style");
  document.documentElement.setAttribute("data-navigation-type", "combo");
} else {
  topNavSlim?.remove();
  navbarTop?.remove();
  navbarTopSlim?.remove();
  navbarCombo?.remove();
  navbarComboSlim?.remove();
  dualNav?.remove();
  navbarDefault.removeAttribute("style");
  navbarVertical.removeAttribute("style");
}

var navbarTopStyle = window.config.config.phoenixNavbarTopStyle;
var navbarTop = document.querySelector(".navbar-top");
if (navbarTopStyle === "darker") {
  navbarTop.setAttribute("data-navbar-appearance", "darker");
}

var navbarVerticalStyle = window.config.config.phoenixNavbarVerticalStyle;
var navbarVertical = document.querySelector(".navbar-vertical");
if (navbarVerticalStyle === "darker") {
  navbarVertical.setAttribute("data-navbar-appearance", "darker");
}
// ### end of theme settings ###
