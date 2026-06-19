import { products, formatPrice } from "../data/products.js";

export function renderHome(main) {
  main.innerHTML =
    '<section class="hero" aria-labelledby="hero-heading">' +
    '<div class="container hero__content">' +
    "<div>" +
    '<p class="hero__tagline">Web Development Capstone — Thiranex</p>' +
    '<h1 id="hero-heading">Modular e-commerce &amp; developer tools in one app</h1>' +
    "<p>A production-ready single-page application with client-side routing, " +
    "a product catalog, cart persistence, and integrated To-Do &amp; Weather modules.</p>" +
    '<div class="hero__cta">' +
    '<a href="/catalog" class="btn btn--primary" data-route>Browse Catalog</a>' +
    '<a href="/projects" class="btn btn--secondary" data-route>View Modules</a>' +
    "</div></div>" +
    "<figure>" +
    '<img src="assets/products/monitor.svg" alt="Developer workspace with monitor and accessories" class="hero__avatar" width="400" height="400" loading="eager">' +
    "</figure></div></section>" +
    '<div class="container">' +
    '<section class="section" aria-labelledby="featured-heading">' +
    '<header class="section__header"><p class="section__subtitle">Featured</p>' +
    '<h2 id="featured-heading">Top Products</h2></header>' +
    '<ul class="card-grid card-grid--three catalog-grid" role="list" id="home-featured"></ul>' +
    '<p class="text-center" style="margin-top:2rem">' +
    '<a href="/catalog" class="btn btn--secondary" data-route>View Full Catalog</a></p>' +
    "</section>" +
    '<section class="section" aria-labelledby="modules-heading">' +
    '<header class="section__header"><p class="section__subtitle">Integrated Apps</p>' +
    '<h2 id="modules-heading">Prior Project Modules</h2></header>' +
    '<ul class="card-grid" role="list">' +
    '<li><article class="card"><h3 class="card__title">To-Do List</h3><p>CRUD tasks with localStorage and delegated events.</p><a href="/todo" class="card__link" data-route>Open module</a></article></li>' +
    '<li><article class="card"><h3 class="card__title">Weather Dashboard</h3><p>Async Fetch API with live REST data by city.</p><a href="/weather" class="card__link" data-route>Open module</a></article></li>' +
    '<li><article class="card"><h3 class="card__title">Contact Form</h3><p>Accessible validation with ARIA live regions.</p><a href="/contact" class="card__link" data-route>Open module</a></article></li>' +
    "</ul></section></div>";

  var featured = main.querySelector("#home-featured");
  products.slice(0, 3).forEach(function (product) {
    featured.appendChild(createProductCard(product));
  });
}

function createProductCard(product) {
  var li = document.createElement("li");
  li.innerHTML =
    '<article class="card catalog-card">' +
    '<img src="' +
    product.image +
    '" alt="' +
    product.name +
    '" class="catalog-card__image" width="320" height="240" loading="lazy">' +
    '<h3 class="card__title">' +
    product.name +
    "</h3>" +
    '<p class="catalog-card__price">' +
    formatPrice(product.price) +
    "</p>" +
    '<a href="/product/' +
    product.id +
    '" class="card__link" data-route>View product</a></article>';
  return li;
}
