const submitBtn = document.querySelector('.login-btn');
const btnText = submitBtn.querySelector('.btn-text');
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

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nextPage = urlParams.get('next')

    if(nextPage === 'complete-profile'){
        document.getElementById('login-title').textContent = "Welcome to TutorLinc!";
        document.getElementById('login-sub-title').textContent = "Please log in to continue.";
        document.getElementById('account-question-container').style.display = "none";
        document.getElementById('home-container').style.display = "none";
    }
    else{
        document.getElementById('login-title').textContent = "Login to Your Account";
        document.getElementById('login-sub-title').textContent = "";
        document.getElementById('account-question-container').style.display = "block";
        document.getElementById('home-container').style.display = "block";
    }

})

document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    userPassError.textContent = '';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    btnText.textContent = "Logging in...";

    login();
});

function login() {
    fetch('http://127.0.0.1:8000/auth/jwt/create', {
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
        
        if(data.access){

            localStorage.setItem('accessToken', data.access);

            const urlParams = new URLSearchParams(window.location.search);
            const nextPage = urlParams.get('next')
            
            if(nextPage === 'complete-profile'){
                window.location.href = "signup/teacher-create.html";
            }
            else{
                window.location.href = "overview.html";
            }

        }
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
        spinner.style.display = 'none';
        submitBtn.disabled = false;
        btnText.textContent = 'Log In'
    });
}
