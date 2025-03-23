// Get the canvas element for rendering the chart
const ctx = document.getElementById("courseEvaluationsChart").getContext("2d");

// Dummy data for evaluations
const courseData = {
    labels: ["Course A", "Course B", "Course C", "Course D", "Course E"],
    datasets: [{
        label: "Number of Evaluations",
        data: [80, 70, 65, 50, 40], // Example data
        backgroundColor: [
            "#256d46", // Green
            "#0057B8", // Blue
            "#D97706", // Amber
            "#D72638", // Red
            "#1D4ED8", // Indigo
        ],
        borderColor: [
            "#1B5134",
            "#004299",
            "#B56504",
            "#A01E29",
            "#153E75",
        ],
        borderWidth: 1
    }]
};

// Configure and render the chart
const courseChart = new Chart(ctx, {
    type: "bar", // Bar chart
    data: courseData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Most Evaluated Courses"
            }
        },
        scales: {
            y: {
                beginAtZero: true // Start y-axis at 0
            }
        }
    }
});
