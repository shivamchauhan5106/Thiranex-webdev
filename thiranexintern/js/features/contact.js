/** Contact feature — mountable form validation for SPA routes */
export function initContactForm() {
  var form = document.getElementById("contact-form");
  var statusBanner = document.getElementById("form-status");
  if (!form) return function () {};

  var validators = {
    name: function (v) { if (!v.trim()) return "Please enter your name."; if (v.trim().length < 2) return "Name must be at least 2 characters."; return ""; },
    email: function (v) { if (!v.trim()) return "Please enter your email address."; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Please enter a valid email address."; return ""; },
    subject: function (v) { if (!v) return "Please select a subject."; return ""; },
    message: function (v) { if (!v.trim()) return "Please enter a message."; if (v.trim().length < 10) return "Message must be at least 10 characters."; return ""; },
  };

  function showFieldError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + "-error");
    if (!input || !errorEl) return;
    if (message) { input.setAttribute("aria-invalid", "true"); errorEl.textContent = message; }
    else { input.removeAttribute("aria-invalid"); errorEl.textContent = ""; }
  }

  function validateField(fieldId) {
    var input = document.getElementById(fieldId);
    if (!input || !validators[fieldId]) return true;
    var message = validators[fieldId](input.value);
    showFieldError(fieldId, message);
    return !message;
  }

  function onSubmit(e) {
    e.preventDefault();
    statusBanner.setAttribute("aria-hidden", "true");
    var valid = Object.keys(validators).every(validateField);
    if (!valid) {
      statusBanner.className = "form__status form__status--error";
      statusBanner.textContent = "Please correct the errors below before submitting.";
      statusBanner.setAttribute("aria-hidden", "false");
      return;
    }
    statusBanner.className = "form__status form__status--success";
    statusBanner.textContent = "Thank you! Your message has been sent successfully.";
    statusBanner.setAttribute("aria-hidden", "false");
    form.reset();
    Object.keys(validators).forEach(function (id) { showFieldError(id, ""); });
  }

  form.addEventListener("submit", onSubmit);
  return function () { form.removeEventListener("submit", onSubmit); };
}
