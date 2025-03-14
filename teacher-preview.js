const teacherAdditionalDataContainer = document.querySelector('.teacher-additional-data-container');

const fullName = document.getElementById('full-name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const message = document.getElementById('message');

const operationDone = document.getElementById('operation-done');

const inquiryBtn = document.querySelector('.inquiry-btn');
const submitBtn = document.querySelector('.btn-submit');

inquiryBtn.addEventListener('click', function() {
    document.querySelector('.modal').style.display = 'flex';
})

fullName.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
email.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
phone.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
message.addEventListener('input', () => {
    operationDone.style.display = 'none';
})

let teacherId;
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    teacherId = params.get('id');

    if (teacherId) {
        getTeacher(teacherId);
        getSubjects(teacherId);
        getAddress(teacherId);
    }
});

function getTeacher(teacher_id){
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/teachers/${teacher_id}/`, {
        headers: {
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
        const teacherImageContainer = document.querySelector('.teacher-image-container');
        const teacherImage = document.createElement('img');
        teacherImage.className = 'teacher-image';

        if(data.profile_picture === null){
            teacherImage.src = "./images/logo.png";
        }
        else{
            teacherImage.src = data.profile_picture;
        }

        teacherImageContainer.appendChild(teacherImage);

        const teacherName = document.getElementById('teacher-name');
        teacherName.textContent = `${data.user.first_name} ${data.user.last_name}`;
    })
    .catch(error => {
        alert(error)
    })
}

function getSubjects(teacher_id) {
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/subjects/?teacher__id=${teacher_id}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network was not ok!');
        }
        return response.json();
    })
    .then(data => {
        const teacherSubjectContainer = document.querySelector('.teacher-subject-container');

        const teacherSubjectTitle = document.createElement('span');
        teacherSubjectTitle.textContent = 'SUBJECTS';
        teacherSubjectTitle.className = 'teacher-subject-title';
        teacherSubjectContainer.appendChild(teacherSubjectTitle);

        data.forEach(subjects => {
            const teacherSubjectList = document.createElement('li');
            teacherSubjectList.className = 'teacher-subject';
            teacherSubjectList.textContent = `${subjects.name} - GHS${subjects.price}`;
            teacherSubjectContainer.appendChild(teacherSubjectList);
        })
        teacherAdditionalDataContainer.appendChild(teacherSubjectContainer);
    })
    .catch(error => {
        alert(error);
    });
}

function getAddress(teacher_id) {
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/addresses/?teacher__id=${teacher_id}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network was not ok!');
        }
        return response.json();
    })
    .then(data => {
        const teacherAddressContainer = document.querySelector('.teacher-address-container');

        const teacherAddressTitle = document.createElement('span');
        teacherAddressTitle.textContent = 'ADDRESS';
        teacherAddressTitle.className = 'teacher-address-title';
        teacherAddressContainer.appendChild(teacherAddressTitle);

        data.forEach(addresses => {
            const teacherAddress = document.createElement('li');
            teacherAddress.className = 'teacher-address';
            teacherAddress.textContent = `${addresses.region} region - ${addresses.town} town - ${addresses.street} street`;
            teacherAddressContainer.appendChild(teacherAddress);
        })
        teacherAdditionalDataContainer.appendChild(teacherAddressContainer);
    })
    .catch(error => {
        alert(error);
    });
}

document.querySelector('.modal-form').addEventListener('submit', function(e) {
    e.preventDefault();

    submitBtn.disabled=true;
    if(submitBtn.disabled===true){
     submitBtn.style.opacity='50%';
    }

    sendInquiry();
})

function sendInquiry(){

    fetch('http://127.0.0.1:8000/manage_tutorlinc/inquiries/', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            student_name: fullName.value,
            email: email.value,
            phone: phone.value,
            message: message.value,
            teacher: teacherId
        })
    })
    .then(response => {
        if(!response.ok){
            throw new Error(response.error)
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
    .catch(error => {
        submitBtn.disabled = false;
        if (submitBtn.disabled === false) {
            submitBtn.style.opacity = '100%';
        }
        alert(error)
    })
}

document.querySelector('.btn-cancel').addEventListener('click', function(e) {
    document.querySelector('.modal').style.display = 'none';
})