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
    getSubject();
})

function getSubject(){

    fetch('http://127.0.0.1:8000/manage_tutorlinc/subjects/', {
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