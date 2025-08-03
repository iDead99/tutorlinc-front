const passwordResetForm = document.querySelector('.password-reset-form');
const email = document.getElementById('email');
const spinner = document.querySelector('.spinner');
const passwordResetMessage = document.querySelector('.password-reset-message');
const submitBtn = document.querySelector('.submit-btn');


email.addEventListener('input', () => {
    passwordResetMessage.textContent = '';
})

passwordResetMessage.style.display = 'none';
passwordResetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    passwordResetMessage.textContent = '';

    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    requestPasswordReset();

})
 
function requestPasswordReset() {
    fetch(`http://127.0.0.1:8000/custom_user/users/request-password-reset/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            email: email.value,
        }),
    })
    .then(response => {
        if(!response.ok){
            throw new Error(response.error);
        }
        return response.json();
    })
    .then(data => {
        passwordResetMessage.textContent = data.message;
        passwordResetMessage.style.display = 'block';
        spinner.style.display = 'none';
    })
    .catch(error => {
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
    })
    .finally(() => {
        spinner.style.display='none';
        submitBtn.disabled=false;
    });
}
