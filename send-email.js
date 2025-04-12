const spinner = document.querySelector('.spinner');
const verifyEmailMessage = document.querySelector('.verify-email-message');
const resendBtn = document.querySelector('.resend-btn');


const accessToken=localStorage.getItem('accessToken');

// if(!accessToken){
//     window.location.href="overview.html";
// }

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    verifyEmailMessage.style.display = 'none';
    spinner.style.display = 'inline-block';
    resendBtn.disabled = true;
    if(resendBtn.disabled === true){
        resendBtn.style.opacity = '50%';
    }
    
    sendVerificationEmail(userId);

})
 
function sendVerificationEmail(userId) {
    fetch(`https://tutorlinc-ws.onrender.com/custom_user/users/${userId}/send_verification/`, {
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
        spinner.style.display = 'none';
    })
    .catch(error => {
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
    })
}
