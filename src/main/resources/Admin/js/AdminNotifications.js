// Filter notifications functionality
document.addEventListener("DOMContentLoaded", function() {
    // Get all filter buttons and notification items
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notificationItems = document.querySelectorAll('.notification-item');
    
    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide notification items based on filter
            notificationItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'flex';
                } else if (item.classList.contains(filterValue)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Mark all as read button functionality
    const markReadButton = document.querySelector('.mark-read-btn');
    markReadButton.addEventListener('click', function() {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        alert('All notifications marked as read');
    });
    
    // Pagination button functionality
    const pageButtons = document.querySelectorAll('.page-btn:not(.next)');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            pageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // In a real application, this would load a new page of notifications
            // For this demo, we'll just show an alert
            if (!this.classList.contains('active')) {
                alert(`Loading page ${this.textContent}`);
            }
        });
    });
    
    // Next page button
    const nextButton = document.querySelector('.page-btn.next');
    nextButton.addEventListener('click', function() {
        // Find current active page
        const activePage = document.querySelector('.page-btn.active');
        const nextPage = activePage.nextElementSibling;
        
        if (nextPage && !nextPage.classList.contains('next')) {
            activePage.classList.remove('active');
            nextPage.classList.add('active');
            // Alert for demo purposes
            alert(`Loading page ${nextPage.textContent}`);
        }
    });
});