// Check if the user is authenticated
const token = localStorage.getItem('jwt-token');  // Ensure this matches the key in auth.js
console.log('Initial token check:', token);

if (!token) {
    console.log('No token found, redirecting to login');
    window.location.href = './index.html';  // Ensure this is correct path to the login page
}

// Function to fetch GraphQL data
async function fetchGraphQL(query) {
    const token = localStorage.getItem('jwt-token');

    const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status}`);
    }

    return response.json();
}
// Function to handle the logout
function logout() {
    // Remove the JWT token from localStorage
    localStorage.removeItem('jwt-token');
    console.log('User logged out, redirecting to login page.');

    // Redirect to the login page (index.html)
    window.location.href = './index.html';  // Ensure this path is correct
}

// Add event listener to the logout button
document.addEventListener('DOMContentLoaded', () => {
    // Add the logout functionality to the button
    document.getElementById('logout-btn').addEventListener('click', logout);
});
