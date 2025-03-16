const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const locationSearchInput = document.getElementById('location-search-input');
const subjectSearchInput = document.getElementById('subject-search-input');

const locationResultContainer = document.querySelector('.location-result-container');
const subjectResultContainer = document.querySelector('.subject-result-container');

const primaryBtn = document.querySelector('.primary-btn');
const secondaryBtn = document.querySelector('.secondary-btn');

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

function hidePrimarySecondaryBtn(){
    primaryBtn.style.display = 'none';
    secondaryBtn.style.display = 'none';
}
function showPrimarySecondaryBtn(){
    primaryBtn.style.display = 'initial';
    secondaryBtn.style.display = 'initial';
}

document.addEventListener('DOMContentLoaded', () => {
    getTeacher()
    getComment()
})

function getTeacher(){
    fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/teachers/', {
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
                window.location.href = `teacher-preview.html?id=${teachers.id}&type=teacher`;
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
    fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/comments/', {

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
    fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/comments/', {
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


let fetchedSubjects = []; // Store subjects for filtering
let debounceTimer = null; // Timer for debouncing API requests

locationSearchInput.addEventListener('input', function () {
    if(locationSearchInput.value !== ''){
        hidePrimarySecondaryBtn();
    }
    else{
        showPrimarySecondaryBtn();
    }

    if (locationSearchInput.value.trim() === '') {
        subjectSearchInput.disabled = true;
        subjectSearchInput.title = "Please enter location before searching subjects";
        subjectSearchInput.value = '';
    }
    else {
        subjectSearchInput.disabled = false;
        subjectSearchInput.title = ""; // Clear the tooltip when enabled
    }

    clearTimeout(debounceTimer);
    
    const query = locationSearchInput.value.trim();
    if (query === '') {
        locationResultContainer.innerHTML = '';
        subjectResultContainer.innerHTML = '';
    } else {
        debounceTimer = setTimeout(() => searchLocation(query), 300); // Debounce API call
    }
});

function searchLocation(locationQuery) {
    fetch(`https://tutorlinc-ws.onrender.com/manage_tutorlinc/addresses/?search=${locationQuery}`, {
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) throw new Error('Network was not ok');
        return response.json();
    })
    .then(data => {
        locationResultContainer.innerHTML = '';
        fetchedSubjects = [];
        let uniqueTeachers = new Set(); // Store unique teacher IDs to prevent duplicate fetches

        if (data.length === 0) {
            locationResultContainer.innerHTML = '<b style="color: black;">No result found!</b>';
            return;
        }

        data.forEach(location => {
            const locationSearchList = document.createElement('li');
            locationSearchList.className = 'location-search';
            locationSearchList.textContent = `${location.street} - ${location.town} - ${location.region}`;
            locationResultContainer.appendChild(locationSearchList);

            if (location.teacher && !uniqueTeachers.has(location.teacher)) {
                uniqueTeachers.add(location.teacher);
                searchSubject(location.teacher);
            }
        });
    })
    .catch(error => alert(error));
}

function searchSubject(teacherId) {
    fetch(`https://tutorlinc-ws.onrender.com/manage_tutorlinc/subjects/?teacher__id=${teacherId}`, {
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) throw new Error('Network was not ok');
        return response.json();
    })
    .then(data => {
        fetchedSubjects = fetchedSubjects.concat(data); // Store subjects for filtering
        filterSubjects(subjectSearchInput.value); // Apply existing subject filter
    })
    .catch(error => alert(error));
}

subjectSearchInput.addEventListener('input', function () {
    if(subjectSearchInput.value !== ''){
        hidePrimarySecondaryBtn();
    }
    else{
        showPrimarySecondaryBtn();
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => filterSubjects(subjectSearchInput.value), 300);
});

function filterSubjects(query) {
    subjectResultContainer.innerHTML = '';
    query = query.trim();

    if (query === '') {
        return;
    }

    const filteredSubjects = fetchedSubjects.filter(subject =>
        subject.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredSubjects.length === 0) {
        subjectResultContainer.innerHTML = '<b style="color: black;">No result found!</b>';
    } else {
        filteredSubjects.forEach(subject => {
            const subjectSearchList = document.createElement('li');
            subjectSearchList.className = 'subject-search';
            subjectSearchList.textContent = subject.name;

            subjectSearchList.addEventListener('click', function () {
                if (subject.teacher) {
                    window.location.href = `teacher-preview.html?id=${subject.teacher}&type=subject`;
                }
            });

            subjectResultContainer.appendChild(subjectSearchList);
        });
    }
}
