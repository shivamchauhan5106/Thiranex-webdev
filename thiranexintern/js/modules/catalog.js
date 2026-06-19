import { products, categories, formatPrice } from "../data/products.js";
import { addItem } from "../services/cart.js";

export function renderCatalog(main) {
  main.innerHTML =
    '<div class="container">' +
    '<header class="section__header">' +
    '<p class="section__subtitle">E-Commerce</p>' +
    "<h1>Product Catalog</h1>" +
    "<p>Browse tech products with category filtering. Add items to your cart — data persists in localStorage.</p>" +
    "</header>" +
    '<div class="catalog-toolbar" role="group" aria-label="Filter by category" id="catalog-filters"></div>' +
    '<p id="catalog-count" class="catalog-count" aria-live="polite"></p>' +
    '<ul class="card-grid card-grid--three catalog-grid" role="list" id="catalog-grid"></ul>' +
    "</div>";

  var activeCategory = "all";
  var filtersEl = main.querySelector("#catalog-filters");
  var gridEl = main.querySelector("#catalog-grid");
  var countEl = main.querySelector("#catalog-count");

  function renderFilters() {
    filtersEl.innerHTML = categories
      .map(function (cat) {
        var active = cat.id === activeCategory;
        return (
          '<button type="button" class="todo-filter' +
          (active ? " todo-filter--active" : "") +
          '" data-category="' +
          cat.id +
          '" aria-pressed="' +
          active +
          '">' +
          cat.label +
          "</button>"
        );
      })
      .join("");
  }

  function renderGrid() {
    var filtered =
      activeCategory === "all"
        ? products
        : products.filter(function (p) {
            return p.category === activeCategory;
          });

    countEl.textContent = filtered.length + " product" + (filtered.length === 1 ? "" : "s");

    gridEl.innerHTML = filtered
      .map(function (product) {
        return (
          '<li><article class="card catalog-card">' +
          '<img src="' +
          product.image +
          '" alt="' +
          product.name +
          '" class="catalog-card__image" width="320" height="240" loading="lazy">' +
          '<span class="catalog-card__category">' +
          product.category +
          "</span>" +
          "<h2 class=\"card__title\">" +
          product.name +
          "</h2>" +
          '<p class="catalog-card__price">' +
          formatPrice(product.price) +
          "</p>" +
          '<p class="catalog-card__rating">Rating: ' +
          product.rating +
          "/5</p>" +
          '<div class="catalog-card__actions">' +
          '<a href="/product/' +
          product.id +
          '" class="btn btn--secondary" data-route>Details</a>' +
          '<button type="button" class="btn btn--primary" data-add="' +
          product.id +
          '"' +
          (product.inStock ? "" : " disabled") +
          ">" +
          (product.inStock ? "Add to Cart" : "Out of Stock") +
          "</button></div></article></li>"
        );
      })
      .join("");
  }

  function handleClick(event) {
    var filterBtn = event.target.closest("[data-category]");
    if (filterBtn) {
      activeCategory = filterBtn.getAttribute("data-category");
      renderFilters();
      renderGrid();
      return;
    }

    var addBtn = event.target.closest("[data-add]");
    if (addBtn && !addBtn.disabled) {
      addItem(addBtn.getAttribute("data-add"));
      addBtn.textContent = "Added!";
      setTimeout(function () {
        addBtn.textContent = "Add to Cart";
      }, 1200);
    }
  }

  renderFilters();
  renderGrid();
  main.addEventListener("click", handleClick);

  return function cleanup() {
    main.removeEventListener("click", handleClick);
  };
}
