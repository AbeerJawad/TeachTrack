document.addEventListener("DOMContentLoaded", function () {
    loadFeedbackData();
    addAnimations();
});

// Function to fetch and display analytics
function loadFeedbackData() {
    // Placeholder values (replace with database connection later)
    const totalFeedback = 124;
    const positiveFeedback = 85;  // Percentage
    const negativeFeedback = 15;  // Percentage
    const ratingDistribution = [20, 30, 25, 30, 19];  // Example rating breakdown

    // Update HTML elements with animation
    animateCounter('averageRating', 0, 4.2, 1, '⭐');
    animateCounter('positiveFeedback', 0, positiveFeedback, 0, '%');
    animateCounter('negativeFeedback', 0, negativeFeedback, 0, '%');

    // Generate Charts with animation
    setTimeout(() => {
        generateRatingChart(ratingDistribution);
        generateSentimentChart(positiveFeedback, negativeFeedback);
    }, 300);
}

// Animated counter function
function animateCounter(elementId, start, end, decimals, suffix) {
    const element = document.getElementById(elementId);
    const duration = 1500;
    const startTime = Date.now();
    
    const updateCounter = () => {
        const currentTime = Date.now();
        const progress = Math.min(1, (currentTime - startTime) / duration);
        
        // Easing function for smoother animation
        const easeOutQuad = t => t * (2 - t);
        const easedProgress = easeOutQuad(progress);
        
        const currentValue = start + (end - start) * easedProgress;
        element.textContent = currentValue.toFixed(decimals) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    };
    
    updateCounter();
}

// Function to generate Rating Distribution Chart
function generateRatingChart(data) {
    const ctx = document.getElementById('ratingChart').getContext('2d');
    
    // Define gradient for bars
    const gradients = data.map((_, i) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        
        // Different gradient for each rating
        switch(i) {
            case 0: // 1 star
                gradient.addColorStop(0, '#FF6B6B');
                gradient.addColorStop(1, '#D32F2F');
                break;
            case 1: // 2 star
                gradient.addColorStop(0, '#FFCA80');
                gradient.addColorStop(1, '#FFA000');
                break;
            case 2: // 3 star
                gradient.addColorStop(0, '#FFEB3B');
                gradient.addColorStop(1, '#FBC02D');
                break;
            case 3: // 4 star
                gradient.addColorStop(0, '#66BB6A');
                gradient.addColorStop(1, '#388E3C');
                break;
            case 4: // 5 star
                gradient.addColorStop(0, '#673AB7');
                gradient.addColorStop(1, '#4A256A');
                break;
        }
        
        return gradient;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1⭐', '2⭐', '3⭐', '4⭐', '5⭐'],
            datasets: [{
                label: 'Rating Distribution',
                data: data,
                backgroundColor: gradients,
                borderWidth: 0,
                borderRadius: 6,
                maxBarThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: 10,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 14
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.raw} ratings`;
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Function to generate Sentiment Analysis Chart
function generateSentimentChart(positive, negative) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Negative'],
            datasets: [{
                data: [positive, negative],
                backgroundColor: [
                    '#4CAF50',
                    '#D32F2F'
                ],
                borderColor: [
                    '#388E3C',
                    '#B71C1C'
                ],
                borderWidth: 1,
                hoverOffset: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 15,
                        padding: 15,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 14
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeOutCirc'
            }
        }
    });
}

// Add scroll animations and interactive effects
function addAnimations() {
    // Add hover effect to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
    });

    // Add scroll reveal animation for chart cards
    const chartCards = document.querySelectorAll('.chart-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    chartCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}