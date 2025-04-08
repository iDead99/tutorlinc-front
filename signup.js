const signupPersonalInfo = document.getElementById('signup-personal-info');
const signupAddress = document.getElementById('signup-address');
const signupVerify = document.getElementById('signup-verify');

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const password = document.getElementById('password');
// const confirmPassword = document.getElementById('confirm-password');

const phone = document.getElementById('phone');
const gender = document.getElementById('gender');
const qualification = document.getElementById('qualification');
const bio = document.getElementById('bio');
// const profilePicture = document.getElementById('profile-picture');

const region = document.getElementById('region');
const town = document.getElementById('town');
const street = document.getElementById('street');

const idCard = document.getElementById('id-card');
const certificate = document.getElementById('certificate');

const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const idCardError = document.getElementById('id-card-error');
const certificateError = document.getElementById('certificate-error');

const personalInfoBtn = document.getElementById('personal-info-btn');
const addressBtn = document.getElementById('address-btn');
const verificationBtn = document.getElementById('verification-btn');

const personalInfoSpinner = document.getElementById('personal-info-spinner');
const addressSpinner = document.getElementById('address-spinner');
const verificationSpinner = document.getElementById('verification-spinner');

const verificationSkip = document.getElementById('verification-skip');

const skipContainer = document.getElementById("skip-container");
const skipOkBtn = document.getElementById("skip-ok-btn");
const skipCancelBtn = document.getElementById("skip-cancel-btn");

const registrationSucceedContainer = document.getElementById("registration-succeed-container");
const registrationSucceedOkBtn = document.getElementById("registration-succeed-ok-btn");

idCard.addEventListener('input', function(){
   idCardError.textContent = '';
})
certificate.addEventListener('input', function(){
   certificateError.textContent = '';
})

verificationSkip.addEventListener('click', function(){
   document.getElementById('verification-form').style.display='none';
   skipContainer.style.display='block';
})
skipOkBtn.addEventListener('click', function(){
    window.location.href="signin.html";
 })
skipCancelBtn.addEventListener('click', function(){
   skipContainer.style.display='none';
   document.getElementById('personal-info-form').style.display='none';
   document.getElementById('address-form').style.display='none';
   document.getElementById('verification-form').style.display='block';
})

registrationSucceedOkBtn.addEventListener('click', function(){
   window.location.href="signin.html";
})

email.addEventListener('input', () => {
   emailError.textContent='';
})
password.addEventListener('input', () => {
   passwordError.textContent='';
})
// confirmPassword.addEventListener('input', () => {
//    passwordError.textContent='';
// })

if(document.getElementById('personal-info-form').style.display==='block'){
   signupPersonalInfo.style.color='white';
   signupPersonalInfo.style.backgroundColor='black';
   signupPersonalInfo.style.opacity='100%';
   signupPersonalInfo.style.border='2px solid white';
}


document.getElementById('personal-info-form').addEventListener('submit',function(e) {
    e.preventDefault()

   //  if(password.value!==confirmPassword.value){
   //    passwordError.textContent='Passwords do not match!';
   //    window.location.href='#password-error';
   //    return;
   // }
   
   const userData={
      first_name: firstName.value.charAt(0).toUpperCase() + firstName.value.slice(1).toLowerCase(),
      last_name: lastName.value.charAt(0).toUpperCase() + lastName.value.slice(1).toLowerCase(),
      email: email.value,
      password: password.value,
      };

   firstRegistration(userData);

   personalInfoSpinner.style.display='block';
   personalInfoBtn.disabled=true;
   if(personalInfoBtn.disabled===true){
      personalInfoBtn.style.opacity='50%';
   }
})

function firstRegistration(userData){
    fetch("https://tutorlinc-ws.onrender.com/auth/users/", {
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
                personalInfoSpinner.style.display='none';
                personalInfoBtn.disabled=false;
                if(personalInfoBtn.disabled===false){
                  personalInfoBtn.style.opacity='100%';
                }
            })   
        }
        else{
         personalInfoSpinner.style.display='none';
         personalInfoBtn.disabled=false;
         if(personalInfoBtn.disabled===false){
            personalInfoBtn.style.opacity='100%';
         }

             const authUserData={
                email: email.value,
                password: password.value,
                };

        authenticateUser(authUserData);
        }
            return response.json();
        })
        .catch(error => {
         return error;
    })

    }

