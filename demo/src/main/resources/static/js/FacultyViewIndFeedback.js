// Main function to load feedback details when the page loads
function loadFeedbackDetails() {
    // Get the feedback ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackId = urlParams.get('id');
    
    if (feedbackId) {
        // Fetch feedback details from API
        fetchFeedbackDetails(feedbackId);
    } else {
        // Display an error message if no feedback ID is provided
        document.getElementById('comments').innerText = "No feedback ID provided. Please return to the dashboard and select a feedback item.";
    }

    // Initialize UI interactions
    initializeCourseSearch();
    initializeThemeToggle();
    initializeActionButtons();
}

// Function to fetch feedback details from the API
async function fetchFeedbackDetails(feedbackId) {
    try {
        // Fetch feedback details from API
        const response = await fetch(`/feedback/api/individual/${feedbackId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch feedback details');
        }
        
        const data = await response.json();
        
        // Extract feedback and course data
        const feedback = data.feedback;
        const course = data.course;
        
        // Populate the page with feedback details
        document.getElementById('course-name').innerText = course.courseName || 'Not Specified';
        document.getElementById('student-id').innerText = feedback.studentId || 'Anonymous';
        document.getElementById('rating').innerText = feedback.rating + " / 5";
        document.getElementById('comments').innerText = feedback.comments || 'No comments provided';
        document.getElementById('feedback-date').innerText = formatDate(feedback.submissionDate);
        
        // Display star rating
        displayStars(feedback.rating);
        
        // Enhanced Sentiment Analysis
        analyzeSentiment(feedback.comments);
        
        // Extract key points
        extractKeyPoints(feedback.comments);
        
        // Suggest action items based on feedback
        suggestActionItems(feedback.comments, feedback.rating);
        
        // Fetch and update faculty stats
        fetchFacultyStats(feedback.facultyId);
        
        // Fetch similar feedback
        fetchSimilarFeedback(feedbackId, feedback.courseId);
        
    } catch (error) {
        console.error('Error fetching feedback details:', error);
        document.getElementById('comments').innerText = "Error loading feedback. Please try again later.";
    }
}

// Function to fetch faculty statistics
async function fetchFacultyStats(facultyId) {
    if (!facultyId) return;
    
    try {
        // Fetch faculty stats from API
        const response = await fetch(`/feedback/api/faculty/${facultyId}/stats`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch faculty statistics');
        }
        
        const stats = await response.json();
        
        // Update the UI with faculty stats
        document.getElementById('avg-rating').innerText = stats.averageRating.toFixed(1) + '/5';
        document.getElementById('total-respondents').innerText = stats.totalFeedback;
        document.getElementById('last-updated').innerText = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
    } catch (error) {
        console.error('Error fetching faculty stats:', error);
    }
}

// Function to fetch similar feedback
async function fetchSimilarFeedback(feedbackId, courseId) {
    if (!feedbackId || !courseId) return;
    
    try {
        // Fetch similar feedback from API
        const response = await fetch(`/feedback/api/similar?feedbackId=${feedbackId}&courseId=${courseId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch similar feedback');
        }
        
        const similarFeedbacks = await response.json();
        
        // Get the container for similar feedback cards
        const similarFeedbackContainer = document.querySelector('.similar-feedback-cards');
        similarFeedbackContainer.innerHTML = ''; // Clear existing content
        
        // Add similar feedback cards to the container
        similarFeedbacks.forEach(feedback => {
            const card = document.createElement('div');
            card.className = 'similar-card';
            
            card.innerHTML = `
                <p><strong>Anonymous ID:</strong> ${feedback.studentId || 'Anonymous'}</p>
                <p><strong>Rating:</strong> ${feedback.rating}/5</p>
                <p class="truncate-text"><strong>Comment:</strong> ${feedback.comments || 'No comments provided'}</p>
                <button class="view-more-btn" data-id="${feedback.id}">View Details</button>
            `;
            
            similarFeedbackContainer.appendChild(card);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.view-more-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const feedbackId = this.getAttribute('data-id');
                window.location.href = `view-individual-feedback.html?id=${feedbackId}`;
            });
        });
        
    } catch (error) {
        console.error('Error fetching similar feedback:', error);
    }
}

