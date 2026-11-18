
  // Mobile menu
const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
    }
  });
}

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Enquiry form: inline validation + AJAX submit to Netlify Forms
const form = document.querySelector("form.enquiry");
if (form) {
  const messages = {
    name: "Please enter your name.",
    phone: "Please enter a valid phone number (10+ digits).",
    email: "Please enter a valid email address.",
    service: "Please choose a service.",
  };

  const check = (input) => {
    const field = input.closest(".field");
    const err = field && field.querySelector(".err");
    if (!err) return true;
    const ok = input.checkValidity() && (input.required ? input.value.trim() !== "" : true);
    field.classList.toggle("invalid", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    err.textContent = ok ? "" : messages[input.name] || "Please check this field.";
    return ok;
  };

  form.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("blur", () => { if (el.value) check(el); });
    el.addEventListener("input", () => { if (el.closest(".field")?.classList.contains("invalid")) check(el); });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll(".field input, .field select")];
    const results = inputs.map(check);
    if (results.includes(false)) {
      inputs[results.indexOf(false)].focus();
      return;
    }

    const btn = form.querySelector("button[type=submit]");
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending…";
    form.querySelector(".form-status")?.remove();

    
try {
  const formData = new FormData(form);

  const payload = {
    name: formData.get("name") || "",
    phone: formData.get("phone") || "",
    email: formData.get("email") || "",
    service: formData.get("service") || "",
    location: formData.get("location") || "",
    message: formData.get("message") || ""
  };

  await fetch("https://script.google.com/macros/s/AKfycbwxWZ6Ds0QS7bNAq1GodR03_fPeUGn-waC0uqIMra-C17Pb2R3DJ4A819Gk5YlfKS-sdg/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  window.location.href = "/thank-you";

} catch (error) {
  const status = document.createElement("p");
  status.className = "form-status error";
  status.setAttribute("role", "alert");
  status.textContent = "Sorry, your enquiry could not be sent. Please try again or call us directly.";
  btn.after(status);
  btn.disabled = false;
  btn.textContent = original;
}

  });
}
