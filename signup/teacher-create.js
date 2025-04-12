// *******************teacher details*******************
const teacherInfoForm = document.getElementById('teacher-info-form');
const phone = document.getElementById('phone');
const gender = document.getElementById('gender');
const qualification = document.getElementById('qualification');
const bio = document.getElementById('bio');
const teacherSubmitBtn = document.getElementById('teacher-submit-btn');

// *******************address details*******************
const addressInfoForm = document.getElementById('address-info-form');
const region = document.getElementById('region');
const town = document.getElementById('town');
const street = document.getElementById('street');
const addressSubmitBtn = document.getElementById('address-submit-btn');

// *******************verification details*******************
const verificationInfoForm = document.getElementById('verification-info-form');
const idCard = document.getElementById('id-card');
const certificate = document.getElementById('certificate');
const idCardError = document.getElementById('id-card-error');
const certificateError = document.getElementById('certificate-error');
const verificationSubmitBtn = document.getElementById('verification-submit-btn');

const skipDocumentsVerificationModal = document.querySelector('.skip-documents-verification-modal');
const verificationSkip = document.getElementById('verification-skip');
const modalUploadBtn = document.querySelector('.modal-btn-upload');
const modalSkipBtn = document.querySelector('.modal-btn-skip');

const documentVerificationDoneModal = document.getElementById("document-verification-done");
const documentVerificationDoneBtn = document.querySelector(".document-verification-done-btn");

const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const step4 = document.getElementById('step-4');

const teacherSpinner = document.querySelector('.teacher-spinner');
const AddressSpinner = document.querySelector('.address-spinner');
const verificationSpinner = document.querySelector('.verification-spinner');

idCard.addEventListener('input', function(){
   idCardError.textContent = '';
})
certificate.addEventListener('input', function(){
   certificateError.textContent = '';
})

const accessToken=localStorage.getItem('accessToken');
if(!accessToken){
    window.location.href = '../login.html?next=complete-profile';
}

document.addEventListener('DOMContentLoaded', () => {
    step1.classList.add('current-step');
    step2.classList.add('current-step');
 })

teacherInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    teacherSpinner.style.display='inline-block';
    teacherSubmitBtn.disabled=true;

    const teacherData={
        phone: phone.value,
        gender: gender.value,
        highest_qualification: qualification.value,
        bio: bio.value.charAt(0).toUpperCase() + bio.value.slice(1).toLowerCase(),
        };
    createTeacher(teacherData);
})


function createTeacher(teacherData){    

    fetch('https://tutorlinc-ws.onrender.com//manage_tutorlinc/teachers/me/', {
    method: 'PUT',
    headers: {
       'Authorization': `JWT ${accessToken}`,
       'Content-Type': 'application/json',
    },
    body: JSON.stringify(teacherData)
    })
    .then(response =>{
        if(!response.ok){
        throw new Error('Network was not ok');
        }
        else{
            teacherInfoForm.style.display = 'none';
            addressInfoForm.style.display = 'block';
            step1.classList.add('current-step');
            step2.classList.add('current-step');
            step3.classList.add('current-step');
        }
        return response.json();
    })
    .catch(error =>{
         if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        }
        else {
            return error;
        }
    })
    .finally(() => {
        teacherSpinner.style.display='none';
        teacherSubmitBtn.disabled=false;
    });
 }


 addressInfoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    AddressSpinner.style.display='inline-block';
    addressSubmitBtn.disabled=true;
 
    const addressData={
        region: region.value,
        town: town.value,
        street: street.value,
        };
    createAddress(addressData);
 })
 
 function createAddress(addressData){

    fetch('https://tutorlinc-ws.onrender.com//manage_tutorlinc/addresses/', {
    method: 'POST',
    headers: {
       'Authorization': `JWT ${accessToken}`,
       'Content-Type': 'application/json',
    },
    body: JSON.stringify(addressData)
    })
    .then(response =>{
        if(!response.ok){
            throw new Error('Network was not ok');
        }
        else{
            teacherInfoForm.style.display = 'none';
            addressInfoForm.style.display = 'none';
            verificationInfoForm.style.display = 'block';
            step1.classList.add('current-step');
            step2.classList.add('current-step');
            step3.classList.add('current-step');
            step4.classList.add('current-step');
        }
        return response.json();
    })
    .catch(error =>{
         if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        }
        else {
            return error;
        }
    })
    .finally(() => {
        AddressSpinner.style.display='none';
        addressSubmitBtn.disabled=false;
    });
}


verificationInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    idCardError.textContent = '';
    certificateError.textContent = '';
 
    verificationSpinner.style.display = 'inline-block';
    verificationSubmitBtn.disabled = true;

    const formData = new FormData();
    formData.append('id_card', idCard.files[0]);
    formData.append('certificate', certificate.files[0]);

    createVerification(formData);
 });
 
 function createVerification(verificationFormData) {
 
    fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/verifications/', {
       method: 'POST',
       headers: {
          'Authorization': `JWT ${accessToken}`,
       },
       body: verificationFormData,
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(error =>{
                if (error.id_card) {
                    idCardError.textContent = error.id_card;
                    window.location.href = '#id-card-error';
                }
                if (error.certificate) {
                    certificateError.textContent = error.certificate;
                    window.location.href = '#certificate-error';
                }
        });
       }
       else{
            teacherInfoForm.style.display = 'none';
            addressInfoForm.style.display = 'none';
            verificationInfoForm.style.display = 'none';
            documentVerificationDoneModal.style.display = 'flex';
            documentVerificationDoneBtn.addEventListener('click', () => {
                window.location.href = 'overview.html';
            })
       }
        return response.json();
    })
    .catch(error =>{
        if (error.message === 'Failed to fetch') {
           alert("Network error! Please check your internet connection.");
       }
       else {
           return error;
       }
   })
   .finally(() => {
       verificationSpinner.style.display='none';
       verificationSubmitBtn.disabled=false;
   });
 }

verificationSkip.addEventListener('click', () => {
    skipDocumentsVerificationModal.style.display = 'flex';
})

modalUploadBtn.addEventListener('click', () => {
    skipDocumentsVerificationModal.style.display = 'none';
})

modalSkipBtn.addEventListener('click', () => {
    window.location.href = '../overview.html';
})