// Function to fetch course statistics when a course is selected
async function fetchCourseStats(courseId) {
    if (!courseId) return;
    
    try {
        // Fetch course stats from API
        const response = await fetch(`/feedback/api/course/${courseId}/stats`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch course statistics');
        }
        
        const stats = await response.json();
        
        // Update the UI with course stats
        document.getElementById('avg-rating').innerText = stats.averageRating.toFixed(1) + '/5';
        document.getElementById('total-respondents').innerText = stats.totalFeedback;
        document.getElementById('last-updated').innerText = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
    } catch (error) {
        console.error('Error fetching course stats:', error);
    }
}

// Function to fetch faculty courses for the dropdown
async function fetchFacultyCourses(facultyId) {
    if (!facultyId) return;
    
    try {
        // Fetch faculty courses from API
        const response = await fetch(`/feedback/api/faculty/${facultyId}/courses`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch faculty courses');
        }
        
        const courses = await response.json();
        
        // Get the course filter dropdown
        const courseFilter = document.getElementById('course-filter');
        
        // Clear existing options (except the first one)
        while (courseFilter.options.length > 1) {
            courseFilter.remove(1);
        }
        
        // Add course options to the dropdown
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.courseName;
            courseFilter.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error fetching faculty courses:', error);
    }
}

// Function to display star rating visually
function displayStars(rating) {
    let starsHTML = '';
    const numRating = parseFloat(rating);
    
    for (let i = 1; i <= 5; i++) {
        if (i <= numRating) {
            starsHTML += '★'; // Filled star
        } else if (i - 0.5 <= numRating) {
            starsHTML += '⯨'; // Half star
        } else {
            starsHTML += '☆'; // Empty star
        }
    }
    
    document.getElementById('star-display').innerHTML = starsHTML;
}

// Enhanced sentiment analysis with more detailed logic
function analyzeSentiment(comments) {
    const sentimentElement = document.getElementById('sentiment');
    const sentimentContainer = document.getElementById('sentiment-container');
    
    if (!comments) {
        sentimentElement.innerText = 'Neutral';
        sentimentElement.className = 'sentiment neutral';
        return;
    }
    
    // Convert to lowercase for case-insensitive matching
    const text = comments.toLowerCase();
    
    // Positive keywords (expanded)
    const positiveWords = [
        'great', 'excellent', 'good', 'helpful', 'amazing', 'fantastic', 
        'love', 'enjoy', 'clear', 'best', 'informative', 'thorough',
        'engaging', 'awesome', 'wonderful', 'perfect', 'outstanding',
        'insightful', 'interesting', 'valuable', 'useful', 'beneficial'
    ];
                          
    // Negative keywords (expanded)
    const negativeWords = [
        'bad', 'poor', 'confusing', 'unclear', 'difficult', 'boring', 
        'needs improvement', 'waste', 'terrible', 'worst', 'hard to follow',
        'disappointing', 'frustrating', 'inadequate', 'insufficient',
        'unhelpful', 'useless', 'slow', 'complicated', 'tedious'
    ];
    
    // Count matches with weighted scoring
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
        if (text.includes(word)) {
            // Check if the word appears with emphasis
            if (text.includes(`very ${word}`) || text.includes(`really ${word}`)) {
                positiveScore += 2;
            } else {
                positiveScore += 1;
            }
        }
    });
    
    negativeWords.forEach(word => {
        if (text.includes(word)) {
            // Check if the word appears with emphasis
            if (text.includes(`very ${word}`) || text.includes(`really ${word}`)) {
                negativeScore += 2;
            } else {
                negativeScore += 1;
            }
        }
    });
    
    // Determine overall sentiment
    let sentiment = '';
    let sentimentClass = '';
    
    if (positiveScore > negativeScore) {
        sentiment = 'Positive';
        sentimentClass = 'positive';
    } else if (negativeScore > positiveScore) {
        sentiment = 'Negative';
        sentimentClass = 'negative';
    } else {
        sentiment = 'Neutral';
        sentimentClass = 'neutral';
    }
    
    // Update the sentiment display
    sentimentElement.innerText = sentiment;
    sentimentElement.className = `sentiment ${sentimentClass}`;
}

