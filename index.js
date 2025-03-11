const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const commentContainer = document.querySelector('.comment-container');
const commentInput = document.getElementById('comment-input');

const submitBtn = document.querySelector('.comment-btn');

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
    getComment()
})

function getTeacher(){
    fetch('http://127.0.0.1:8000/manage_tutorlinc/teachers/', {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Network was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayTeacher(data);        
    })
    .catch(error => {
        alert(error);
    })
}

function displayTeacher(teacherData){

    const teacherListSection = document.querySelector('.teacher-list-section');

    teacherData.forEach(teachers => {
        
        const teacherContainer = document.createElement('div');
        teacherContainer.className = 'teacher-container';
        teacherContainer.addEventListener('click', function() {
            if(teachers.id){
                window.location.href = `teacher-preview.html?id=${teachers.id}`;
            }
        })

        const statusContainer = document.createElement('div');
        statusContainer.className = 'status-container';

        const activationStatus = document.createElement('span');
        // activationStatus.className = 'activation-status';
        activationStatus.textContent = teachers.availability_status;
        // console.log(activationStatus.textContent);
        if(activationStatus.textContent === 'Active'){
            activationStatus.classList.add('activation-status-active')
        }
        else{
            activationStatus.classList.add('activation-status-inactive')
        }
        

        statusContainer.appendChild(activationStatus);

        const teacherImage = document.createElement('img');
        teacherImage.className = 'teacher-image';
        if(teachers.profile_picture === null){
            teacherImage.src = "./images/logo.png";
        }
        else{
            teacherImage.src = teachers.profile_picture;
        }

        const teacherName = document.createElement('span');
        teacherName.className = 'teacher-name';
        teacherName.textContent = `${teachers.user.first_name} ${teachers.user.last_name}`;

        teacherContainer.appendChild(statusContainer);
        teacherContainer.appendChild(teacherImage);
        teacherContainer.appendChild(teacherName);

        teacherListSection.appendChild(teacherContainer);
    })
}

document.querySelector('.comment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    submitBtn.disabled=true;
    if(submitBtn.disabled===true){
     submitBtn.style.opacity='50%';
    }

    addComment();
})

function addComment(){
    fetch('http://127.0.0.1:8000/manage_tutorlinc/comments/', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            comment: commentInput.value,
        })
    })
    .then(response => {
        if(!response.ok){
            throw new Error(response.error);
        }
        else{
            getComment();
            submitBtn.disabled = false;
            if (submitBtn.disabled === false) {
                submitBtn.style.opacity = '100%';
            }
            commentInput.value = '';
        }
    })
    .catch(error => {
        alert(error);
    })
}

function getComment(){
    fetch('http://127.0.0.1:8000/manage_tutorlinc/comments/', {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Network was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayComment(data);
    })
    .catch(error => {
        alert(error);
    })
}

function displayComment(commentData){
    const commentContainer = document.querySelector('.comment-container');
    commentContainer.innerHTML = '';
    commentData.forEach(comments => {
        const comment = document.createElement('div');
        comment.className = 'comment';
        const commentText = document.createElement('p');
        commentText.textContent = `"${comments.comment}"`;
        comment.appendChild(commentText);
        commentContainer.appendChild(comment);
    })
}