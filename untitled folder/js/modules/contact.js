import { initContactForm } from "../features/contact.js";

var CONTACT_HTML =
  '<div class="container"><header class="section__header"><p class="section__subtitle">Get In Touch</p><h1>Contact Me</h1></header>' +
  '<section class="section"><div id="form-status" class="form__status" aria-hidden="true" aria-live="polite"></div>' +
  '<form id="contact-form" class="form" novalidate aria-describedby="form-instructions">' +
  '<p id="form-instructions" class="form__hint">Fields marked with <span class="form__required">*</span> are required.</p>' +
  '<div class="form__group"><label for="name" class="form__label">Full Name <span class="form__required">*</span></label>' +
  '<input type="text" id="name" class="form__input" required autocomplete="name" aria-describedby="name-error">' +
  '<p id="name-error" class="form__error" role="alert"></p></div>' +
  '<div class="form__group"><label for="email" class="form__label">Email <span class="form__required">*</span></label>' +
  '<input type="email" id="email" class="form__input" required autocomplete="email" aria-describedby="email-error">' +
  '<p id="email-error" class="form__error" role="alert"></p></div>' +
  '<div class="form__group"><label for="subject" class="form__label">Subject <span class="form__required">*</span></label>' +
  '<select id="subject" class="form__select" required aria-describedby="subject-error">' +
  '<option value="">Select…</option><option value="freelance">Freelance</option><option value="job">Job</option><option value="other">Other</option></select>' +
  '<p id="subject-error" class="form__error" role="alert"></p></div>' +
  '<div class="form__group"><label for="message" class="form__label">Message <span class="form__required">*</span></label>' +
  '<textarea id="message" class="form__textarea" rows="6" required aria-describedby="message-error"></textarea>' +
  '<p id="message-error" class="form__error" role="alert"></p></div>' +
  '<button type="submit" class="btn btn--primary">Send Message</button></form></section></div>';

export function renderContact(main) {
  main.innerHTML = CONTACT_HTML;
  return initContactForm();
}
