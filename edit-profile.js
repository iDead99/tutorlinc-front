const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');

const phone = document.getElementById('phone');
const qualification = document.getElementById('qualification');
const bio = document.getElementById('bio');

const submitBtn = document.querySelector('.btn-edit-profile');

const operationDone = document.getElementById('operation-done');

menuToggle.addEventListener('click', () => {
    if(menuToggle.textContent === '☰'){
        menuToggle.textContent = '✖'
        sidebar.style.display = 'block';
        
    }
    else if(menuToggle.textContent === '✖'){
        menuToggle.textContent = '☰'
        sidebar.style.display = 'none';
    }
});

firstName.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
lastName.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
phone.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
qualification.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
bio.addEventListener('input', () => {
    operationDone.style.display = 'none';
})

const accessToken=localStorage.getItem('accessToken');

if(!accessToken){
window.location.href="login.html";
}

document.addEventListener('DOMContentLoaded', function() {
    getUser();
    getTeacher();
})

function getUser(){
    fetch('http://127.0.0.1:8000/auth/users/me/', {
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',          
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error('network not ok!')
        }
        return response.json()
    })
    .then(data => {
        firstName.value = data.first_name;
        lastName.value = data.last_name;
        email.value = data.email;
    })
    .catch(error => {
        alert(error)
    })
}

function getTeacher(){

    fetch('http://127.0.0.1:8000/manage_tutorlinc/teachers/me/', {
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',          
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error('network not ok!')
        }
        return response.json()
    })
    .then(data => {
        phone.value = data.phone;
        qualification.value = data.highest_qualification;
        if(data.bio === ''){
            bio.value = 'No bio';
        }
        else{
            bio.value = data.bio;
        }
    })
    .catch(error => {
        alert(error)
    })
}

document.getElementById('edit-profile-form').addEventListener('submit',function(e) {
    e.preventDefault()

   updateProfile();

   submitBtn.disabled=true;
   if(submitBtn.disabled===true){
    submitBtn.style.opacity='50%';
   }
})

function updateProfile() {
    fetch('http://127.0.0.1:8000/auth/users/me/', {
        method: 'PUT',
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: firstName.value.charAt(0).toUpperCase() + firstName.value.slice(1).toLowerCase(),
            last_name: lastName.value.charAt(0).toUpperCase() + lastName.value.slice(1).toLowerCase(),
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network was not ok!');
        }
        else {
            submitBtn.disabled = false;
            if (submitBtn.disabled === false) {
                submitBtn.style.opacity = '100%';
            }
            updateTeacher();
        }
        return response.json();
    })
    .then(data => {
    })
    .catch(error => {
        submitBtn.disabled = false;
        if (submitBtn.disabled === false) {
            submitBtn.style.opacity = '100%';
        }
        alert(error);
    });
}

function updateTeacher(){
    fetch('http://127.0.0.1:8000/manage_tutorlinc/teachers/me/', {
    method: 'PUT',
    headers: {
       'Authorization': `JWT ${accessToken}`,
       'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        phone: phone.value,
        highest_qualification: qualification.value,
        bio: bio.value,
    })
    })
    .then(response =>{
    if(!response.ok){
      throw new Error('Network was not ok');
    }
    else{
        operationDone.style.display = 'block';
        window.location.href='#operation-done'
        submitBtn.disabled = false;
        if (submitBtn.disabled === false) {
            submitBtn.style.opacity = '100%';
        }
    }
    return response.json();
 })
 .catch(error =>{
    submitBtn.disabled = false;
    if (submitBtn.disabled === false) {
        submitBtn.style.opacity = '100%';
    }
    alert(error);
 });
 }