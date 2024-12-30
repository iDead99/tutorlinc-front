const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');


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