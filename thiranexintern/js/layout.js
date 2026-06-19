import { getCount, subscribe } from "./services/cart.js";

var NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/catalog", label: "Shop" },
  { path: "/cart", label: "Cart", badge: true },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/todo", label: "To-Do" },
  { path: "/weather", label: "Weather" },
  { path: "/contact", label: "Contact" },
];

function renderNav(currentPath) {
  return NAV_LINKS.map(function (link) {
    var isActive = currentPath === link.path;
    var badge =
      link.badge && getCount() > 0
        ? '<span class="nav-badge" aria-label="' +
          getCount() +
          ' items in cart">' +
          getCount() +
          "</span>"
        : "";

    return (
      '<li><a href="' +
      link.path +
      '" class="site-nav__link' +
      (isActive ? '" aria-current="page"' : '"') +
      ' data-route>' +
      link.label +
      badge +
      "</a></li>"
    );
  }).join("");
}

export function renderLayout() {
  var header = document.getElementById("app-header");
  var footer = document.getElementById("app-footer");
  var path = window.location.pathname || "/";

  if (header) {
    header.className = "site-header";
    header.setAttribute("role", "banner");
    header.innerHTML =
      '<div class="container site-header__inner">' +
      '<a href="/" class="site-logo" aria-label="Shivam Chauhan — Home" data-route>Shivam Chauhan</a>' +
      '<nav class="site-nav" role="navigation" aria-label="Primary navigation">' +
      '<ul class="site-nav__list" id="primary-nav">' +
      renderNav(path) +
      "</ul></nav></div>";
  }

  if (footer) {
    footer.className = "site-footer";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML =
      '<div class="container site-footer__inner">' +
      '<p class="site-footer__copy">&copy; 2026 Shivam Chauhan. Thiranex Capstone.</p>' +
      '<nav aria-label="Footer navigation"><ul class="site-footer__nav-list">' +
      '<li><a href="/catalog" data-route>Shop</a></li>' +
      '<li><a href="/about" data-route>About</a></li>' +
      '<li><a href="/contact" data-route>Contact</a></li>' +
      '<li><a href="https://github.com/shivamchauhan" rel="noopener noreferrer">GitHub</a></li>' +
      "</ul></nav></div>";
  }
}

export function bindLayoutUpdates() {
  return subscribe(function () {
    var nav = document.getElementById("primary-nav");
    if (nav) {
      nav.innerHTML = renderNav(window.location.pathname || "/");
    }
  });
}

document.addEventListener("routechange", function () {
  var nav = document.getElementById("primary-nav");
  if (nav) {
    nav.innerHTML = renderNav(window.location.pathname || "/");
  }
});
