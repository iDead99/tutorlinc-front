const passwordResetForm = document.querySelector('.password-reset-form');
const newPassword = document.getElementById('new-password-input');
const passwordResetError = document.getElementById('password-reset-error');
const submitBtn = document.querySelector('.submit-btn');

const resetDoneModalContent = document.getElementById('reset-done-modal-content');
const doneModalContent = document.getElementById('done-modal-content');
const loginBtn = document.querySelector('.login-btn');

const spinner = document.querySelector('.spinner');

// Function to get the value of a query parameter from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the token from the URL
const resetToken = getQueryParam('token');

loginBtn.addEventListener('click', () => {
    window.location.href = '../login.html'
});

passwordResetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    passwordResetError.textContent = '';

    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    if (resetToken) {
        const confirmData = {
            token: resetToken,
            new_password: newPassword.value,
        }
        console.log('yes token');
        
        resetPasswordConfirm(confirmData);
    } else {
        return;
    }
});


function resetPasswordConfirm(confirmData) {
    fetch('http://127.0.0.1:8000/custom_user/users/confirm-password-reset/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmData),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                if (error.error) {
                    passwordResetError.textContent = error.error;
                    return;
                }
                if (error.new_password) {
                    passwordResetError.textContent = error.new_password;
                    return;
                }
            })
        } else {
            resetDoneModalContent.style.display = 'none';
            doneModalContent.style.display = 'block';
            newPassword.value = '';
        }
        return response.json();
    })
    .catch(error => {
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            return error;
        }
    })
    .finally(() => {
        spinner.style.display = 'none';
        submitBtn.disabled = false;
    });
}
