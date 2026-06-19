/** Client-side History API router with modular route handlers */
function pathToRegex(path) {
  return new RegExp(
    "^" +
      path.replace(/\//g, "\\/").replace(/:\w+/g, function (match) {
        return "([^/]+)";
      }) +
      "$"
  );
}

function extractParams(routePath, match) {
  var keys = routePath.match(/:\w+/g) || [];
  var params = {};

  keys.forEach(function (key, index) {
    params[key.slice(1)] = decodeURIComponent(match[index + 1]);
  });

  return params;
}

export function createRouter() {
  var routes = [];
  var currentCleanup = null;
  var notFoundHandler = null;

  function resolve(pathname) {
    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      var match = pathname.match(route.regex);

      if (match) {
        if (currentCleanup) {
          currentCleanup();
          currentCleanup = null;
        }

        var params = extractParams(route.path, match);
        var result = route.handler(params);
        currentCleanup = typeof result === "function" ? result : null;
        document.dispatchEvent(
          new CustomEvent("routechange", { detail: { path: pathname } })
        );
        return true;
      }
    }

    if (notFoundHandler) {
      if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
      }
      notFoundHandler();
    }

    return false;
  }

  return {
    add: function (path, handler) {
      routes.push({ path: path, handler: handler, regex: pathToRegex(path) });
    },
    setNotFound: function (handler) {
      notFoundHandler = handler;
    },
    navigate: function (path, pushState) {
      if (pushState !== false) {
        window.history.pushState({}, "", path);
      }
      resolve(path);
      window.scrollTo(0, 0);
    },
    init: function () {
      document.addEventListener("click", function (event) {
        var link = event.target.closest("[data-route]");
        if (!link || link.target === "_blank") return;

        var href = link.getAttribute("href");
        if (!href || href.indexOf("http") === 0) return;

        event.preventDefault();
        this.navigate(href);
      }.bind(this));

      window.addEventListener("popstate", function () {
        resolve(window.location.pathname);
      });

      resolve(window.location.pathname || "/");
    },
  };
}
