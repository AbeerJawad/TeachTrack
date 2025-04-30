// Tab functionality
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Tab switching functionality
  tabButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Remove active class from all buttons and contents
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
          
          // Add active class to current button
          button.classList.add('active');
          
          // Show corresponding content
          const tabId = button.getAttribute('data-tab');
          document.getElementById(`${tabId}-tab`).classList.add('active');
      });
  });
  
  // Edit Profile button functionality
  const editProfileBtn = document.querySelector('.edit-profile-btn');
  if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
          // Make form fields editable
          const formInputs = document.querySelectorAll('#personal-tab input, #personal-tab select, #personal-tab textarea');
          formInputs.forEach(input => {
              if (input.hasAttribute('readonly')) {
                  input.removeAttribute('readonly');
              }
              if (input.hasAttribute('disabled')) {
                  input.removeAttribute('disabled');
              }
              input.style.backgroundColor = '#fff';
          });
          
          // Create button group
          if (!document.querySelector('.button-group')) {
              // Create button group
              const buttonGroup = document.createElement('div');
              buttonGroup.className = 'button-group';
              
              // Create cancel button
              const cancelBtn = document.createElement('button');
              cancelBtn.className = 'cancel-btn';
              cancelBtn.textContent = 'Cancel';
              
              // Create save button
              const saveBtn = document.createElement('button');
              saveBtn.className = 'save-btn';
              saveBtn.textContent = 'Save Changes';
              
              // Add buttons to group
              buttonGroup.appendChild(cancelBtn);
              buttonGroup.appendChild(saveBtn);
              
              // Replace edit button with button group
              editProfileBtn.parentNode.replaceChild(buttonGroup, editProfileBtn);
              
              // Cancel button functionality
              cancelBtn.addEventListener('click', () => {
                  location.reload();
              });
              
              // Save button functionality
              saveBtn.addEventListener('click', () => {
                  alert('Profile changes saved!');
                  location.reload();
              });
          }
      });
  }
  
  // Side panel toggle functionality (if present)
  const menuToggle = document.getElementById('menuToggle');
  const sidePanel = document.getElementById('sidePanel');
  
  if (menuToggle && sidePanel) {
      menuToggle.addEventListener('click', function() {
          sidePanel.classList.toggle('active');
          document.querySelector('.main-content').classList.toggle('shifted');
      });
  }
});