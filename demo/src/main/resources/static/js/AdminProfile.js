// Example: Handle form inputs
document.addEventListener("DOMContentLoaded", () => {
    const fullNameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email");
  
    fullNameInput.addEventListener("input", () => {
      console.log("Full Name updated:", fullNameInput.value);
    });
  
    emailInput.addEventListener("input", () => {
      console.log("Email updated:", emailInput.value);
    });
  });
  