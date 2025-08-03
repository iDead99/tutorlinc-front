
const region = document.getElementById('region');
const town = document.getElementById('town');
const street = document.getElementById('street');

const submitBtn = document.querySelector('.btn-update-address');

const operationDone = document.getElementById('operation-done');
const updateMessage = document.getElementById('update-message');

const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar')

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

region.addEventListener('input', () => {
    operationDone.style.display = 'none';
    updateMessage.style.display = 'block';
})
town.addEventListener('input', () => {
    operationDone.style.display = 'none';
    updateMessage.style.display = 'block';
})
street.addEventListener('input', () => {
    operationDone.style.display = 'none';
    updateMessage.style.display = 'block';
})

const accessToken=localStorage.getItem('accessToken');

if(!accessToken){
window.location.href="login.html";
}

document.addEventListener('DOMContentLoaded', function() {
    getTeacher();
})

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
        getAddress(data.id);
    })
    .catch(error => {
        alert(error)
    })
}

function getAddress(id){
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/addresses/?teacher__id=${id}`, {
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
        data.forEach(items => {
            region.value = items.region;
            town.value = items.town;
            street.value = items.street;
        })
    })
    .catch(error => {
        alert(error)
    })
}

// *****************************Update Address*****************************
document.getElementById('address-form').addEventListener('submit',function(e) {
    e.preventDefault()

   submitBtn.disabled=true;
   if(submitBtn.disabled===true){
    submitBtn.style.opacity='50%';
   }
    getTeacherForAddressUpdate();
})

function getTeacherForAddressUpdate(){
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
        updateAddress(data.id);
    })
    .catch(error => {
        alert(error)
    })
}

function updateAddress(id) {
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/addresses/${id}/`, {
        method: 'PUT',
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            region: region.value,
            town: town.value,
            street: street.value,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network was not ok!');
        } else {
            updateMessage.style.display = 'none';
            operationDone.style.display = 'block';
            window.location.href='#operation-done'
            submitBtn.disabled = false;
            if (submitBtn.disabled === false) {
                submitBtn.style.opacity = '100%';
            }
        }
        return response.json();
    })
    .catch(error => {
        alert(error);
    });
}
