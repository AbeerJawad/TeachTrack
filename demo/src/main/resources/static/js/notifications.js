document.addEventListener("DOMContentLoaded", function () {
    loadNotifications();
    setupFilterButtons();
    setupMarkReadButton();
});

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter notifications
            const filter = this.getAttribute('data-filter');
            filterNotifications(filter);
        });
    });
}

function setupMarkReadButton() {
    const markReadBtn = document.querySelector('.mark-read-btn');
    
    markReadBtn.addEventListener('click', function() {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.classList.remove('unread');
        });
        
        // In a real app, you would send this to the server
        console.log('Marked all notifications as read');
    });
}

function filterNotifications(filter) {
    const notifications = document.querySelectorAll('.notification');
    
    notifications.forEach(notification => {
        if (filter === 'all') {
            notification.style.display = 'flex';
        } else if (filter === 'unread' && notification.classList.contains('unread')) {
            notification.style.display = 'flex';
        } else if (notification.classList.contains(filter)) {
            notification.style.display = 'flex';
        } else {
            notification.style.display = 'none';
        }
    });
}

function loadNotifications() {
    let notificationList = document.getElementById("notificationList");
    
    // Dummy data (replace this with dynamic backend data later)
    let notifications = [
        { 
            message: "New feedback received for CS101", 
            details: "From: Student ID 10293 • Course: CS101 • Topic: Week 3 Material",
            time: "5 mins ago", 
            icon: "fas fa-comment-dots",
            isUnread: true,
            type: "feedback"
        },
        { 
            message: "Response sent successfully to a student", 
            details: "Student ID: 39485 • Course: CS101 • Response ID: 12345",
            time: "1 hour ago", 
            icon: "fas fa-paper-plane",
            isUnread: true,
            type: "feedback" 
        },
        { 
            message: "Weekly feedback summary is available", 
            details: "Period: Mar 14 - Mar 20, 2025 • Courses: All",
            time: "Yesterday", 
            icon: "fas fa-chart-bar",
            isUnread: false,
            type: "system" 
        },
        { 
            message: "Reminder: Review pending feedback for CS202", 
            details: "5 feedback items awaiting your response",
            time: "2 days ago", 
            icon: "fas fa-bell",
            isUnread: false,
            type: "feedback" 
        },
        { 
            message: "System update scheduled this weekend", 
            details: "Maintenance window: Mar 22, 2025, 2:00 AM - 4:00 AM EST",
            time: "3 days ago", 
            icon: "fas fa-cog",
            isUnread: false,
            type: "system" 
        }
    ];
    
    // Populate the notifications
    notificationList.innerHTML = "";
    
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-bell-slash"></i>
                </div>
                <div class="empty-state-text">You have no notifications at this time</div>
            </div>`;
        return;
    }
    
    notifications.forEach(notification => {
        let notifClasses = `notification ${notification.type}`;
        if (notification.isUnread) notifClasses += ' unread';
        
        let notif = `
            <div class="${notifClasses}">
                <div class="notification-content">
                    <div class="notification-icon">
                        <i class="${notification.icon}"></i>
                    </div>
                    <div class="notification-text">
                        <p>${notification.message}</p>
                        <div class="message-details">${notification.details}</div>
                    </div>
                </div>
                <span class="time">${notification.time}</span>
            </div>`;
        notificationList.innerHTML += notif;
    });
}