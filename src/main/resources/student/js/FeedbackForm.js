document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const feedbackForm = document.getElementById('feedback-form');
    const questionsContainer = document.getElementById('questions-container');
    const courseTitle = document.getElementById('course-title');
    const instructorName = document.getElementById('instructor-name');
    const formIdField = document.getElementById('form-id');
    const courseIdField = document.getElementById('course-id');
    const facultyIdField = document.getElementById('faculty-id');
    const offeringIdField = document.getElementById('offering-id');
    const userIdField = document.getElementById('user-id');
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Extract user ID and form ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get('userId');
    let formId = urlParams.get('formId');
    
    // If not in URL, try to get from path (legacy support)
    if (!userId || !formId) {
        const pathParts = window.location.pathname.split('/');
        const studentsIndex = pathParts.indexOf('students');
        const feedbackIndex = pathParts.indexOf('fill-feedback');
        
        if (studentsIndex !== -1 && studentsIndex + 1 < pathParts.length) {
            userId = pathParts[studentsIndex + 1];
        }
        
        if (feedbackIndex !== -1 && feedbackIndex + 1 < pathParts.length) {
            formId = pathParts[feedbackIndex + 1];
        }
    }
    
    console.log("Initializing feedback form with userId:", userId, "and formId:", formId);
    
    // If we have both IDs, fetch the form data
    if (userId && formId) {
        fetchFormData(userId, formId);
    } else {
        // Try to get form ID from session storage as fallback
        const storedFormId = sessionStorage.getItem('currentFormId');
        const storedUserId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        
        if (storedFormId && storedUserId) {
            fetchFormData(storedUserId, storedFormId);
        } else {
            // No data and no way to fetch it
            showErrorMessage('Unable to load feedback form. Missing form ID or user authentication.');
            setTimeout(() => {
                window.location.href = '/student/StuDashboard.html';
            }, 3000);
        }
    }
    
    // Add event listener for form submission
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitFeedback();
    });
    
    // Add event listener for cancel button
    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? Your feedback will not be saved.')) {
            window.location.href = '/student/StuDashboard.html';
        }
    });
    
    function fetchFormData(userId, formId) {
        showLoadingOverlay();
        
        // Use the correct API endpoint to fetch the form data
        fetch(`/api/students/${userId}/feedback-form/${formId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load feedback form');
                }
                return response.json();
            })
            .then(formData => {
                if (formData.error) {
                    showErrorMessage(formData.message);
                    return;
                }
                
                // Store form data and display it
                sessionStorage.setItem('currentFeedbackForm', JSON.stringify(formData));
                displayFormData(formData, userId);
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorMessage('Failed to load the feedback form. Please try again later.');
            })
            .finally(() => {
                hideLoadingOverlay();
            });
    }
    
    function displayFormData(formData, userId) {
        // Set course and instructor information
        courseTitle.textContent = `${formData.course_code} - ${formData.course_title}`;
        instructorName.textContent = `Instructor: ${formData.faculty_name}`;
        
        // Set hidden field values
        formIdField.value = formData.form_id;
        courseIdField.value = formData.course_id;
        facultyIdField.value = formData.faculty_id;
        offeringIdField.value = formData.offering_id;
        userIdField.value = userId;
        
        // Clear existing questions
        questionsContainer.innerHTML = '';
        
        // Add each question to the form
        formData.questions.forEach((question, index) => {
            const questionElement = createQuestionElement(question, index + 1);
            questionsContainer.appendChild(questionElement);
        });
    }
    
    function createQuestionElement(question, questionNumber) {
        // This function remains unchanged
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.dataset.questionId = question.question_id;
        questionDiv.dataset.questionType = question.question_type;
        
        // Create question header
        const questionHeader = document.createElement('h3');
        questionHeader.className = 'question-header';
        questionHeader.textContent = `Question ${questionNumber}: ${question.question_text}`;
        if (question.is_required) {
            const requiredSpan = document.createElement('span');
            requiredSpan.className = 'required-marker';
            requiredSpan.textContent = ' *';
            questionHeader.appendChild(requiredSpan);
        }
        
        questionDiv.appendChild(questionHeader);
        
        // Create appropriate input based on question type
        const inputContainer = document.createElement('div');
        inputContainer.className = 'question-input';
        
        switch (question.question_type) {
            case 'rating':
                inputContainer.appendChild(createRatingInput(question));
                break;
            case 'scale_1_5':
                inputContainer.appendChild(createScaleInput(question, 5));
                break;
            case 'scale_1_10':
                inputContainer.appendChild(createScaleInput(question, 10));
                break;
            case 'yes_no':
                inputContainer.appendChild(createYesNoInput(question));
                break;
            case 'text':
                inputContainer.appendChild(createTextInput(question));
                break;
            default:
                inputContainer.appendChild(createTextInput(question));
        }
        
        questionDiv.appendChild(inputContainer);
        return questionDiv;
    }
    
    function createRatingInput(question) {
        // This function remains unchanged
        const container = document.createElement('div');
        container.className = 'rating-container';
        
        for (let i = 5; i >= 1; i--) {
            const label = document.createElement('label');
            label.className = 'rating-label';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${question.question_id}`;
            input.value = i;
            input.required = question.is_required;
            
            const star = document.createElement('span');
            star.className = 'rating-star';
            star.innerHTML = '★';
            
            label.appendChild(input);
            label.appendChild(star);
            container.appendChild(label);
        }
        
        return container;
    }
    
    function createScaleInput(question, maxScale) {
        // This function remains unchanged
        const container = document.createElement('div');
        container.className = 'scale-container';
        
        // Labels for scale ends
        const scaleLabels = document.createElement('div');
        scaleLabels.className = 'scale-labels';
        
        const lowLabel = document.createElement('span');
        lowLabel.textContent = '1 (Poor)';
        
        const highLabel = document.createElement('span');
        highLabel.textContent = `${maxScale} (Excellent)`;
        
        scaleLabels.appendChild(lowLabel);
        scaleLabels.appendChild(highLabel);
        container.appendChild(scaleLabels);
        
        // Scale inputs
        const scaleInputs = document.createElement('div');
        scaleInputs.className = 'scale-inputs';
        
        for (let i = 1; i <= maxScale; i++) {
            const label = document.createElement('label');
            label.className = 'scale-option';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${question.question_id}`;
            input.value = i;
            input.required = question.is_required;
            
            const value = document.createElement('span');
            value.className = 'scale-value';
            value.textContent = i;
            
            label.appendChild(input);
            label.appendChild(value);
            scaleInputs.appendChild(label);
        }
        
        container.appendChild(scaleInputs);
        return container;
    }
    
    function createYesNoInput(question) {
        // This function remains unchanged
        const container = document.createElement('div');
        container.className = 'yes-no-container';
        
        const yesLabel = document.createElement('label');
        yesLabel.className = 'yes-no-option';
        
        const yesInput = document.createElement('input');
        yesInput.type = 'radio';
        yesInput.name = `question_${question.question_id}`;
        yesInput.value = 'yes';
        yesInput.required = question.is_required;
        
        yesLabel.appendChild(yesInput);
        yesLabel.appendChild(document.createTextNode('Yes'));
        
        const noLabel = document.createElement('label');
        noLabel.className = 'yes-no-option';
        
        const noInput = document.createElement('input');
        noInput.type = 'radio';
        noInput.name = `question_${question.question_id}`;
        noInput.value = 'no';
        noInput.required = question.is_required;
        
        noLabel.appendChild(noInput);
        noLabel.appendChild(document.createTextNode('No'));
        
        container.appendChild(yesLabel);
        container.appendChild(noLabel);
        
        return container;
    }
    
    function createTextInput(question) {
        // This function remains unchanged
        const container = document.createElement('div');
        container.className = 'text-input-container';
        
        const textarea = document.createElement('textarea');
        textarea.name = `question_${question.question_id}`;
        textarea.rows = 4;
        textarea.placeholder = 'Enter your response here...';
        textarea.required = question.is_required;
        
        container.appendChild(textarea);
        return container;
    }
    
    function submitFeedback() {
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        showLoadingOverlay();
        
        // Gather form data
        const formData = {
            form_id: formIdField.value,
            faculty_id: facultyIdField.value,
            offering_id: offeringIdField.value,
            is_anonymous: document.getElementById('is-anonymous').checked,
            answers: []
        };
        
        // Get all question inputs
        const questionItems = document.querySelectorAll('.question-item');
        questionItems.forEach(item => {
            const questionId = item.dataset.questionId;
            const questionType = item.dataset.questionType;
            let answer = null;
            
            // Get answer based on question type
            if (questionType === 'text') {
                const textarea = item.querySelector('textarea');
                answer = {
                    question_id: questionId,
                    answer_text: textarea.value,
                    rating_value: null
                };
            } else {
                // For radio inputs (rating, scale, yes/no)
                const selectedInput = item.querySelector(`input[name="question_${questionId}"]:checked`);
                if (selectedInput) {
                    answer = {
                        question_id: questionId,
                        answer_text: questionType === 'yes_no' ? selectedInput.value : null,
                        rating_value: ['rating', 'scale_1_5', 'scale_1_10'].includes(questionType) ? 
                            parseInt(selectedInput.value) : null
                    };
                }
            }
            
            if (answer) {
                formData.answers.push(answer);
            }
        });
        
        // Submit feedback to API
        const currentUserId = userIdField.value || userId;
        
        fetch(`/api/students/${currentUserId}/submit-feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }
            return response.json();
        })
        .then(data => {
            // Clear stored form data
            sessionStorage.removeItem('currentFeedbackForm');
            sessionStorage.removeItem('currentFormId');
            
            // Show success message
            alert('Your feedback has been submitted successfully!');
            
            // Redirect to dashboard
            window.location.href = '/student/StuDashboard.html';
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('Failed to submit feedback. Please try again later.');
        })
        .finally(() => {
            hideLoadingOverlay();
        });
    }
    
    function validateForm() {
        let isValid = true;
        
        // Check all required questions
        const questionItems = document.querySelectorAll('.question-item');
        questionItems.forEach(item => {
            const questionId = item.dataset.questionId;
            const questionType = item.dataset.questionType;
            
            if (item.querySelector('.required-marker')) {
                // This is a required question
                if (questionType === 'text') {
                    const textarea = item.querySelector('textarea');
                    if (!textarea.value.trim()) {
                        isValid = false;
                        highlightError(item);
                    }
                } else {
                    // For radio inputs (rating, scale, yes/no)
                    const selectedInput = item.querySelector(`input[name="question_${questionId}"]:checked`);
                    if (!selectedInput) {
                        isValid = false;
                        highlightError(item);
                    }
                }
            }
        });
        
        if (!isValid) {
            alert('Please answer all required questions.');
        }
        
        return isValid;
    }
    
    function highlightError(questionElement) {
        questionElement.classList.add('error');
        
        // Remove error class after animation
        setTimeout(() => {
            questionElement.classList.remove('error');
        }, 2000);
    }
    
    function showLoadingOverlay() {
        loadingOverlay.classList.remove('hidden');
    }
    
    function hideLoadingOverlay() {
        loadingOverlay.classList.add('hidden');
    }
    
    function showErrorMessage(message) {
        alert(message || 'An error occurred. Please try again.');
    }
});