document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    const notificationsList = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageEl = document.getElementById('currentPage');
    const modal = document.getElementById('notificationDetailModal');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const dismissBtn = document.getElementById('dismissBtn');
    const actionBtn = document.getElementById('actionBtn');
    
    // Sidebar toggle
    const menuToggle = document.getElementById('menuToggle');
    
    // Toggle Sidebar - updated to match StuDashboard.js approach
    menuToggle.addEventListener('click', function() {
        toggleSidebar();
    });
    
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.style.left === "0px") {
            sidebar.style.left = "-280px";
            document.querySelector('.main-section').style.marginLeft = "0";
        } else {
            sidebar.style.left = "0px";
            document.querySelector('.main-section').style.marginLeft = "280px";
        }
    }
    
    // Pagination state
    let currentPage = 0;
    let totalPages = 0;
    
    // Filter state
    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'newest';
    
    // Get user ID from session storage (set during login)
    const userId = getUserIdFromSession();
    
    // Function to get user ID - updated to match StuDashboard.js approach
    function getUserIdFromSession() {
        return localStorage.getItem('userId') || 1; // Default to 1 if not found
    }
    
    // Initial load
    loadNotifications();
    
    // Event listeners
    searchBtn.addEventListener('click', function() {
        currentSearch = searchInput.value.trim();
        currentPage = 0;
        loadNotifications();
    });
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            currentSearch = searchInput.value.trim();
            currentPage = 0;
            loadNotifications();
        }
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            currentPage = 0;
            loadNotifications();
        });
    });
    
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        currentPage = 0;
        loadNotifications();
    });
    
    markAllReadBtn.addEventListener('click', function() {
        markAllAsRead();
    });
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 0) {
            currentPage--;
            loadNotifications();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            loadNotifications();
        }
    });
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    dismissBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Load notifications from API
    function loadNotifications() {
        notificationsList.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-circle-notch fa-spin"></i>
                <span>Loading notifications...</span>
            </div>
        `;
        
        // API URL with query parameters
        const url = `/api/students/${userId}/notifications?page=${currentPage}&size=10&search=${encodeURIComponent(currentSearch)}&type=${currentFilter}&sort=${currentSort}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayNotifications(data);
                updatePagination(data);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
                notificationsList.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Failed to load notifications. Please try again later.</p>
                    </div>
                `;
            });
    }
    
    // Display notifications in the list
    function displayNotifications(data) {
        const notifications = data.content;
        
        if (notifications.length === 0) {
            notificationsList.innerHTML = '';
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
            
            let html = '';
            notifications.forEach(notification => {
                const dateObject = new Date(notification.created_at);
                const formattedDate = dateObject.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                });
                const formattedTime = dateObject.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                });
                
                let icon;
                switch(notification.notification_type) {
                    case 'feedback':
                        icon = 'fas fa-comment-dots';
                        break;
                    case 'deadline':
                        icon = 'fas fa-hourglass-end';
                        break;
                    case 'announcement':
                        icon = 'fas fa-bullhorn';
                        break;
                    default:
                        icon = 'fas fa-bell';
                }
                
                html += `
                    <div class="notification-item ${notification.is_read ? '' : 'unread'}" data-id="${notification.notification_id}">
                        <div class="notification-icon ${notification.notification_type}">
                            <i class="${icon}"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-header">
                                <h4>${notification.title}</h4>
                                <span class="notification-date">${formattedDate} at ${formattedTime}</span>
                            </div>
                            <p class="notification-message">${notification.message}</p>
                            <div class="notification-actions">
                                <button class="view-btn" onclick="viewNotification(${notification.notification_id})">
                                    <i class="fas fa-eye"></i> View Details
                                </button>
                                ${!notification.is_read ? `
                                <button class="mark-read-btn" onclick="markAsRead(event, ${notification.notification_id})">
                                    <i class="fas fa-check"></i> Mark as Read
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            notificationsList.innerHTML = html;
            
            // Add event listeners to notification items
            document.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    if (!e.target.closest('button')) {
                        const notificationId = this.getAttribute('data-id');
                        viewNotification(notificationId);
                    }
                });
            });
        }
    }
    
    // Update pagination controls
    function updatePagination(data) {
        totalPages = data.totalPages;
        currentPageEl.textContent = currentPage + 1;
        
        prevPageBtn.disabled = currentPage === 0;
        nextPageBtn.disabled = currentPage >= totalPages - 1;
        
        // Update the page display
        if (totalPages === 0) {
            document.getElementById('pagination').style.display = 'none';
        } else {
            document.getElementById('pagination').style.display = 'flex';
        }
    }
    
    // View notification details
    window.viewNotification = function(notificationId) {
        fetch(`/api/students/${userId}/notifications/${notificationId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(notification => {
                if (notification.error) {
                    alert(notification.message);
                    return;
                }
                
                // Format date
                const dateObject = new Date(notification.created_at);
                const formattedDate = dateObject.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                // Update modal content
                modalTitle.textContent = notification.title;
                
                let modalContent = `
                    <div class="notification-detail">
                        <div class="detail-header">
                            <span class="detail-type ${notification.notification_type}">
                                ${notification.notification_type.charAt(0).toUpperCase() + notification.notification_type.slice(1)}
                            </span>
                            <span class="detail-date">${formattedDate}</span>
                        </div>
                        <div class="detail-message">
                            ${notification.message}
                        </div>
                `;
                
                // Add related content if available
                if (notification.relatedContent) {
                    const related = notification.relatedContent;
                    
                    if (notification.notification_type === 'feedback') {
                        const deadlineDate = new Date(related.end_date);
                        const formattedDeadline = deadlineDate.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                        });
                        
                        modalContent += `
                            <div class="detail-related">
                                <h4>Feedback Form Details</h4>
                                <div class="related-info">
                                    <p><strong>Course:</strong> ${related.course_code} - ${related.course_title}</p>
                                    <p><strong>Form:</strong> ${related.form_title}</p>
                                    <p><strong>Deadline:</strong> ${formattedDeadline}</p>
                                </div>
                            </div>
                        `;
                        
                        // Update action button for feedback
                        actionBtn.textContent = 'Go to Feedback Form';
                        actionBtn.onclick = function() {
                            window.location.href = `Feedback.html?formId=${related.form_id}`;
                        };
                        actionBtn.style.display = 'block';
                    }
                } else {
                    actionBtn.style.display = 'none';
                }
                
                modalContent += `</div>`;
                modalBody.innerHTML = modalContent;
                
                // Show modal
                modal.style.display = 'block';
                
                // Mark as read if needed
                if (!notification.is_read) {
                    markAsRead(null, notificationId);
                }
                
                // Refresh notification list to update read status
                loadNotifications();
            })
            .catch(error => {
                console.error('Error fetching notification details:', error);
                alert('Failed to load notification details. Please try again later.');
            });
    };
    
    // Mark notification as read
    window.markAsRead = function(event, notificationId) {
        if (event) {
            event.stopPropagation();
        }
        
        fetch(`/api/students/${userId}/notifications/${notificationId}/read`, {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    loadNotifications();
                }
            })
            .catch(error => {
                console.error('Error marking notification as read:', error);
            });
    };
    
    // Mark all notifications as read
    function markAllAsRead() {
        fetch(`/api/students/${userId}/notifications/read-all`, {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    loadNotifications();
                }
            })
            .catch(error => {
                console.error('Error marking all notifications as read:', error);
            });
    }
    
    // Add notification message function consistent with StuDashboard.js
    function showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Add animation classes
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300); // Match the CSS transition time
        }, 3000);
    }
    
    // Logout functionality
    function logout() {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        window.location.href = '../Startpage.html';
    }

    // Attach logout handler
    const logoutLink = document.querySelector('a[href="../Startpage.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});