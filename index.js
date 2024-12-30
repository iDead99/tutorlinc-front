const teacherContainer = document.querySelector('.teacher-container');

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    // Change button content based on toggle
    if (menuToggle.textContent === '☰') {
        menuToggle.textContent = '✖'; // Change to 'close' icon
    } else {
        menuToggle.textContent = '☰'; // Change back to 'hamburger' icon
    }
});

document.addEventListener('DOMContentLoaded', () => {
    getTeacher()
})

function getTeacher(){
    fetch('http://127.0.0.1:8000/core/users/', {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if(!response.ok){
            
        }
        return response.json();
    })
    .then(data => {
        
    })
}