// Function to get feedback details from URL parameters
function getFeedbackDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course') || 'Not Available';
    const studentId = urlParams.get('id') || 'Anonymous';
    const rating = urlParams.get('rating') || 'No Rating';
    const comments = urlParams.get('comments') || 'No Comments';
    const instructor = urlParams.get('instructor') || 'Unknown Instructor';
    const date = urlParams.get('date') || 'Not Available';
    
    // Enhanced Sentiment Analysis
    let sentiment = "Neutral";
    let sentimentClass = "neutral";
    
    // Create an array of positive and negative keywords
    const positiveKeywords = ["great", "excellent", "good", "awesome", "amazing", "helpful", "fantastic", "enjoyed", "love", "best"];
    const negativeKeywords = ["bad", "poor", "terrible", "disappointed", "needs improvement", "frustrating", "confusing", "waste", "worst", "hate"];
    
    const commentLower = comments.toLowerCase();
    
    // Count matches
    let positiveMatches = 0;
    let negativeMatches = 0;
    
    positiveKeywords.forEach(keyword => {
        if (commentLower.includes(keyword)) positiveMatches++;
    });
    
    negativeKeywords.forEach(keyword => {
        if (commentLower.includes(keyword)) negativeMatches++;
    });
    
    // Determine sentiment
    if (positiveMatches > negativeMatches) {
        sentiment = "Positive";
        sentimentClass = "positive";
    } else if (negativeMatches > positiveMatches) {
        sentiment = "Negative";
        sentimentClass = "negative";
    }
    
    // Format rating with stars
    let ratingDisplay = '';
    if (!isNaN(parseFloat(rating))) {
        const ratingValue = parseFloat(rating);
        const fullStars = Math.floor(ratingValue);
        const hasHalfStar = ratingValue % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            ratingDisplay += '<i class="fas fa-star rating-star"></i>';
        }
        
        if (hasHalfStar) {
            ratingDisplay += '<i class="fas fa-star-half-alt rating-star"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(ratingValue);
        for (let i = 0; i < emptyStars; i++) {
            ratingDisplay += '<i class="far fa-star rating-star"></i>';
        }
        
        ratingDisplay += ` (${rating})`;
    } else {
        ratingDisplay = rating;
    }
    
    // Format date nicely if it's a valid date
    let formattedDate = date;
    if (date !== 'Not Available') {
        try {
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        } catch (e) {
            // Keep original date if parsing fails
        }
    }
    
    // Add sentiment icon based on analysis
    let sentimentIcon = '';
    if (sentiment === "Positive") {
        sentimentIcon = '<i class="fas fa-smile"></i> ';
    } else if (sentiment === "Negative") {
        sentimentIcon = '<i class="fas fa-frown"></i> ';
    } else {
        sentimentIcon = '<i class="fas fa-meh"></i> ';
    }
    
    // Populate the page with feedback details
    document.getElementById('course-name').innerText = course;
    document.getElementById('student-id').innerText = studentId;
    document.getElementById('rating').innerHTML = ratingDisplay;
    document.getElementById('comments').innerText = comments;
    document.getElementById('instructor').innerText = instructor;
    document.getElementById('feedback-date').innerText = formattedDate;
    document.getElementById('sentiment').innerHTML = sentimentIcon + sentiment;
    document.getElementById('sentiment').classList.add(sentimentClass);
    
    // Populate mock stats for demonstration
    populateMockStats();
    
    // Animation effect for the data loading
    animateDataLoading();
}

// Function to populate mock stats for the cards
function populateMockStats() {
    // This would normally fetch from an API or database
    setTimeout(() => {
        document.getElementById('total-feedback').innerText = '245';
        document.getElementById('avg-rating').innerHTML = '4.2 <i class="fas fa-star" style="font-size: 0.8em; color: gold;"></i>';
        document.getElementById('positive-percent').innerText = '78%';
        
        // Animate the stats cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = "0";
                card.style.transform = "translateY(20px)";
                card.classList.add('reveal-card');
                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, 100);
            }, index * 150);
        });
    }, 800);
}

// Function to animate data loading
function animateDataLoading() {
    const infoValues = document.querySelectorAll('.info-value');
    infoValues.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = "0";
            element.classList.add('fade-in');
            setTimeout(() => {
                element.style.opacity = "1";
            }, 100);
        }, index * 150);
    });
}

// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.querySelector('.toggle-dark-mode');
    
    // Check for saved dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
    
    // Toggle dark mode when button is clicked
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                localStorage.setItem("darkMode", "disabled");
            } else {
                document.body.classList.add('dark-mode');
                localStorage.setItem("darkMode", "enabled");
            }
        });
    }
    
    // Add hover effects for feedback rows
    const infoRows = document.querySelectorAll('.info-row');
    infoRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.paddingLeft = '5px';
        });
        row.addEventListener('mouseleave', function() {
            this.style.paddingLeft = '0';
        });
    });
    
    // Run the main function
    getFeedbackDetails();
});

// Listen for dark mode preferences from the system
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches && localStorage.getItem("darkMode") !== "disabled") {
        document.body.classList.add("dark-mode");
    } else if (!event.matches && localStorage.getItem("darkMode") !== "enabled") {
        document.body.classList.remove("dark-mode");
    }
});