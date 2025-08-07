const teacherAdditionalDataContainer = document.querySelector('.teacher-additional-data-container');

const fullName = document.getElementById('full-name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const message = document.getElementById('message');

const formModal = document.getElementById('form-modal');
const operationDoneModal = document.getElementById('operation-done-modal');

const operationDoneBtn = document.getElementById('operation-done-btn');

const inquiryBtn = document.querySelector('.inquiry-btn');
const teacherStatusMessage = document.querySelector('.teacher-status-msg');
const submitBtn = document.querySelector('.btn-submit');



// fullName.addEventListener('input', () => {
//     operationDone.style.display = 'none';
// })
// email.addEventListener('input', () => {
//     operationDone.style.display = 'none';
// })
// phone.addEventListener('input', () => {
//     operationDone.style.display = 'none';
// })
// message.addEventListener('input', () => {
//     operationDone.style.display = 'none';
// })

document.addEventListener('DOMContentLoaded', function() { 
    const params = new URLSearchParams(window.location.search);
    const teacherId = params.get('id');
    const type = params.get('type'); 

    if (teacherId) {
        if (type === 'teacher') {
            getTeacher(teacherId);
            getSubjects(teacherId);
            getAddress(teacherId);
        }
        else if (type === 'subject') {
            getTeacher(teacherId);
            getSubjects(teacherId);
            getAddress(teacherId);
        }
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
            teacherImage.onerror = function () {
                this.onerror = null; // Prevent infinite loop if fallback also fails
                this.src = "./images/logo.png";
            };
        }

        teacherImageContainer.appendChild(teacherImage);

        let teacherGender = '';
        if(data.gender === 'Female'){
            teacherGender = 'Madam';
        }
        else{
            teacherGender = 'Sir';
        }
        const teacherName = document.getElementById('teacher-name');
        teacherName.textContent = `${teacherGender} ${data.user.first_name} ${data.user.last_name}`;

        if(data.availability_status === 'Active'){
            teacherStatusMessage.innerHTML = `This teacher is <b>${data.availability_status}<b>✅`;
        }
        else{
            teacherStatusMessage.innerHTML = `This teacher is <b>${data.availability_status}<b>❌`;
        }

        document.querySelector('.inquiry-btn-container').style.display = 'flex';

        inquiryBtn.addEventListener('click', function() {
            if(data.availability_status === 'Active'){
                formModal.style.display = 'flex';
            }
            else{
                const response = confirm('This teacher is currently inactive. Would you like to proceed with your inquiry?')
                if (response === true){
                    formModal.style.display = 'flex';
                }
                else{
                    return;
                }
            }
        })

        document.querySelector('.modal-form').addEventListener('submit', function(e) {
            e.preventDefault();
        
            submitBtn.disabled=true;
            if(submitBtn.disabled===true){
             submitBtn.style.opacity='50%';
            }
            const inquiryData = {
                student_name: fullName.value,
                email: email.value,
                phone: phone.value,
                message: message.value,
                teacher: data.id
            }
            sendInquiry(inquiryData);
            
        })

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

        let subjectCount=0;

        data.forEach(subjects => {
            subjectCount++;

            const teacherSubjectList = document.createElement('li');
            teacherSubjectList.className = 'teacher-subject';
            teacherSubjectList.innerHTML = '<p style="color: black;">No result found!</p>'
            teacherSubjectList.innerHTML = `<h4>${subjects.name}:</h4> [${subjects.day_to_teach}] [${subjects.start_time} - ${subjects.end_time}] [GHS${subjects.price}]`;
            teacherSubjectContainer.appendChild(teacherSubjectList);
        })
        teacherAdditionalDataContainer.appendChild(teacherSubjectContainer);

        if(subjectCount === 0){
            teacherSubjectContainer.innerHTML = '<p style="color: black;">No subject added</p>';
        }

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


function sendInquiry(inquiryData){
    fetch('http://127.0.0.1:8000/manage_tutorlinc/inquiries/', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inquiryData)
    })
    .then(response => {
        if(!response.ok){
            throw new Error(response.error)
        }
        else{
            formModal.style.display = 'none';
            operationDoneModal.style.display = 'flex';
            submitBtn.disabled = false;
            if (submitBtn.disabled === false) {
                submitBtn.style.opacity = '100%';
            }
            fullName.value = '';
            email.value = '';
            phone.value = '';
            message.value = '';
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
    formModal.style.display = 'none';
})
operationDoneBtn.addEventListener('click', function(e) {
    operationDoneModal.style.display = 'none';
})