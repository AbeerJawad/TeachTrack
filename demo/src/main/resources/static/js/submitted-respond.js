// Function to load submitted responses (Placeholder for DB)
async function loadSubmittedResponses() {
    try {
        let responses = [
            {
                course: "CS101",
               
                response: "Thank you for your feedback! I will incorporate more examples.",
                date: "2024-03-20"
            },
            {
                course: "MATH202",
               
                response: "I appreciate your comments on my calculus assignment.",
                date: "2024-03-19"
            },
            {
                course: "ENG105",
               
                response: "Will address the structural issues in my next essay.",
                date: "2024-03-18"
            }
        ];
        
        let tableBody = document.getElementById("submittedResponses");
        tableBody.innerHTML = ""; // Clear existing data
        
        responses.forEach(response => {
            let row = `<tr>
                <td>${response.course}</td>
               
                <td>${response.response}</td>
                <td>${response.date}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
        
    } catch (error) {
        console.error("Error loading submitted responses:", error);
    }
}

// Load data when page loads
window.onload = loadSubmittedResponses;