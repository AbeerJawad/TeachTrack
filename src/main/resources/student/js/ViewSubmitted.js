document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainSection = document.querySelector('.main-section');
    const courseTitle = document.getElementById('course-title');
    const instructorName = document.getElementById('instructor-name');
    const submissionDate = document.getElementById('submission-date');
    const questionsContainer = document.getElementById('questions-container');
    const backBtn = document.getElementById('back-btn');
    
    // Remove loading overlay completely if it exists
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }

    // Sidebar toggle
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainSection.classList.toggle('shifted');
    });

    // Back button
    backBtn.addEventListener('click', function() {
        window.location.href = 'StuDashboard.html';
    });

    // Get feedback ID or course ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackId = urlParams.get('id');
    const courseId = urlParams.get('courseId');

    // Get userId from localStorage or sessionStorage
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    if (!userId) {
        showError("You need to be logged in to view feedback");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        return;
    }

    if (feedbackId || courseId) {
        loadSubmittedFeedback(feedbackId, courseId);
    } else {
        showError("No feedback specified to view");
        setTimeout(() => {
            window.location.href = 'StuDashboard.html';
        }, 3000);
    }

    function loadSubmittedFeedback(feedbackId, courseId) {
        let apiUrl = '';
        
        if (feedbackId) {
            apiUrl = `/api/students/${userId}/feedback-detail/${feedbackId}`;
        } else if (courseId) {
            apiUrl = `/api/students/${userId}/feedback-by-course?courseId=${courseId}`;
        }

        console.log(`Fetching feedback data from: ${apiUrl}`);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Feedback data received:", data);
                
                if (!data.success && data.error) {
                    throw new Error(data.error);
                }
                
                try {
                    displayFeedback(data);
                } catch (displayError) {
                    console.error("Error displaying feedback:", displayError);
                    showError("Error displaying feedback content");
                }
            })
            .catch(error => {
                console.error('Error loading feedback:', error);
                showError(`Failed to load feedback: ${error.message}`);
                
                // Set timeout to return to dashboard after error
                setTimeout(() => {
                    window.location.href = 'StuDashboard.html';
                }, 5000);
            });
    }

    function displayFeedback(feedbackData) {
        try {
            // Display header info
            courseTitle.textContent = `${feedbackData.course_code || ''} - ${feedbackData.course_name || 'Course Name'}`;
            instructorName.textContent = `Instructor: ${feedbackData.instructor_name || 'Instructor Name'}`;
            
            // Handle date display
            let dateDisplay = "Submitted on: Date not available";
            try {
                if (feedbackData.submitted_at) {
                    const submittedDate = new Date(feedbackData.submitted_at);
                    if (!isNaN(submittedDate.getTime())) {
                        dateDisplay = `Submitted on: ${submittedDate.toLocaleDateString()} at ${submittedDate.toLocaleTimeString()}`;
                    }
                }
            } catch (dateError) {
                console.warn("Error parsing date:", dateError);
            }
            submissionDate.textContent = dateDisplay;

            // Clear previous content
            questionsContainer.innerHTML = '';
            
            // Questions section
            const questionsSection = document.createElement('div');
            questionsSection.className = 'feedback-section questions-section';
            
            const questionTitle = document.createElement('h3');
            questionTitle.className = 'section-title';
            questionTitle.innerHTML = '<i class="fas fa-question-circle"></i> Your Responses';
            questionsSection.appendChild(questionTitle);
            
            // Check if questions array exists
            if (feedbackData.questions && feedbackData.questions.length > 0) {
                feedbackData.questions.forEach((question, index) => {
                    const questionElement = createQuestionElement(question, index + 1);
                    questionsSection.appendChild(questionElement);
                });
            } else {
                const noQuestionsElement = document.createElement('p');
                noQuestionsElement.className = 'no-data-message';
                noQuestionsElement.textContent = 'No question responses found.';
                questionsSection.appendChild(noQuestionsElement);
            }
            
            questionsContainer.appendChild(questionsSection);
            
            // Faculty replies section
            if (feedbackData.facultyReplies && feedbackData.facultyReplies.length > 0) {
                const repliesSection = document.createElement('div');
                repliesSection.className = 'feedback-section replies-section';
                
                const repliesTitle = document.createElement('h3');
                repliesTitle.className = 'section-title';
                repliesTitle.innerHTML = '<i class="fas fa-comment-dots"></i> Instructor Replies';
                repliesSection.appendChild(repliesTitle);
                
                feedbackData.facultyReplies.forEach(reply => {
                    const replyElement = createReplyElement(reply);
                    repliesSection.appendChild(replyElement);
                });
                
                questionsContainer.appendChild(repliesSection);
            } else {
                // Show no replies message
                const noRepliesDiv = document.createElement('div');
                noRepliesDiv.className = 'feedback-section no-replies';
                noRepliesDiv.innerHTML = `
                    <h3 class="section-title"><i class="fas fa-comment-slash"></i> No Instructor Replies</h3>
                    <p class="no-replies-message">The instructor hasn't replied to this feedback yet.</p>
                `;
                questionsContainer.appendChild(noRepliesDiv);
            }
        } catch (error) {
            console.error("Error in displayFeedback:", error);
            showError("Error displaying feedback content");
        }
    }

    function createQuestionElement(question, questionNumber) {
        try {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';

            const questionText = document.createElement('div');
            questionText.className = 'question-text';
            questionText.textContent = `${questionNumber}. ${question.question_text || question.text || 'Question'}`;
            questionDiv.appendChild(questionText);

            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-display';

            // Determine the question type and format appropriately
            const questionType = question.question_type || question.type || 'text';
            const answerText = question.answer_text || question.answer || '';
            const ratingValue = question.rating_value || question.rating || 0;

            if (questionType === 'text') {
                answerDiv.innerHTML = `
                    <p><strong>Your response:</strong></p>
                    <div class="text-response">${answerText || 'No response provided'}</div>
                `;
            } else if (questionType === 'rating' || questionType === 'scale_1_5') {
                answerDiv.innerHTML = `
                    <div class="rating-display">
                        <p><strong>Your rating:</strong> ${ratingValue}/5</p>
                        <div class="rating-stars">
                            ${'★'.repeat(ratingValue)}${'☆'.repeat(5 - ratingValue)}
                        </div>
                    </div>
                `;
            } else if (questionType === 'yes_no') {
                answerDiv.innerHTML = `<p><strong>Your answer:</strong> ${answerText || 'Not answered'}</p>`;
            } else if (questionType === 'scale_1_10') {
                answerDiv.innerHTML = `
                    <div class="rating-display">
                        <p><strong>Your rating:</strong> ${ratingValue}/10</p>
                        <div class="rating-bar">
                            <div class="rating-fill" style="width: ${ratingValue * 10}%"></div>
                        </div>
                    </div>
                `;
            }

            questionDiv.appendChild(answerDiv);
            return questionDiv;
        } catch (error) {
            console.error("Error creating question element:", error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'question-item error';
            errorDiv.textContent = `Question ${questionNumber}: Error displaying content`;
            return errorDiv;
        }
    }
    
    function createReplyElement(reply) {
        try {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'faculty-reply';
            
            // Format date if available, otherwise use placeholder
            let formattedDate = 'N/A';
            if (reply.replied_at) {
                try {
                    const replyDate = new Date(reply.replied_at);
                    if (!isNaN(replyDate.getTime())) {
                        formattedDate = `${replyDate.toLocaleDateString()} at ${replyDate.toLocaleTimeString()}`;
                    }
                } catch (dateError) {
                    console.warn("Error parsing reply date:", dateError);
                }
            }
            
            replyDiv.innerHTML = `
                <div class="reply-header">
                    <div class="reply-author">
                        <i class="fas fa-user-tie"></i> ${reply.faculty_name || 'Instructor'}
                    </div>
                    <div class="reply-date">
                        <i class="fas fa-clock"></i> ${formattedDate}
                    </div>
                </div>
                <div class="reply-content">
                    ${reply.reply_text || ''}
                </div>
            `;
            
            return replyDiv;
        } catch (error) {
            console.error("Error creating reply element:", error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'faculty-reply error';
            errorDiv.textContent = "Error displaying instructor reply";
            return errorDiv;
        }
    }

    function showError(message) {
        questionsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
                <p class="error-redirect">You'll be redirected to the dashboard in a few seconds...</p>
            </div>
        `;
    }
});