const submitBtn = document.querySelector('.btn');
const email = document.getElementById('email');
const password = document.getElementById('password');

const spinner = document.querySelector('.spinner');
const userPassError = document.getElementById('user-pass-error');

email.addEventListener('input', () => {
    userPassError.textContent = '';
});
password.addEventListener('input', () => {
    userPassError.textContent = '';
});

document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    userPassError.textContent = ''; // Clear previous errors
    spinner.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '50%';

    login();
});

function login() {
    fetch('https://tutorlinc-ws.onrender.com/auth/jwt/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.detail || 'Invalid credentials');
            });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('accessToken', data.access);
        window.location.href = "overview.html";
    })
    .catch(error => {
        // Display a meaningful error message
        if (error.message === 'Failed to fetch') {
            userPassError.textContent = "Network error! Please check your internet connection.";
        } else {
            userPassError.textContent = error.message;
        }
    })
    .finally(() => {
        // Ensure UI resets regardless of success or failure
        spinner.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '100%';
    });
}
