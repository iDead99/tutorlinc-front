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

const banner1 = document.getElementById('banner-1');
const banner2 = document.getElementById('banner-2');

const bannerNav1 = document.getElementById('banner-nav-1');
const bannerNav2 = document.getElementById('banner-nav-2');

const marqueeText = document.getElementById('marquee-text');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    // Change button content based on toggle
    if (menuToggle.textContent === '☰') {
        menuToggle.textContent = '✖'; // Change to 'close' icon
    } else {
        menuToggle.textContent = '☰'; // Change back to 'hamburger' icon
    }
});

setTimeout(() => {
    marqueeText.classList.add("animate-marquee");
}, 4000);

function showBanner(bannerToShow, bannerToHide, navToHighlight, navToDim) {
    bannerToShow.style.display = 'block';
    bannerToHide.style.display = 'none';
    navToHighlight.style.opacity = '100%';
    navToDim.style.opacity = '40%';
}

bannerNav1.addEventListener('click', () => {
    showBanner(banner1, banner2, bannerNav1, bannerNav2);
});

bannerNav2.addEventListener('click', () => {
    showBanner(banner2, banner1, bannerNav2, bannerNav1);
});

let toggle = true;

setInterval(() => {
    if (toggle) {
        showBanner(banner2, banner1, bannerNav2, bannerNav1);
    } else {
        showBanner(banner1, banner2, bannerNav1, bannerNav2);
    }
    toggle = !toggle;
}, 8000);

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

function getTeacher(id){
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/teachers/`, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if(!response.ok){
            throw new Error(response.error);
        }
        return response.json();
    })
    .then(data => {
        displayTeacher(data);        
    })
    .catch(error => {
        // Display a meaningful error message
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
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
        let teacherGender = '';
        if(teachers.gender === 'Female'){
            teacherGender = 'Madam';
        }
        else{
            teacherGender = 'Sir';
        }
        teacherName.textContent = `${teacherGender} ${teachers.user.first_name}`;

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
     submitBtn.textContent = 'Adding...';
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
            commentInput.value = '';
        }
    })
    .catch(error => {
        // Display a meaningful error message
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
    })
    .finally(() => {
        submitBtn.disabled = false;
        if (submitBtn.disabled === false) {
            submitBtn.style.opacity = '100%';
            submitBtn.textContent = 'Add comment';
        }
        commentInput.value = '';
    });
}

function getComment(){
    fetch('http://127.0.0.1:8000/manage_tutorlinc/comments/', {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if(!response.ok){
            throw new Error(response.error);
        }
        return response.json();
    })
    .then(data => {
        displayComment(data);
    })
    .catch(error => {
        // Display a meaningful error message
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
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


let fetchedSubjects = new Map(); // Store subjects uniquely by ID
let debounceTimer = null; // Timer for debouncing API requests

locationSearchInput.addEventListener('input', function () {
    if (locationSearchInput.value.trim() === '') {
        document.querySelector('.location-title').style.display = 'none';
        document.querySelector('.subject-title').style.display = 'none';
        subjectSearchInput.disabled = true;
        subjectSearchInput.title = "Please enter location before searching subjects";
        subjectSearchInput.value = '';
        showPrimarySecondaryBtn();
    } else {
        subjectSearchInput.disabled = false;
        subjectSearchInput.title = "";
        hidePrimarySecondaryBtn();
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
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/addresses/?search=${locationQuery}`, {
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) throw new Error(response.error);
        return response.json();
    })
    .then(data => {
        locationResultContainer.innerHTML = '';
        document.querySelector('.location-title').style.display = 'block';
        fetchedSubjects.clear(); // Clear previous subjects
        let uniqueTeachers = new Set(); // Ensure unique teacher IDs

        if (data.length === 0) {
            locationResultContainer.innerHTML = '<p style="color: black;">No result found!</p>';
            if (subjectSearchInput.value !== '') {
                subjectResultContainer.innerHTML = '<p style="color: black;">No result found!</p>';
            }
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
    .catch(error => {
        // Display a meaningful error message
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
    })
}

function searchSubject(teacherId) {
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/subjects/?teacher__id=${teacherId}`, {
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) throw new Error(response.error);
        return response.json();
    })
    .then(data => {
        data.forEach(subject => {
            if (!fetchedSubjects.has(subject.id)) { // Ensure uniqueness
                fetchedSubjects.set(subject.id, subject);
            }
        });
        filterSubjects(subjectSearchInput.value); // Apply subject filter
    })
    .catch(error => {
        // Display a meaningful error message
        if (error.message === 'Failed to fetch') {
            alert("Network error! Please check your internet connection.");
        } else {
            alert(error.message);
        }
    })
}

subjectSearchInput.addEventListener('input', function () {
    if (subjectSearchInput.value !== '') {
        hidePrimarySecondaryBtn();
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => filterSubjects(subjectSearchInput.value), 300);
});

function filterSubjects(query) {
    subjectResultContainer.innerHTML = '';
    query = query.trim();

    if (query === '') {
        document.querySelector('.subject-title').style.display = 'none';
        return;
    }

    const filteredSubjects = Array.from(fetchedSubjects.values()).filter(subject =>
        subject.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredSubjects.length === 0) {
        document.querySelector('.subject-title').style.display = 'block';
        subjectResultContainer.innerHTML = '<p style="color: black;">No result found!</p>';
    } else {
        document.querySelector('.subject-title').style.display = 'block';
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
