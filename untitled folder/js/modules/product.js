import { getProductById, formatPrice } from "../data/products.js";
import { addItem } from "../services/cart.js";

export function renderProduct(main, params) {
  var product = getProductById(params.id);

  if (!product) {
    main.innerHTML =
      '<div class="container"><p class="weather-status weather-status--error" role="alert">Product not found.</p>' +
      '<a href="/catalog" class="btn btn--primary" data-route>Back to catalog</a></div>';
    return;
  }

  var specRows = Object.keys(product.specs)
    .map(function (key) {
      return (
        "<tr><th scope=\"row\">" +
        key.charAt(0).toUpperCase() +
        key.slice(1) +
        "</th><td>" +
        product.specs[key] +
        "</td></tr>"
      );
    })
    .join("");

  main.innerHTML =
    '<div class="container product-detail">' +
    '<nav class="breadcrumb" aria-label="Breadcrumb">' +
    '<a href="/catalog" data-route>Catalog</a> / <span aria-current="page">' +
    product.name +
    "</span></nav>" +
    '<article class="product-detail__grid">' +
    '<figure class="product-detail__media">' +
    '<img src="' +
    product.image +
    '" alt="' +
    product.name +
    '" width="480" height="360" loading="eager">' +
    "</figure>" +
    '<div class="product-detail__info">' +
    "<h1>" +
    product.name +
    "</h1>" +
    '<p class="catalog-card__price">' +
    formatPrice(product.price) +
    "</p>" +
    '<p class="product-detail__rating">Rating: ' +
    product.rating +
    " / 5</p>" +
    "<p>" +
    product.description +
    "</p>" +
    '<table class="product-specs" aria-label="Product specifications"><tbody>' +
    specRows +
    "</tbody></table>" +
    '<button type="button" id="product-add-btn" class="btn btn--primary"' +
    (product.inStock ? "" : " disabled") +
    ">" +
    (product.inStock ? "Add to Cart" : "Out of Stock") +
    "</button>" +
    "</div></article></div>";

  var addBtn = main.querySelector("#product-add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      addItem(product.id);
      addBtn.textContent = "Added to Cart!";
    });
  }
}
