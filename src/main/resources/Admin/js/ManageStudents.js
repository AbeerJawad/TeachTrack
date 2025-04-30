// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal functionality
    initModal();
    
    // Setup event listeners for buttons
    setupEventListeners();
});

// Initialize modal functionality
function initModal() {
    const modal = document.getElementById('addStudentModal');
    const addBtn = document.getElementById('addStudentBtn');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    // Open modal when Add Student button is clicked
    addBtn.addEventListener('click', function() {
        modal.classList.add('show');
    });
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });
    
    // Close modal when Cancel button is clicked
    cancelBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // Handle form submission
    const form = document.getElementById('addStudentForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('studentName').value;
        const email = document.getElementById('studentEmail').value;
        const course = document.getElementById('studentCourse').value;
        const status = document.getElementById('studentStatus').value;
        
        // In a real app, you would send this data to the server
        // For now, just show an alert and close the modal
        alert(`Student ${name} has been added successfully!`);
        modal.classList.remove('show');
        form.reset();
    });
}

// Setup event listeners for page functionality
function setupEventListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[0].textContent;
            const name = row.querySelector('.name-with-avatar span').textContent;
            
            // In a real app, you would open an edit form with the student data
            alert(`Edit student ${name} (ID: ${id})`);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[0].textContent;
            const name = row.querySelector('.name-with-avatar span').textContent;
            
            if (confirm(`Are you sure you want to delete student ${name} (ID: ${id})?`)) {
                // In a real app, you would send a delete request to the server
                alert(`Student ${name} has been deleted successfully!`);
                
                // For demo purposes, remove the row from the table
                row.remove();
            }
        });
    });
    
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            alert(`Searching for: ${searchTerm}`);
            // In a real app, this would filter the table or send a request to the server
        }
    });
    
    // Filter functionality
    const filterSelect = document.querySelector('.filter-select');
    filterSelect.addEventListener('change', function() {
        const selectedCourse = this.value;
        if (selectedCourse) {
            alert(`Filtering by course: ${selectedCourse}`);
            // In a real app, this would filter the table or send a request to the server
        }
    });
    
    // Pagination functionality
    const pageNumbers = document.querySelectorAll('.page-number:not(.active)');
    pageNumbers.forEach(page => {
        page.addEventListener('click', function() {
            // In a real app, this would load the corresponding page of students
            alert(`Loading page ${this.textContent}`);
        });
    });
    
    const nextPageBtn = document.querySelector('.page-btn:not([disabled])');
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            // In a real app, this would load the next page of students
            alert('Loading next page');
        });
    }
}