import { createRouter } from "./router.js";
import { renderLayout, bindLayoutUpdates } from "./layout.js";
import { renderHome } from "./modules/home.js";
import { renderCatalog } from "./modules/catalog.js";
import { renderProduct } from "./modules/product.js";
import { renderCartPage } from "./modules/cart-page.js";
import { renderAbout, renderProjects, renderNotFound } from "./modules/static-pages.js";
import { renderTodo } from "./modules/todo.js";
import { renderWeather } from "./modules/weather.js";
import { renderContact } from "./modules/contact.js";

var main = document.getElementById("app-main");
var router = createRouter();

function route(fn) {
  return function (params) {
    document.title = getTitle(window.location.pathname);
    return fn(main, params);
  };
}

function getTitle(path) {
  var titles = {
    "/": "Shivam Chauhan | Capstone",
    "/catalog": "Shop | Shivam Chauhan",
    "/cart": "Cart | Shivam Chauhan",
    "/about": "About | Shivam Chauhan",
    "/projects": "Projects | Shivam Chauhan",
    "/todo": "To-Do | Shivam Chauhan",
    "/weather": "Weather | Shivam Chauhan",
    "/contact": "Contact | Shivam Chauhan",
  };
  if (path.indexOf("/product/") === 0) return "Product | Shivam Chauhan";
  return titles[path] || "404 | Shivam Chauhan";
}

renderLayout();
bindLayoutUpdates();

router.add("/", route(function (el) { renderHome(el); }));
router.add("/catalog", route(renderCatalog));
router.add("/product/:id", route(renderProduct));
router.add("/cart", route(renderCartPage));
router.add("/about", route(renderAbout));
router.add("/projects", route(renderProjects));
router.add("/todo", route(renderTodo));
router.add("/weather", route(renderWeather));
router.add("/contact", route(renderContact));
router.setNotFound(function () {
  document.title = "404 | Shivam Chauhan";
  renderNotFound(main);
});

router.init();
