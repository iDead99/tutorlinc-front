const verifyEmailForm = document.querySelector('.verify-email-form');
const verifyEmailMessage = document.getElementById('verify-email-message');
const verifyEmailLabel = document.getElementById('verify-email-label');
const verificationCodeInput = document.getElementById('verification-code-input');
const submitBtn = document.querySelector('.submit-btn');
const resendBtn = document.querySelector('.resend-btn');

const verifiedLoginContainer = document.getElementById("verified-login-container");
const verifiedLoginBtn = document.querySelector('.verified-login-btn');


const accessToken=localStorage.getItem('accessToken');

if(!accessToken){
    window.location.href="overview.html";
}

verifiedLoginBtn.addEventListener('click', function() {
    window.location.href = 'overview.html';
})

const userId = localStorage.getItem('userId') || '162'; // Fetch stored user ID dynamically
const apiBaseUrl = 'https://tutorlinc-ws.onrender.com/custom_user/users/';


document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    const storedCode = localStorage.getItem('verification_code');
    const storedExpiry = localStorage.getItem('verification_code_expiry');
    const now = new Date().getTime(); // Get current timestamp in milliseconds

    // If no stored code or expired, generate a new one
    if (!storedCode || !storedExpiry || now > parseInt(storedExpiry)) {
        resendBtn.disabled = true;
        resendBtn.style.opacity = '50%';
        resendBtn.textContent = 'Sending code...';
        generateVerificationCode('', userId);
    } else {
        verifyEmailMessage.textContent = 'You may check your email';
        document.querySelector('.verify-email-message-container').style.display = 'block';
    }
});



resendBtn.addEventListener('click', function () {
    if (resendBtn.disabled) return; // Prevent spam clicks

    resendBtn.disabled = true;
    resendBtn.style.opacity = '50%';
    resendBtn.textContent = 'Sending code...';

    generateVerificationCode('Resent! ');
});

function generateVerificationCode(attachMessage, user_id) {
    fetch(`https://tutorlinc-ws.onrender.com/custom_user/users/${user_id}/send_verification_code/`, {
        method: 'PATCH',
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status !== 200) {
            throw new Error(body.error || "Something went wrong. Please try again.");
        }

        verifyEmailLabel.textContent = 'Enter the 6-digit code sent to your email';
        verifyEmailMessage.textContent = `${attachMessage}${body.message}`;
        document.querySelector('.verify-email-message-container').style.display = 'block';

        // Store code and expiry in localStorage (expiry is set 5 mins ahead)
        localStorage.setItem('verification_code', body.message);
        localStorage.setItem('verification_code_expiry', (new Date().getTime() + 5 * 60 * 1000).toString());
    })
    .catch(error => {
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
    })
    .finally(() => {
        resendBtn.disabled = false;
        resendBtn.style.opacity = '100%';
        resendBtn.textContent = 'Resend Code';
    });
}

verifyEmailForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    submitBtn.disabled = true;
    submitBtn.style.opacity = '50%';
    submitBtn.textContent = 'Submitting...';

    getVerificationCode(userId);
});

function getVerificationCode(user_id) {
    fetch(`https://tutorlinc-ws.onrender.com/custom_user/users/${user_id}/send_verification_code/`, {
        method: 'GET',
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 400 && body.expired) { 
            verifyEmailMessage.textContent = 'Verification code expired! Request a new one.';
            verifyEmailMessage.style.color = 'red';
            document.querySelector('.verify-email-message-container').style.display = 'block';
            return;
        }

        if (verificationCodeInput.value !== body.verification_code) {
            verifyEmailMessage.textContent = 'Incorrect code!';
            verifyEmailMessage.style.color = 'red';
            document.querySelector('.verify-email-message-container').style.display = 'block';
        }
        else {
            verifyUser();
        }
    })
    .catch(error => {
        alert(error.message);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '100%';
        submitBtn.textContent = 'Submit';
    });
}


 
function verifyUser() {
    fetch('https://tutorlinc-ws.onrender.com/auth/users/me/', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${accessToken}`,
        },
        body: JSON.stringify({
            is_verified: true
        })
    })
    .then(response => {
        if(!response.ok){
            throw new Error(response.error);
        }
        else{
            document.getElementById('verify-email-container').style.display = 'none';
            verifiedLoginContainer.style.display = 'block';
        }
        return response.json();
    })
    .catch(error => {
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
    })
}
