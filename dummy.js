// Get the tokens from localStorage
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

// Fetch request to your API (e.g., getting some user data)
fetch('https://your-api-url.com/data/', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`,  // Sending the access token
        'Content-Type': 'application/json',
    }
})
.then(response => {
    if (!response.ok) {
        if (response.status === 401) {
            // Access token may have expired, attempt to refresh it using the refresh token
            return refreshAccessToken(refreshToken);
        }
        throw new Error('Request failed');
    }
    return response.json();
})
.then(data => {
    console.log('Data received:', data);
})
.catch(error => {
    console.error('Error:', error);
});

// Function to refresh the access token using the refresh token
function refreshAccessToken(refreshToken) {
    return fetch('https://your-api-url.com/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refresh: refreshToken  // Sending the refresh token to get a new access token
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            // Save the new access token
            const newAccessToken = data.access;
            console.log('New access token:', newAccessToken);
            // Retry the original request with the new access token
            return fetchOriginalRequest(newAccessToken);
        } else {
            throw new Error('Unable to refresh access token');
        }
    })
    .catch(error => {
        console.error('Error refreshing token:', error);
    });
}

// Retry the original request after getting the new access token
function fetchOriginalRequest(newAccessToken) {
    return fetch('https://your-api-url.com/data/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,  // Use the new access token
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data received after refreshing token:', data);
    })
    .catch(error => {
        console.error('Error after refreshing token:', error);
    });
}