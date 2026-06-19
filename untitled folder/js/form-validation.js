/**
 * Accessible contact form validation
 * Provides inline error messages announced to screen readers via role="alert"
 */
(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusBanner = document.getElementById("form-status");

  const validators = {
    name: (value) => {
      if (!value.trim()) return "Please enter your name.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
      return "";
    },
    email: (value) => {
      if (!value.trim()) return "Please enter your email address.";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) return "Please enter a valid email address.";
      return "";
    },
    subject: (value) => {
      if (!value) return "Please select a subject.";
      return "";
    },
    message: (value) => {
      if (!value.trim()) return "Please enter a message.";
      if (value.trim().length < 10) return "Message must be at least 10 characters.";
      return "";
    },
  };

  function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + "-error");
    if (!input || !errorEl) return;

    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  }

  function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input || !validators[fieldId]) return true;

    const message = validators[fieldId](input.value);
    showFieldError(fieldId, message);
    return !message;
  }

  function showStatus(type, message) {
    if (!statusBanner) return;
    statusBanner.className = "form__status form__status--" + type;
    statusBanner.textContent = message;
    statusBanner.setAttribute("aria-hidden", "false");
    statusBanner.setAttribute("role", type === "error" ? "alert" : "status");
  }

  function hideStatus() {
    if (!statusBanner) return;
    statusBanner.setAttribute("aria-hidden", "true");
    statusBanner.textContent = "";
  }

  Object.keys(validators).forEach(function (fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return;

    input.addEventListener("blur", function () {
      validateField(fieldId);
    });

    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") {
        validateField(fieldId);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    hideStatus();

    const results = Object.keys(validators).map(validateField);
    const isValid = results.every(Boolean);

    if (!isValid) {
      showStatus("error", "Please correct the errors below before submitting.");
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    showStatus(
      "success",
      "Thank you! Your message has been sent successfully. I will respond within 2 business days."
    );
    form.reset();
    Object.keys(validators).forEach(function (fieldId) {
      showFieldError(fieldId, "");
    });
  });
})();