// Function to extract key points from the comments
function extractKeyPoints(comments) {
    if (!comments) {
        document.getElementById('positive-point-1').innerText = 'No specific points identified';
        document.getElementById('positive-point-2').innerText = 'No specific points identified';
        document.getElementById('negative-point-1').innerText = 'No specific points identified';
        return;
    }
    
    const text = comments.toLowerCase();
    
    // Predefined categories for key points
    const positiveCategories = {
        'clarity': ['clear', 'easy to understand', 'well explained', 'straightforward'],
        'engagement': ['engaging', 'interesting', 'interactive', 'fun', 'enjoyed'],
        'content': ['informative', 'thorough', 'comprehensive', 'detailed', 'useful content'],
        'instructor': ['helpful instructor', 'knowledgeable', 'responsive', 'supportive'],
        'resources': ['good resources', 'useful materials', 'helpful examples', 'practical exercises']
    };
    
    const negativeCategories = {
        'pace': ['too fast', 'rushed', 'too slow', 'dragging'],
        'clarity': ['confusing', 'unclear', 'hard to follow', 'complex'],
        'content': ['insufficient', 'too basic', 'outdated', 'irrelevant'],
        'resources': ['lacking resources', 'need more examples', 'poor materials'],
        'workload': ['too much work', 'heavy workload', 'overwhelming', 'time-consuming']
    };
    
    // Find matches
    const positivePoints = [];
    const negativePoints = [];
    
    // Check for positive points
    for (const category in positiveCategories) {
        for (const keyword of positiveCategories[category]) {
            if (text.includes(keyword)) {
                positivePoints.push(`${capitalizeFirstLetter(category)}: ${keyword}`);
                break; // Only add one point per category
            }
        }
    }
    
    // Check for negative points
    for (const category in negativeCategories) {
        for (const keyword of negativeCategories[category]) {
            if (text.includes(keyword)) {
                negativePoints.push(`${capitalizeFirstLetter(category)}: ${keyword}`);
                break; // Only add one point per category
            }
        }
    }
    
    // Fallback points if none are found
    if (positivePoints.length === 0) {
        const positiveFallbacks = ['Good overall experience', 'Satisfactory content'];
        positivePoints.push(positiveFallbacks[Math.floor(Math.random() * positiveFallbacks.length)]);
    }
    
    const rating = parseFloat(document.getElementById('rating').innerText);
    if (negativePoints.length === 0 && rating < 4) {
        const negativeFallbacks = ['Could use improvement', 'Some aspects need attention'];
        negativePoints.push(negativeFallbacks[Math.floor(Math.random() * negativeFallbacks.length)]);
    }
    
    // Display key points
    document.getElementById('positive-point-1').innerText = positivePoints[0] || 'No specific positive points identified';
    document.getElementById('positive-point-2').innerText = positivePoints[1] || 'Good overall experience';
    document.getElementById('negative-point-1').innerText = negativePoints[0] || 'No specific negative points identified';
}

// Function to suggest action items based on feedback
function suggestActionItems(comments, rating) {
    if (!comments) {
        document.getElementById('action-item-1').innerText = 'Review course structure';
        document.getElementById('action-item-2').innerText = 'Maintain current quality standards';
        return;
    }
    
    const text = comments.toLowerCase();
    const ratingValue = parseFloat(rating);
    
    // Potential action categories
    const actionCategories = {
        'pace': ['adjust pace', 'review pace of material delivery', 'consider adjusting lesson timing'],
        'clarity': ['improve explanations', 'provide clearer instructions', 'simplify complex concepts'],
        'content': ['update course content', 'add more advanced topics', 'include more basic examples'],
        'resources': ['provide additional resources', 'create supplementary materials', 'develop practice exercises'],
        'engagement': ['increase interactivity', 'add more engaging activities', 'incorporate discussions']
    };
    
    // Keywords indicating areas for improvement
    const improvementKeywords = {
        'pace': ['too fast', 'too slow', 'rushed', 'dragging'],
        'clarity': ['confusing', 'unclear', 'hard to follow', 'complex'],
        'content': ['more content', 'too basic', 'too advanced', 'outdated'],
        'resources': ['more examples', 'more exercises', 'better materials'],
        'engagement': ['boring', 'not engaging', 'monotonous', 'passive']
    };
    
    // Keywords indicating strengths to emphasize
    const strengthKeywords = {
        'clarity': ['clear', 'well explained', 'understandable'],
        'engagement': ['engaging', 'interesting', 'interactive'],
        'content': ['informative', 'thorough', 'comprehensive'],
        'resources': ['helpful resources', 'good examples', 'useful materials']
    };
    
    // Find areas for improvement
    const improvementActions = [];
    for (const category in improvementKeywords) {
        for (const keyword of improvementKeywords[category]) {
            if (text.includes(keyword)) {
                // Get a random action from the category
                const actions = actionCategories[category];
                improvementActions.push(capitalizeFirstLetter(actions[Math.floor(Math.random() * actions.length)]));
                break;
            }
        }
    }
    
    // Find strengths to emphasize
    const strengthActions = [];
    for (const category in strengthKeywords) {
        for (const keyword of strengthKeywords[category]) {
            if (text.includes(keyword)) {
                strengthActions.push(`Continue emphasizing ${keyword} aspects`);
                break;
            }
        }
    }
    
    // If rating is low, prioritize improvements
    if (ratingValue <= 3) {
        if (improvementActions.length === 0) {
            improvementActions.push('Review course structure and delivery methods');
        }
    } else {
        // If rating is high but no strengths identified
        if (strengthActions.length === 0) {
            strengthActions.push('Maintain current quality standards');
        }
    }
    
    // Display action items
    document.getElementById('action-item-1').innerText = improvementActions[0] || 'Review course structure';
    document.getElementById('action-item-2').innerText = strengthActions[0] || improvementActions[1] || 'Maintain current quality standards';
}

