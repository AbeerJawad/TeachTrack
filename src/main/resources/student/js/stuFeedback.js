document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    // Check if sidebar preference is stored in localStorage
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    // Apply saved state
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    // Toggle sidebar
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Save preference to localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
    
    // Modal functionality
    const modal = document.getElementById('feedback-modal');
    const fillFeedbackBtns = document.querySelectorAll('.fill-feedback');
    const viewBtns = document.querySelectorAll('.view-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const feedbackForm = document.getElementById('feedback-form');
    
    // Open modal for new feedback
    fillFeedbackBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const course = row.cells[0].textContent;
            const instructor = row.cells[1].textContent;
            const semester = row.cells[2].textContent;
            
            document.getElementById('modal-title').textContent = 'Course Feedback';
            document.getElementById('form-course').textContent = course;
            document.getElementById('form-instructor').textContent = instructor;
            document.getElementById('form-semester').textContent = semester;
            
            // Enable form controls for input
            enableFormControls(true);
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Open modal for viewing submitted feedback
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const course = row.cells[0].textContent;
            const instructor = row.cells[1].textContent;
            const semester = row.cells[2].textContent;
            
            document.getElementById('modal-title').textContent = 'View Feedback';
            document.getElementById('form-course').textContent = course;
            document.getElementById('form-instructor').textContent = instructor;
            document.getElementById('form-semester').textContent = semester;
            
            // Disable form controls for view-only mode
            enableFormControls(false);
            
            // Load mock data (in real app would fetch from backend)
            loadMockFeedbackData(course);
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Form submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                alert('Please fill in all required fields.');
                return;
            }
            
            alert('Feedback submitted successfully!');
            closeModal();
        });
    }
    
    // Save draft button
    const saveDraftBtn = document.getElementById('save-draft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            const course = document.getElementById('form-course').textContent;
            saveDraftToStorage(course);
            alert('Draft saved successfully!');
        });
    }
    
    // Refresh buttons functionality
    const refreshBtns = document.querySelectorAll('.refresh-btn');
    refreshBtns.forEach(button => {
        button.addEventListener('click', function() {
            const originalHtml = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            this.disabled = true;
            
            // Simulate refresh delay (would connect to backend in real app)
            setTimeout(() => {
                this.innerHTML = originalHtml;
                this.disabled = false;
                alert('Data refreshed!');
            }, 1000);
        });
    });
    
    // Helper functions
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        feedbackForm.reset();
    }
    
    function enableFormControls(enable) {
        const formElements = feedbackForm.querySelectorAll('input, textarea');
        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        const draftBtn = document.getElementById('save-draft');
        
        formElements.forEach(el => {
            el.disabled = !enable;
        });
        
        if (enable) {
            submitBtn.style.display = 'block';
            draftBtn.style.display = 'block';
        } else {
            submitBtn.style.display = 'none';
            draftBtn.style.display = 'none';
        }
    }
    
    function validateForm() {
        const required = feedbackForm.querySelectorAll('input[required]:checked');
        return required.length === 4; // 4 required rating questions
    }
    
    function saveDraftToStorage(courseId) {
        const formData = new FormData(feedbackForm);
        const draftData = {
            course: document.getElementById('form-course').textContent,
            instructor: document.getElementById('form-instructor').textContent,
            semester: document.getElementById('form-semester').textContent,
            ratings: {},
            comments: {
                strengths: document.getElementById('strengths').value,
                improvements: document.getElementById('improvements').value
            }
        };
        
        // Get rating values
        for (const [name, value] of formData.entries()) {
            if (name.includes('organization') || name.includes('relevance') || 
                name.includes('knowledge') || name.includes('responsiveness')) {
                draftData.ratings[name] = value;
            }
        }
        
        // Store in localStorage
        localStorage.setItem(`feedback-draft-${courseId}`, JSON.stringify(draftData));
    }
    
    function loadDraftFromStorage(courseId) {
        const draftData = localStorage.getItem(`feedback-draft-${courseId}`);
        if (!draftData) return false;
        
        try {
            const draft = JSON.parse(draftData);
            
            // Load ratings
            for (const [name, value] of Object.entries(draft.ratings)) {
                const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
                if (input) input.checked = true;
            }
            
            // Load comments
            if (draft.comments.strengths) {
                document.getElementById('strengths').value = draft.comments.strengths;
            }
            
            if (draft.comments.improvements) {
                document.getElementById('improvements').value = draft.comments.improvements;
            }
            
            return true;
        } catch (e) {
            console.error('Error loading draft:', e);
            return false;
        }
    }
    
    function loadMockFeedbackData(courseId) {
        // Mock data for demo purposes (in real app would fetch from server)
        const mockFeedback = {
            'MATH101: Calculus I': {
                ratings: {
                    organization: '4',
                    relevance: '5',
                    knowledge: '5',
                    responsiveness: '4'
                },
                comments: {
                    strengths: 'The course provided a solid foundation in calculus concepts with clear explanations and ample examples.',
                    improvements: 'More practice problems and real-world applications would be helpful.'
                }
            },
            'ENG205: Technical Writing': {
                ratings: {
                    organization: '3',
                    relevance: '4',
                    knowledge: '4',
                    responsiveness: '3'
                },
                comments: {
                    strengths: 'The course taught practical writing skills that will be useful in professional settings.',
                    improvements: 'Could use more feedback on individual writing styles and more diverse examples.'
                }
            }
        };
        
        const feedback = mockFeedback[courseId];
        if (!feedback) return;
        
        // Set ratings
        for (const [name, value] of Object.entries(feedback.ratings)) {
            const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
            if (input) input.checked = true;
        }
        
        // Set comments
        document.getElementById('strengths').value = feedback.comments.strengths;
        document.getElementById('improvements').value = feedback.comments.improvements;
    }
});