function authenticateUser(userData){
    fetch("https://tutorlinc-ws.onrender.com/auth/jwt/create",{
        method: 'POST',
        headers: {
           'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    
       })
       .then(response => {
        if(!response.ok){
             throw new Error('authentication failed!');
          }
          return response.json();
       })
     .then(data => {
      localStorage.setItem('accessToken', data.access);

      const secondUserData={
      phone: phone.value,
      gender: gender.value,
      highest_qualification: qualification.value,
      bio: bio.value,
      };
      
      secondRegistration(secondUserData);
    })
    .catch(error => {
     console.log('Error', error);
    });
}

function secondRegistration(secondUserData){
    const accessToken=localStorage.getItem('accessToken');

    fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/teachers/me/', {
    method: 'PUT',
    headers: {
       'Authorization': `JWT ${accessToken}`,
       'Content-Type': 'application/json',
    },
    body: JSON.stringify(secondUserData)
 })
 .then(response =>{
    if(!response.ok){
      personalInfoSpinner.style.display='none';
      personalInfoBtn.disabled=false;
      if(personalInfoBtn.disabled===false){
         personalInfoBtn.style.opacity='100%';
      }
      throw new Error('Network was not ok');
    }
    else{
      document.getElementById('personal-info-form').style.display='none';
      document.getElementById('address-form').style.display='block';
      document.getElementById('verification-form').style.display='none';

      if(document.getElementById('address-form').style.display==='block'){
         signupAddress.style.color='white';
         signupAddress.style.backgroundColor='black';
         signupAddress.style.opacity='100%';
         signupAddress.style.border='2px solid white';
      }
    }
    return response.json();
 })
 .catch(error =>{
    console.log(error, 'Second registration failed')
 });
 }

document.getElementById('address-form').addEventListener('submit', function(e) {
   e.preventDefault()

      const addressData={
         region: region.value,
         town: town.value,
         street: street.value,
         };
      AddressRegistration(addressData);

 addressSpinner.style.display='block';
 addressBtn.disabled=true;
 if(addressBtn.disabled===true){
   addressBtn.style.opacity='50%';
 }
})

function AddressRegistration(addressData){
   const accessToken=localStorage.getItem('accessToken');
   

   fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/addresses/', {
   method: 'POST',
   headers: {
      'Authorization': `JWT ${accessToken}`,
      'Content-Type': 'application/json',
   },
   body: JSON.stringify(addressData)
})
.then(response =>{
   if(!response.ok){
      addressSpinner.style.display='none';
      addressBtn.disabled=false;
      if(addressBtn.disabled===false){
         addressBtn.style.opacity='100%';
      }
      throw new Error('Network was not ok');
   }
   else{
      document.getElementById('address-form').style.display='none';
      document.getElementById('verification-form').style.display='block';
      document.getElementById('personal-info-form').style.display='none';

      if(document.getElementById('verification-form').style.display==='block'){
         signupVerify.style.color='white';
         signupVerify.style.backgroundColor='black';
         signupVerify.style.opacity='100%';
         signupVerify.style.border='2px solid white';
      }
   }
   return response.json();
})
.catch(error =>{
   addressSpinner.style.display='none';
   addressBtn.disabled=false;
   if(addressBtn.disabled===false){
      addressBtn.style.opacity='100%';
   }
   console.log(error, 'Address registration failed')
});
}

document.getElementById('verification-form').addEventListener('submit', function(e) {
   e.preventDefault();

   verificationSpinner.style.display = 'block';
   verificationBtn.disabled = true;
   verificationBtn.style.opacity = '50%';


   const verificationData = {
      id_card: idCard.files[0],
      certificate: certificate.files[0],
   };
   VerificationRegistration(verificationData);
   
});

function VerificationRegistration(verificationData) {
   const accessToken = localStorage.getItem('accessToken');
   const formData = new FormData();
   formData.append('id_card', verificationData.id_card);
   formData.append('certificate', verificationData.certificate);

   fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/verifications/', {
      method: 'POST',
      headers: {
         'Authorization': `JWT ${accessToken}`,
      },
      body: formData,
   })
   .then(response => {
      verificationSpinner.style.display = 'none';
      verificationBtn.disabled = false;
      verificationBtn.style.opacity = '100%';

      if(!response.ok){
         return response.json().then(error =>{
            console.log('Verification error', error); // Debugging log
            if (error.id_card && idCardError) {
               idCardError.textContent = error.id_card;
               window.location.href = '#id-card-error';
            }
            if (error.certificate && certificateError) {
               certificateError.textContent = error.certificate;
               window.location.href = '#certificate-error';
            }
         });
      }
      else{
         console.log('Verification successful'); // Debugging log
         skipContainer.style.display = 'none';
         document.getElementById('personal-info-form').style.display = 'none';
         document.getElementById('address-form').style.display = 'none';
         document.getElementById('verification-form').style.display = 'none';
         registrationSucceedContainer.style.display = 'block';
      
         localStorage.removeItem('accessToken');
      }
      return response.json();
   })
   .catch(error => {
      console.error('Verification registration failed', error); // Debugging log
      verificationSpinner.style.display = 'none';
      verificationBtn.disabled = false;
      verificationBtn.style.opacity = '100%';
   })
}