// Function to initialize course search and filter
function initializeCourseSearch() {
    const searchInput = document.getElementById('course-search');
    const filterSelect = document.getElementById('course-filter');
    const searchButton = document.getElementById('search-btn');
    
    // Search functionality
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            // In a real application, this would search the database or API
            alert(`Searching for: ${searchTerm}`);
            // You could implement a dynamic search by calling an API endpoint here
        }
    });
    
    // Enter key for search
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // Course filter functionality
    filterSelect.addEventListener('change', () => {
        const selectedCourseId = filterSelect.value;
        if (selectedCourseId) {
            // Update the metrics for the selected course
            fetchCourseStats(selectedCourseId);
        }
    });
    
    // Get faculty ID from URL or another source
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackId = urlParams.get('id');
    
    // Fetch feedback to get faculty ID, then fetch courses
    if (feedbackId) {
        fetch(`/feedback/api/individual/${feedbackId}`)
            .then(response => response.json())
            .then(data => {
                const facultyId = data.feedback.facultyId;
                if (facultyId) {
                    fetchFacultyCourses(facultyId);
                }
            })
            .catch(error => console.error('Error fetching faculty ID:', error));
    }
}

// Function to initialize theme toggle
function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
}

// Function to initialize action buttons
function initializeActionButtons() {
    const printBtn = document.getElementById('print-feedback');
    const downloadBtn = document.getElementById('download-report');
    
    // Print functionality
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    // Download report functionality
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Get current feedback data
            const course = document.getElementById('course-name').innerText;
            const studentId = document.getElementById('student-id').innerText;
            const rating = document.getElementById('rating').innerText;
            const comments = document.getElementById('comments').innerText;
            const date = document.getElementById('feedback-date').innerText;
            const sentiment = document.getElementById('sentiment').innerText;
            
            // Create a text version of the report
            const reportContent = `
Course Feedback Report
=====================
Course: ${course}
Student ID: ${studentId}
Rating: ${rating}
Date: ${date}
Sentiment: ${sentiment}

Comments:
${comments}

Key Points:
- ${document.getElementById('positive-point-1').innerText}
- ${document.getElementById('positive-point-2').innerText}
- ${document.getElementById('negative-point-1').innerText}

Action Items:
- ${document.getElementById('action-item-1').innerText}
- ${document.getElementById('action-item-2').innerText}

Generated on: ${new Date().toLocaleString()}
            `;
            
            // Create a download link
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `feedback-report-${studentId}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}

// Function to go back to dashboard
function goBack() {
    window.location.href = 'index.html';
}

// Helper function to format date
function formatDate(dateString) {
    // Check if we have a valid date string
    if (!dateString || dateString === 'Not Available') {
        return 'Not Available';
    }
    
    try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateString; // Return original if invalid
        }
        
        // Format as Month Day, Year
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        return dateString; // Return original on error
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadFeedbackDetails();
});