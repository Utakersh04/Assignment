const form = document.getElementById("candidateForm");
const saveBtn = document.getElementById("saveBtn");
const phoneToggle = document.getElementById("phoneToggle");
const phoneContainer = document.getElementById("phoneContainer");

const fields = {
  fullName: document.getElementById("fullName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  password: document.getElementById("password"),
  language: document.getElementById("language"),
  about: document.getElementById("about")
};

const errors = {
  fullName: document.getElementById("fullNameError"),
  email: document.getElementById("emailError"),
  phone: document.getElementById("phoneError"),
  password: document.getElementById("passwordError"),
  language: document.getElementById("languageError"),
  about: document.getElementById("aboutError")
};

function validateName() {
  const value = fields.fullName.value.trim();
  if (!/^[A-Za-z ]{2,}$/.test(value)) {
    errors.fullName.textContent = "Enter at least 2 letters, letters only.";
    return false;
  }
  errors.fullName.textContent = "";
  return true;
}

function validateEmail() {
  const value = fields.email.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.email.textContent = "Enter a valid email address.";
    return false;
  }
  errors.email.textContent = "";
  return true;
}

function validatePhone() {
  const value = fields.phone.value.trim();
  if (!phoneToggle.checked) {
    errors.phone.textContent = "";
    return true;
  }
  if (value === "") {
    errors.phone.textContent = "";
    return true;
  }
  if (!/^\d{10}$/.test(value)) {
    errors.phone.textContent = "Phone must be exactly 10 digits.";
    return false;
  }
  errors.phone.textContent = "";
  return true;
}

function validatePassword() {
  const value = fields.password.value;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
  if (!regex.test(value)) {
    errors.password.textContent = "Must be 8+ chars with uppercase, lowercase, digit, special char.";
    return false;
  }
  errors.password.textContent = "";
  return true;
}

function validateLanguage() {
  if (!fields.language.value) {
    errors.language.textContent = "Select a language.";
    return false;
  }
  errors.language.textContent = "";
  return true;
}

function validateAbout() {
  const value = fields.about.value.trim();
  if (value.length < 50 || value.length > 500) {
    errors.about.textContent = "Must be between 50 and 500 characters.";
    return false;
  }
  errors.about.textContent = "";
  return true;
}

function checkAllValidations() {
  const isValid =
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validatePassword() &&
    validateLanguage() &&
    validateAbout();

  saveBtn.disabled = !isValid;
  return isValid;
}

Object.values(fields).forEach(field => {
  field.addEventListener("input", checkAllValidations);
});

phoneToggle.addEventListener("change", () => {
  phoneContainer.style.display = phoneToggle.checked ? "block" : "none";
  checkAllValidations();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkAllValidations()) return;

  const formData = {
    name: fields.fullName.value.trim(),
    email: fields.email.value.trim(),
    phone: phoneToggle.checked ? fields.phone.value.trim() : "",
    password: fields.password.value,
    lang: fields.language.value,
    about: fields.about.value.trim()
  };

  try {
    const res = await fetch("https://admin-staging.whydonate.dev/whydonate/assignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (res.status === 200) {
      document.getElementById("successMessage").textContent = "✅ Save successful!";
      form.reset();
      saveBtn.disabled = true;
      phoneContainer.style.display = "block";
    } else {
      alert("❌ Submission failed. Please check inputs.");
    }
  } catch (error) {
    alert("❌ Network error.");
    console.error(error);
  }
});