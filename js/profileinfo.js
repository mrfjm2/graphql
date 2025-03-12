// Function to fetch user profile details using GraphQL
async function getUserProfile() {
    const query = `
        query User {
            user {
                attrs
            }
        }
    `;

    try {
        const response = await fetchGraphQL(query);
        console.log('Raw user profile data:', response);

        if (response?.data?.user && response.data.user.length > 0) {
            return response.data.user[0].attrs;
        } else {
            console.error('Invalid data structure:', response);
            throw new Error('Invalid user data received');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
    
}

// Function to load profile data (delegating the query to profileinfo.js)
async function loadProfileData() {
    try {
        // Ensure profileinfo.js is loaded first
        if (typeof getUserProfile !== "function") {
            throw new Error("profileinfo.js is not loaded or getUserProfile() is undefined.");
        }

        const userData = await getUserProfile();
        console.log('Processed user data:', userData);

        if (userData) {
            displayUserInfo(userData);
        } else {
            console.error('User data is empty or invalid.');
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}

// Function to display user information on the page
function displayUserInfo(user) {
    const userInfo = document.getElementById('user-info');
    userInfo.innerHTML = `
        <h2>Welcome, ${user.firstName} ${user.lastName}</h2>
        <p>CPR: ${user.CPRnumber}</p>
        <p>Gender: ${user.genders}</p>
        <p>Phone: ${user.Phone}</p>
        <p>Email: ${user.email}</p>
        <p>Qualification: ${user.qualification}</p>
        
    `;
}

// Initialize profile page
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
});