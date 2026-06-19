import { getItems, updateQuantity, removeItem, clearCart, getTotal } from "../services/cart.js";
import { getProductById, formatPrice } from "../data/products.js";

export function renderCartPage(main) {
  function render() {
    var items = getItems();

    if (items.length === 0) {
      main.innerHTML =
        '<div class="container">' +
        '<header class="section__header"><p class="section__subtitle">Cart</p><h1>Your Cart</h1></header>' +
        '<p class="todo-empty">Your cart is empty.</p>' +
        '<a href="/catalog" class="btn btn--primary" data-route>Continue Shopping</a></div>';
      return;
    }

    var rows = items
      .map(function (item) {
        var product = getProductById(item.productId);
        if (!product) return "";

        return (
          "<tr data-row=\"" +
          item.productId +
          "\">" +
          '<td class="cart-table__product">' +
          '<img src="' +
          product.image +
          '" alt="" width="64" height="48" loading="lazy">' +
          "<span>" +
          product.name +
          "</span></td>" +
          "<td>" +
          formatPrice(product.price) +
          "</td>" +
          '<td><input type="number" class="form__input cart-qty" min="1" max="99" value="' +
          item.quantity +
          '" aria-label="Quantity for ' +
          product.name +
          '" data-qty="' +
          item.productId +
          '"></td>' +
          "<td>" +
          formatPrice(product.price * item.quantity) +
          "</td>" +
          '<td><button type="button" class="todo-item__btn todo-item__btn--delete" data-remove="' +
          item.productId +
          '">Remove</button></td></tr>'
        );
      })
      .join("");

    var total = getTotal(getProductById);

    main.innerHTML =
      '<div class="container">' +
      '<header class="section__header"><p class="section__subtitle">Cart</p><h1>Your Cart</h1></header>' +
      '<div class="cart-layout">' +
      '<table class="cart-table" aria-label="Shopping cart items">' +
      "<thead><tr><th scope=\"col\">Product</th><th scope=\"col\">Price</th><th scope=\"col\">Qty</th><th scope=\"col\">Subtotal</th><th scope=\"col\"><span class=\"sr-only\">Actions</span></th></tr></thead>" +
      "<tbody>" +
      rows +
      "</tbody></table>" +
      '<aside class="cart-summary" aria-labelledby="cart-summary-heading">' +
      '<h2 id="cart-summary-heading">Order Summary</h2>' +
      '<p class="cart-summary__total">Total: <strong>' +
      formatPrice(total) +
      "</strong></p>" +
      '<button type="button" class="btn btn--primary" id="checkout-btn">Proceed to Checkout</button>' +
      '<button type="button" class="btn btn--secondary" id="clear-cart-btn">Clear Cart</button>' +
      "</aside></div></div>";
  }

  function handleClick(event) {
    if (event.target.id === "clear-cart-btn") {
      clearCart();
      render();
      return;
    }

    if (event.target.id === "checkout-btn") {
      alert("Checkout demo — thank you for exploring the Thiranex Capstone!");
      clearCart();
      render();
      return;
    }

    var removeBtn = event.target.closest("[data-remove]");
    if (removeBtn) {
      removeItem(removeBtn.getAttribute("data-remove"));
      render();
    }
  }

  function handleChange(event) {
    if (!event.target.matches("[data-qty]")) return;
    updateQuantity(
      event.target.getAttribute("data-qty"),
      parseInt(event.target.value, 10) || 1
    );
    render();
  }

  render();
  main.addEventListener("click", handleClick);
  main.addEventListener("change", handleChange);

  return function cleanup() {
    main.removeEventListener("click", handleClick);
    main.removeEventListener("change", handleChange);
  };
}
