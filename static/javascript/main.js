document.addEventListener("DOMContentLoaded", () => {
    const loadMoreButton = document.getElementById("load-more");
    const projectsList = document.getElementById("projects-list");

    let offset = 0;
    const limit = 3;

    // Function to load more projects
    loadMoreButton.addEventListener("click", () => {
        fetch(`/api/projects?offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                // Loop through the projects data and append them to the list
                data.projects.forEach(project => {
                    const projectItem = document.createElement("div");
                    projectItem.classList.add("project-item");
                    projectItem.innerHTML = `<h3>${project.name}</h3><p>${project.description}</p>`;
                    projectsList.appendChild(projectItem);
                });
                offset += limit;  // Increase offset for next batch of projects
            })
            .catch(error => {
                console.error("Error loading projects:", error);
            });
    });

    // Handle contact form submission
    const contactForm = document.getElementById("contact-form");
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();  // Prevent default form submission

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
        };

        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);  // Display success message from the server
            contactForm.reset();  // Reset the form after submission
        })
        .catch(error => {
            console.error("Error submitting contact form:", error);
        });
    });
});