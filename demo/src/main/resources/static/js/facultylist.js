const numberOfTiles = 20;

const container = document.getElementById('tileContainer');

for (let i = 1; i <= numberOfTiles; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.setAttribute("data-name", `Instructor ${i}`);
    tile.setAttribute("data-department", i % 2 === 0 ? "ABC" : "XYZ"); // Alternating departments
    tile.onclick = () => {
        const name = `Instructor ${i}`;
        const department = i % 2 === 0 ? "ABC" : "XYZ";
        const email = `instructor${i}@university.edu`;

        // Redirect to details page with URL parameters
        window.location.href = `viewinstructor.html?name=${encodeURIComponent(name)}&department=${encodeURIComponent(department)}&email=${encodeURIComponent(email)}`;
    };

    const name = document.createElement('p');
    name.textContent = `Instructor ${i}`;

    const department = document.createElement('p');
    department.textContent = `Department: ${i % 2 === 0 ? "ABC" : "XYZ"}`;

    const otherInfo = document.createElement('p');
    otherInfo.textContent = `Some Other Info`;

    tile.appendChild(name);
    tile.appendChild(department);
    tile.appendChild(otherInfo);
    container.appendChild(tile);
}

function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}