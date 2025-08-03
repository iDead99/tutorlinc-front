const step1 = document.getElementById('step-1');
const signupAddress = document.getElementById('signup-address');
const signupVerify = document.getElementById('signup-verify');

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
// const confirmPassword = document.getElementById('confirm-password');
const userSubmitBtn = document.getElementById('user-submit-btn');

const userSpinner = document.querySelector('.user-spinner');

email.addEventListener('input', () => {
   emailError.textContent='';
})
password.addEventListener('input', () => {
   passwordError.textContent='';
})
// confirmPassword.addEventListener('input', () => {
//    passwordError.textContent='';
// })

document.addEventListener('DOMContentLoaded', () => {
   step1.classList.add('current-step')
})

document.getElementById('user-info-form').addEventListener('submit',function(e) {
   e.preventDefault()

   emailError.textContent='';
   passwordError.textContent='';

   //  if(password.value!==confirmPassword.value){
   //    passwordError.textContent='Passwords do not match!';
   //    window.location.href='#password-error';
   //    return;
   // }
   userSpinner.style.display='inline-block';
   userSubmitBtn.disabled=true;
   
   const userData={
      first_name: firstName.value.charAt(0).toUpperCase() + firstName.value.slice(1).toLowerCase(),
      last_name: lastName.value.charAt(0).toUpperCase() + lastName.value.slice(1).toLowerCase(),
      email: email.value,
      password: password.value,
      };

   createUser(userData);

})

function createUser(userData){
   fetch("http://127.0.0.1:8000/auth/users/", {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
        body: JSON.stringify(userData)
        })
        .then(response => {
         if(!response.ok){
            return response.json().then(error =>{
                if(error.email){
                  emailError.textContent=error.email;
                  window.location.href='#email-error';
                }
                if(error.password){
                  passwordError.textContent=error.password;
                  window.location.href='#password-error';
                }
            })   
         }
            return response.json();
        })
        .then(data => {
            if(data.id){
               window.location.href = `../send-email.html?id=${data.id}`;
            }
        })
      .catch(error => {
      if (error.message === 'Failed to fetch') {
         alert("Network error! Please check your internet connection.");
      } else {
         return error;
      }
      })
      .finally(() => {
         userSpinner.style.display='none';
         userSubmitBtn.disabled=false;
      });

    }