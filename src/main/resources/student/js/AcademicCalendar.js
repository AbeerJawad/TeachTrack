document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const sidebar = document.getElementById("sidebar");
    const pageContent = document.getElementById("pageContent");
    const viewButtons = document.querySelectorAll(".view-button");
    const monthView = document.getElementById("monthView");
    const weekView = document.getElementById("weekView");
    const listView = document.getElementById("listView");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const todayBtn = document.getElementById("todayBtn");
    const currentMonthYearEl = document.getElementById("currentMonthYear");
    const calendarDays = document.getElementById("calendarDays");
    const eventModal = document.getElementById("eventModal");
    const closeModal = document.getElementById("closeModal");
    const modalEventTitle = document.getElementById("modalEventTitle");
    const modalEventDate = document.getElementById("modalEventDate");
    const modalEventTime = document.getElementById("modalEventTime");
    const modalEventLocation = document.getElementById("modalEventLocation");
    const modalEventType = document.getElementById("modalEventType");
    const modalEventDescription = document.getElementById("modalEventDescription");
    const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
    
    // Date tracking
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Load sidebar state and make sure it's collapsible
    // Default to collapsed on first load for better mobile experience
    if (localStorage.getItem("sidebarState") === null) {
        localStorage.setItem("sidebarState", "collapsed");
    }
    
    if (localStorage.getItem("sidebarState") === "collapsed") {
        sidebar.classList.add("collapsed");
        pageContent.classList.add("expanded");
    }
    
    // Load Dark Mode if enabled
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
    
    // Calendar View Switching
    viewButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove("active"));
            
            // Add active class to clicked button
            this.classList.add("active");
            
            // Get the view type from data attribute
            const viewType = this.getAttribute("data-view");
            
            // Hide all views
            monthView.style.display = "none";
            weekView.style.display = "none";
            listView.style.display = "none";
            
            // Show selected view
            if (viewType === "month") {
                monthView.style.display = "block";
            } else if (viewType === "week") {
                weekView.style.display = "block";
            } else if (viewType === "list") {
                listView.style.display = "block";
            }
            
            // Store the view preference
            localStorage.setItem("calendarViewPreference", viewType);
        });
    });
    
    // Load saved view preference
    const savedView = localStorage.getItem("calendarViewPreference");
    if (savedView) {
        document.querySelector(`.view-button[data-view="${savedView}"]`).click();
    }
    
    // Calendar Navigation
    prevBtn.addEventListener("click", function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    nextBtn.addEventListener("click", function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    todayBtn.addEventListener("click", function() {
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        renderCalendar(currentMonth, currentYear);
    });
    
    // Event filtering
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            const filterType = this.getAttribute("data-filter");
            const checked = this.checked;
            
            // Toggle visibility of events with this type
            document.querySelectorAll(`.day-event.${filterType}`).forEach(event => {
                event.style.display = checked ? "block" : "none";
            });
            
            document.querySelectorAll(`.event-item.${filterType}`).forEach(event => {
                event.style.display = checked ? "flex" : "none";
            });
            
            document.querySelectorAll(`.upcoming-event.${filterType}`).forEach(event => {
                event.style.display = checked ? "flex" : "none";
            });
            
            // Store filter preference
            localStorage.setItem(`filter_${filterType}`, checked.toString());
        });
        
        // Load saved filter preferences
        const savedFilter = localStorage.getItem(`filter_${checkbox.getAttribute("data-filter")}`);
        if (savedFilter === "false") {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
    
    // Modal handling
    closeModal.addEventListener("click", function() {
        eventModal.style.display = "none";
    });
    
    window.addEventListener("click", function(event) {
        if (event.target === eventModal) {
            eventModal.style.display = "none";
        }
    });
    
    document.getElementById("addToCalendar").addEventListener("click", function() {
        // This would connect to a backend API to add event to user's personal calendar
        alert("Event added to your personal calendar!");
        eventModal.style.display = "none";
    });
    
    document.getElementById("setReminder").addEventListener("click", function() {
        // This would connect to a backend API to set up notifications
        alert("Reminder set! You will be notified before this event.");
        eventModal.style.display = "none";
    });
    
    // Search functionality
    const searchInput = document.querySelector(".search-input");
    searchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        
        // Search in month view
        document.querySelectorAll(".day-event").forEach(event => {
            const eventTitle = event.textContent.toLowerCase();
            const shouldShow = eventTitle.includes(searchTerm);
            event.style.display = shouldShow ? "block" : "none";
        });
        
        // Search in list view
        document.querySelectorAll(".event-item").forEach(event => {
            const eventTitle = event.querySelector(".event-title").textContent.toLowerCase();
            const eventDesc = event.querySelector(".event-description").textContent.toLowerCase();
            const shouldShow = eventTitle.includes(searchTerm) || eventDesc.includes(searchTerm);
            event.style.display = shouldShow ? "flex" : "none";
        });
        
        // Search in upcoming events
        document.querySelectorAll(".upcoming-event").forEach(event => {
            const eventTitle = event.querySelector("h4").textContent.toLowerCase();
            const shouldShow = eventTitle.includes(searchTerm);
            event.style.display = shouldShow ? "flex" : "none";
        });
    });
    
    // Sample calendar events data (in a real app, this would come from backend)
    const calendarEvents = [
        {
            id: 1,
            title: "Spring Semester Begins",
            date: new Date(2025, 3, 1), // April 1, 2025
            time: "All Day",
            location: "University Campus",
            type: "academic",
            description: "First day of Spring Semester classes for all students."
        },
        {
            id: 2,
            title: "Course Registration Deadline",
            date: new Date(2025, 3, 5), // April 5, 2025
            time: "11:59 PM",
            location: "Online Portal",
            type: "deadline",
            description: "Last day to add/drop courses without academic penalty."
        },
        {
            id: 3,
            title: "Career Fair",
            date: new Date(2025, 3, 10), // April 10, 2025
            time: "10:00 AM - 4:00 PM",
            location: "University Center",
            type: "event",
            description: "Annual Spring Career Fair. Bring your resume and dress professionally."
        },
        {
            id: 4,
            title: "CS101 Midterm",
            date: new Date(2025, 3, 15), // April 15, 2025
            time: "2:00 PM - 4:00 PM",
            location: "Building A, Room 101",
            type: "exam",
            description: "Introduction to Programming midterm examination. Bring student ID and pencils."
        },
        {
            id: 5,
            title: "Spring Break",
            date: new Date(2025, 3, 20), // April 20, 2025
            endDate: new Date(2025, 3, 27), // April 27, 2025
            time: "All Week",
            location: "N/A",
            type: "holiday",
            description: "Spring Break week. No classes during this period."
        },
        {
            id: 6,
            title: "Final Exams Begin",
            date: new Date(2025, 4, 1), // May 1, 2025
            time: "All Day",
            location: "Various Locations",
            type: "exam",
            description: "Spring semester final examinations begin."
        },
        {
            id: 7,
            title: "Research Paper Deadline",
            date: new Date(2025, 4, 12), // May 12, 2025
            time: "11:59 PM",
            location: "Online Submission",
            type: "deadline",
            description: "Final deadline for CS202 research paper submission."
        },
        {
            id: 8,
            title: "Graduation Ceremony",
            date: new Date(2025, 4, 20), // May 20, 2025
            time: "10:00 AM - 1:00 PM",
            location: "Main Auditorium",
            type: "event",
            description: "Spring graduation ceremony for all departments."
        },
        {
            id: 9,
            title: "Memorial Day",
            date: new Date(2025, 4, 26), // May 26, 2025
            time: "All Day",
            location: "N/A",
            type: "holiday",
            description: "University closed for Memorial Day holiday."
        },
        {
            id: 10,
            title: "Summer Registration",
            date: new Date(2025, 5, 1), // June 1, 2025
            time: "9:00 AM",
            location: "Online Portal",
            type: "academic",
            description: "Summer semester registration opens for all students."
        }
    ];
    
    // Render the calendar
    function renderCalendar(month, year) {
        // Update the month/year display
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        currentMonthYearEl.textContent = `${monthNames[month]} ${year}`;
        
        // Clear the current calendar days
        calendarDays.innerHTML = "";
        
        // Get the first day of the month
        const firstDay = new Date(year, month, 1).getDay();
        
        // Get the number of days in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get the number of days in the previous month
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Calculate total calendar cells needed (max 6 rows x 7 days)
        const totalCells = 42;
        
        // Current date for highlighting today
        const today = new Date();
        const currentDateValue = today.getDate();
        const currentMonthValue = today.getMonth();
        const currentYearValue = today.getFullYear();
        
        // Create calendar day cells
        for (let i = 0; i < totalCells; i++) {
            const dayCell = document.createElement("div");
            dayCell.className = "calendar-day";
            
            // Cell index
            const cellIndex = i;
            
            // Adjust for days from previous month
            if (cellIndex < firstDay) {
                const prevMonthDay = daysInPrevMonth - (firstDay - cellIndex - 1);
                dayCell.innerHTML = `<div class="day-number">${prevMonthDay}</div><div class="day-events"></div>`;
                dayCell.classList.add("other-month");
                
                // Previous month date
                const prevMonth = month === 0 ? 11 : month - 1;
                const prevYear = month === 0 ? year - 1 : year;
                dayCell.setAttribute("data-date", `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}-${prevMonthDay.toString().padStart(2, '0')}`);
            } 
            // Days from next month
            else if (cellIndex >= firstDay + daysInMonth) {
                const nextMonthDay = cellIndex - (firstDay + daysInMonth) + 1;
                dayCell.innerHTML = `<div class="day-number">${nextMonthDay}</div><div class="day-events"></div>`;
                dayCell.classList.add("other-month");
                
                // Next month date
                const nextMonth = month === 11 ? 0 : month + 1;
                const nextYear = month === 11 ? year + 1 : year;
                dayCell.setAttribute("data-date", `${nextYear}-${(nextMonth + 1).toString().padStart(2, '0')}-${nextMonthDay.toString().padStart(2, '0')}`);
            } 
            // Current month days
            else {
                const day = cellIndex - firstDay + 1;
                dayCell.innerHTML = `<div class="day-number">${day}</div><div class="day-events"></div>`;
                
                // Highlight today
                if (day === currentDateValue && month === currentMonthValue && year === currentYearValue) {
                    dayCell.classList.add("current-day");
                }
                
                // Set data attribute for the date
                dayCell.setAttribute("data-date", `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
            }
            
            calendarDays.appendChild(dayCell);
        }
        
        // Add events to the calendar
        addEventsToCalendar(calendarEvents, month, year);
    }
    
    // Add events to the calendar cells
    function addEventsToCalendar(events, month, year) {
        events.forEach(event => {
            const eventDate = event.date;
            
            // Skip events not in the current month/year
            if (eventDate.getMonth() !== month || eventDate.getFullYear() !== year) {
                return;
            }
            
            const eventDay = eventDate.getDate();
            const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${eventDay.toString().padStart(2, '0')}`;
            const dayCell = document.querySelector(`.calendar-day[data-date="${dateString}"]`);
            
            if (dayCell) {
                const dayEvents = dayCell.querySelector(".day-events");
                const eventElement = document.createElement("div");
                eventElement.className = `day-event ${event.type}`;
                eventElement.textContent = event.title;
                
                // Store event data as attributes
                eventElement.setAttribute("data-event-id", event.id);
                
                // Add click event to show modal
                eventElement.addEventListener("click", () => showEventModal(event));
                
                dayEvents.appendChild(eventElement);
                
                // Check if we need a "more" indicator
                if (dayEvents.children.length > 3) {
                    // If there are too many events, add a "more" indicator
                    if (!dayCell.querySelector(".more-events")) {
                        const eventCount = dayEvents.children.length;
                        const moreIndicator = document.createElement("div");
                        moreIndicator.className = "more-events";
                        moreIndicator.textContent = `+ ${eventCount - 2} more`;
                        dayCell.appendChild(moreIndicator);
                        
                        // Show all events when clicking on "more"
                        moreIndicator.addEventListener("click", function() {
                            // Here you could show a popover with all events
                            // For simplicity, we'll just show the modal with the first event
                            showEventModal(event);
                        });
                    }
                }
            }
        });
    }
    
    // Show event details in modal
    function showEventModal(event) {
        modalEventTitle.textContent = event.title;
        
        // Format date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        modalEventDate.textContent = event.date.toLocaleDateString('en-US', options);
        
        // Set other event details
        modalEventTime.textContent = event.time;
        modalEventLocation.textContent = event.location;
        modalEventType.textContent = event.type.charAt(0).toUpperCase() + event.type.slice(1);
        modalEventDescription.textContent = event.description;
        
        // Display the modal
        eventModal.style.display = "flex";
    }
    
    // Initialize the calendar
    renderCalendar(currentMonth, currentYear);
});

// Sidebar toggle functionality
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const pageContent = document.getElementById("pageContent");
    
    sidebar.classList.toggle("collapsed");
    pageContent.classList.toggle("expanded");
    
    // Save sidebar state
    if (sidebar.classList.contains("collapsed")) {
        localStorage.setItem("sidebarState", "collapsed");
    } else {
        localStorage.setItem("sidebarState", "expanded");
    }
}