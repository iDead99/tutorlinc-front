const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const totalSubject = document.getElementById('total-subjects');
const totalInquiry = document.getElementById('total-inquiries');

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

const accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
    window.location.href = "signin.html";
}

document.addEventListener('DOMContentLoaded', function() {
    getTeacher();
})

function getTeacher(){

    fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/teachers/me/', {
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
        getSubject(data.id);
        getInquiry(data.id)
    })
    .catch(error => {
        alert(error)
    })
}

function getSubject(id){

    fetch(`https://tutorlinc-ws.onrender.com/manage_tutorlinc/subjects/?teacher__id=${id}`, {
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error ('Network was not ok!')
        }
        return response.json();
    })
    .then(data => {
        let subjectNumber=0;
        data.forEach(() => {
            subjectNumber++;
        })
        totalSubject.textContent=subjectNumber;
    })
    .catch(error => {
        alert(error);
    })
}

function getInquiry(id){

    fetch(`https://tutorlinc-ws.onrender.com/manage_tutorlinc/inquiries/?teacher__id=${id}`, {
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error ('Network was not ok!')
        }
        return response.json();
    })
    .then(data => {
        let inquiryNumber=0;
        data.forEach(() => {
            inquiryNumber++;
        })
        totalInquiry.textContent=inquiryNumber;
    })
    .catch(error => {
        alert(error);
    })
}