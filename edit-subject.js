const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const subject = document.getElementById('subject');
const amount = document.getElementById('amount');
const teachingDay = document.getElementById('teaching-day');
const startTime = document.getElementById('start-time');
const endTime = document.getElementById('end-time');

const submitBtn = document.querySelector('.btn-edit-subject');

const operationDone = document.getElementById('operation-done');

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
    window.location.href = "login.html";
}

subject.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
amount.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
teachingDay.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
startTime.addEventListener('input', () => {
    operationDone.style.display = 'none';
})
endTime.addEventListener('input', () => {
    operationDone.style.display = 'none';
})

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const subjectId = params.get('id');

    if (subjectId) {
        getParticularSubject(subjectId);
    }
});

function getParticularSubject(id) {

    fetch(`http://127.0.0.1:8000/manage_tutorlinc/subjects/${id}/`, {
        headers: {
            'Authorization': `JWT ${accessToken}`,
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
        populateSubjectForm(data)
    })
    .catch(error => {
        alert(error);
    });
}

function populateSubjectForm(subjectData) {
    subject.value = subjectData.name;
    amount.value = subjectData.price;
    teachingDay.value = subjectData.day_to_teach;
    startTime.value = subjectData.start_time;
    endTime.value = subjectData.end_time;
}

document.getElementById('edit-subject-form').addEventListener('submit', function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    if (submitBtn.disabled) {
        submitBtn.style.opacity = '80%';
    }
    
    const params = new URLSearchParams(window.location.search);
    const subjectId = params.get('id');

    if (subjectId) {
        updateSubject(subjectId);
    }
});

function updateSubject(id) {
    
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/subjects/${id}/`, {
        method: 'PUT',
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: subject.value,
            price: amount.value,
            day_to_teach: teachingDay.value,
            start_time: startTime.value,
            end_time: endTime.value
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network was not ok!');
        } else {
            operationDone.style.display = 'block';
            window.location.href='#operation-done'
            submitBtn.disabled = false;
            if (submitBtn.disabled === false) {
                submitBtn.style.opacity = '100%';
            }
            const params = new URLSearchParams(window.location.search);
            const subjectId = params.get('id');
        
            if (subjectId) {
                getParticularSubject(subjectId);
            }
        }
        return response.json();
    })
    .then(data => {
    })
    .catch(error => {
        alert(error);
    });
}
