/** Cart service — localStorage-backed state for e-commerce module */
var STORAGE_KEY = "thiranex-cart";

var listeners = [];

function readCart() {
  try {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    var parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeCart(items) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach(function (fn) {
    fn(items);
  });
}

export function subscribe(callback) {
  listeners.push(callback);
  return function () {
    listeners = listeners.filter(function (fn) {
      return fn !== callback;
    });
  };
}

export function getItems() {
  return readCart();
}

export function getCount() {
  return readCart().reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
}

export function getTotal(productLookup) {
  return readCart().reduce(function (total, item) {
    var product = productLookup(item.productId);
    return product ? total + product.price * item.quantity : total;
  }, 0);
}

export function addItem(productId, quantity) {
  quantity = quantity || 1;
  var items = readCart();
  var existing = items.find(function (item) {
    return item.productId === productId;
  });

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId: productId, quantity: quantity });
  }

  writeCart(items);
}

export function updateQuantity(productId, quantity) {
  var items = readCart();
  var item = items.find(function (entry) {
    return entry.productId === productId;
  });

  if (!item) return;

  if (quantity <= 0) {
    writeCart(
      items.filter(function (entry) {
        return entry.productId !== productId;
      })
    );
    return;
  }

  item.quantity = quantity;
  writeCart(items);
}

export function removeItem(productId) {
  writeCart(
    readCart().filter(function (item) {
      return item.productId !== productId;
    })
  );
}

export function clearCart() {
  writeCart([]);
}
