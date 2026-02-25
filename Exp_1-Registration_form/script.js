
document.getElementById("patientForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;

  function showError(id, message) {
    document.getElementById(id).innerText = message;
    document.getElementById(id).classList.add("show");
    valid = false;
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach(e => {
      e.innerText = "";
      e.classList.remove("show");
    });
  }

  clearErrors();

  // Get form values
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const aadharNumber = document.getElementById("aadharNumber").value.replace(/-/g, "");
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const emergencyContactName = document.getElementById("emergencyContactName").value.trim();
  const emergencyContactPhone = document.getElementById("emergencyContactPhone").value.trim();
  const consentToTreat = document.getElementById("consentToTreat").checked;
  const consentToShare = document.getElementById("consentToShare").checked;

  // Validate fields
  if (firstName === "") 
    showError("firstName-error", "First name is required");

  if (lastName === "") 
    showError("lastName-error", "Last name is required");

  if (!/^\S+@\S+\.\S+$/.test(email))
    showError("email-error", "Invalid email address");

  if (!/^\d{10}$/.test(phone))
    showError("phone-error", "Phone must be 10 digits");

  if (!/^\d{12}$/.test(aadharNumber))
    showError("aadharNumber-error", "Aadhar must be 12 digits");

  if (password.length < 8)
    showError("password-error", "Password must be at least 8 characters");

  if (password !== confirmPassword)
    showError("confirmPassword-error", "Passwords do not match");

  if (emergencyContactName === "")
    showError("emergencyContactName-error", "Emergency contact name is required");

  if (!/^\d{10}$/.test(emergencyContactPhone))
    showError("emergencyContactPhone-error", "Emergency phone must be 10 digits");

  if (!consentToTreat)
    showError("consentToTreat-error", "You must consent to treatment");

  if (!consentToShare)
    showError("consentToShare-error", "You must acknowledge the privacy policy");

  // If valid, show success
  if (valid) {
    const successMessage = document.getElementById("successMessage");
    document.getElementById("successText").innerText = 
      `${firstName} ${lastName} has been successfully registered!`;
    
    document.getElementById("patientForm").style.display = "none";
    successMessage.style.display = "block";
    
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    console.log("Patient registered successfully!");
  }
});

// Auto-format Aadhar number as XXXX-XXXX-XXXX
document.getElementById("aadharNumber").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 12) value = value.slice(0, 12);
  const formatted = value.match(/.{1,4}/g)?.join("-") || value;
  e.target.value = formatted;
});

// Reset button handler
document.getElementById("patientForm").addEventListener("reset", function () {
  setTimeout(() => {
    document.querySelectorAll(".error").forEach(e => {
      e.innerText = "";
      e.classList.remove("show");
    });
    document.getElementById("successMessage").style.display = "none";
    document.getElementById("patientForm").style.display = "block";
  }, 0);
});

//test
//sandra test11
//keerthu test