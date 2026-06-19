export function renderAbout(main) {
  main.innerHTML =
    '<div class="container">' +
    '<header class="section__header"><p class="section__subtitle">About Me</p>' +
    "<h1>Shivam Chauhan — Web Developer</h1>" +
    "<p>Web developer intern at Thiranex building accessible, modular web applications.</p></header>" +
    '<section class="section" aria-labelledby="bio-heading">' +
    '<h2 id="bio-heading">Capstone Architecture</h2>' +
    "<p>This application demonstrates a modular single-page architecture with:</p>" +
    "<ul role=\"list\">" +
    "<li>History API client-side routing</li>" +
    "<li>E-commerce catalog with cart persistence</li>" +
    "<li>Integrated To-Do, Weather, and Contact modules</li>" +
    "<li>Optimized assets and a production build pipeline</li>" +
    "</ul></section>" +
    '<section class="section" aria-labelledby="exp-heading">' +
    '<h2 id="exp-heading">Experience</h2>' +
    '<ol class="timeline" role="list">' +
    '<li class="timeline__item"><article><time class="timeline__date" datetime="2026-01">Jan 2026 — Present</time>' +
    "<h3>Web Developer Intern</h3><p><strong>Thiranex</strong> — Full-stack capstone development and deployment.</p></article></li>" +
    "</ol></section></div>";
}

export function renderProjects(main) {
  main.innerHTML =
    '<div class="container">' +
    '<header class="section__header"><p class="section__subtitle">Modules</p>' +
    "<h1>Project Modules</h1>" +
    "<p>Each prior assignment is integrated as a routed module in this capstone SPA.</p></header>" +
    '<ul class="card-grid card-grid--three" role="list">' +
    '<li><article class="card"><h2 class="card__title">E-Commerce Catalog</h2><p>Product grid, detail pages, cart, and checkout flow.</p><a href="/catalog" class="card__link" data-route>Open</a></article></li>' +
    '<li><article class="card"><h2 class="card__title">To-Do List</h2><p>CRUD with localStorage and filter tabs.</p><a href="/todo" class="card__link" data-route>Open</a></article></li>' +
    '<li><article class="card"><h2 class="card__title">Weather Dashboard</h2><p>Async Fetch API with error handling.</p><a href="/weather" class="card__link" data-route>Open</a></article></li>' +
    '<li><article class="card"><h2 class="card__title">Contact Form</h2><p>Accessible validation and ARIA alerts.</p><a href="/contact" class="card__link" data-route>Open</a></article></li>' +
    '<li><article class="card"><h2 class="card__title">Portfolio Shell</h2><p>Semantic HTML5 layout with WCAG patterns.</p><a href="/" class="card__link" data-route>Open</a></article></li>' +
    "</ul></div>";
}

export function renderNotFound(main) {
  main.innerHTML =
    '<div class="container text-center">' +
    "<h1>404 — Page Not Found</h1>" +
    "<p>The route you requested does not exist in this application.</p>" +
    '<a href="/" class="btn btn--primary" data-route>Go Home</a></div>';
}
