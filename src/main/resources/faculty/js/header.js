document.addEventListener("DOMContentLoaded", function() {
    // Load the header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            // Insert the header at the beginning of the body
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // Set the page title based on the current page
            const pageTitleElement = document.querySelector('.dashboard-title h1');
            if (pageTitleElement) {
                const currentPage = document.title || 'Page Title';
                pageTitleElement.textContent = currentPage;
            }
        })
        .catch(error => console.error('Error loading header:', error));
});