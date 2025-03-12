// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Get references to the login form and error message element
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");

    // API endpoint for authentication
    const API_URL = "https://learn.reboot01.com/api/auth/signin";

    // Listen for the form submission event
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Get the values entered in the login form
        const identifier = document.getElementById("identifier").value;
        const password = document.getElementById("password").value;

        // If either field is empty, show an error and return
        if (!identifier || !password) {
            errorMessage.textContent = "Please fill in both fields.";
            errorMessage.classList.add("active");
            return;
        }

        try {
            // Send a POST request to the authentication API
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    // Encode credentials using Base64 for Basic Authentication
                    "Authorization": `Basic ${btoa(`${identifier}:${password}`)}`,
                    "Content-Type": "application/json",
                },
            });

            // If the response status is not OK (e.g., 401 Unauthorized), throw an error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Authentication failed");
            }

            // Parse the response and store the JWT token
            const data = await response.json();
            localStorage.setItem("jwt-token", data); // Assuming the token is the direct response

            // Redirect to the profile page after successful login
            window.location.href = "Profile.html";
        } catch (error) {
            // Display an error message if authentication fails
            errorMessage.textContent = error.message || "Invalid username or password.";
            errorMessage.classList.add("active");

            // Optionally hide the error after a few seconds
            setTimeout(() => {
                errorMessage.classList.remove("active");
            }, 5000); // Hides after 5 seconds
        }
    });
});