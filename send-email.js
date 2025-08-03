const spinner = document.querySelector('.spinner');
const verifyEmailMessage = document.querySelector('.verify-email-message');
const resendBtn = document.querySelector('.resend-btn');


const accessToken=localStorage.getItem('accessToken');

// if(!accessToken){
//     window.location.href="overview.html";
// }

resendBtn.addEventListener('click', () => {

    verifyEmailMessage.style.display = 'none';

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    spinner.style.display = 'inline-block';
    resendBtn.disabled = true;

    sendVerificationEmail(userId);

})
 
function sendVerificationEmail(userId) {
    fetch(`http://127.0.0.1:8000/custom_user/users/${userId}/send_verification/`, {
        method: 'POST',
    })
    .then(response => {
        if(!response.ok){
            throw new Error(response.error);
        }

        return response.json();
    })
    .then(data => {
        verifyEmailMessage.textContent = data.message;
        verifyEmailMessage.style.display = 'block';
    })
    .catch(error => {
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
    })
    .finally(() => {
        spinner.style.display = 'none';
        resendBtn.disabled = false;
    });
}
