const verifyIndicator = document.querySelector('.verify-indicator');
const doneContiner = document.querySelector('.done-continer');
const verifyDoneText = document.querySelector('.verify-done-text');
const continueBtn = document.querySelector('.continue-btn');

continueBtn.addEventListener('click', () => {
    window.location.href = 'login.html?next=complete-profile'
})


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const verificationToken = urlParams.get('token');  // Extract 'token' from the URL query parameters

    if (verificationToken) {
        verifyUser(verificationToken);
        
    } else {
        alert("Verification token is missing. Please check the verification link.");
    }
});

function verifyUser(verificationToken) {
    fetch(`http://127.0.0.1:8000/custom_user/users/verify-email/${verificationToken}/`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            verifyIndicator.style.display = 'none';
            verifyDoneText.textContent = `${data.message}✅`;
            doneContiner.style.display = 'flex';
        }
    })
    .catch(error => {
        console.error(error);
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
    });
}
