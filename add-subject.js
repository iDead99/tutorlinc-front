const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const subject = document.getElementById('subject');
const amount = document.getElementById('amount');
const teachingDay = document.getElementById('teaching-day');
const startTime = document.getElementById('start-time');
const endTime = document.getElementById('end-time');

const submitBtn = document.querySelector('.btn-add-subject');

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

document.getElementById('add-subject-form').addEventListener('submit', function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    if (submitBtn.disabled) {
        submitBtn.style.opacity = '80%';
    }
    addSubject()
});

function addSubject() {
    const start = startTime.value;
    const end = endTime.value;

    if (start >= end) {
        alert("Start time must be earlier than end time.");
        submitBtn.disabled = false;
        submitBtn.style.opacity = '100%';
        return; // Stop execution
    }

    fetch(`http://127.0.0.1:8000/manage_tutorlinc/subjects/`, {
        method: 'POST',
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: subject.value,
            price: amount.value,
            day_to_teach: teachingDay.value,
            start_time: start,
            end_time: end
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network was not ok!');
        } else {
            operationDone.style.display = 'block';
            window.location.href = '#operation-done';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '100%';
            clearInput();
        }
        return response.json();
    })
    .then(data => {
        // Optionally handle the response data
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '100%';
        alert(error);
    });
}

function clearInput(){
    subject.value = '';
    amount.value = '';
    teachingDay.value = '';
    startTime.value = '';
    endTime.value = '';
}