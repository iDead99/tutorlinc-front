const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const inquiryTable = document.querySelector('.inquiry-table');

const deleteInquiryModal = document.querySelector('.delete-inquiry-modal');
const deleteInquiryDeleteBtn = document.getElementById('delete-inquiry-delete-btn');
const deleteInquiryCancelBtn = document.getElementById('delete-inquiry-cancel-btn');

const inquiryResponseModal = document.querySelector('.inquiry-response-modal');
const inquiryHeader = document.querySelector('.inquiry-header');
const fullName = document.getElementById('full-name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const message = document.getElementById('message');

const quitInquiryResponse = document.querySelector('.quit-inquiry-response');

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

const accessToken=localStorage.getItem('accessToken');

if(!accessToken){
    window.location.href="login.html";
}
document.addEventListener('DOMContentLoaded', function() {
    getTeacher();
})

function getTeacher(){

    fetch('http://127.0.0.1:8000/manage_tutorlinc/teachers/me/', {
        headers: {
            'Authorization': `JWT ${accessToken}`,
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
        getInquiry(data.id);
    })
    .catch(error => {
        alert(error)
    })
}

function getInquiry(id){

    fetch(`http://127.0.0.1:8000/manage_tutorlinc/inquiries/?teacher__id=${id}`, {
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
            displayInquiry(data);
    })
    .catch(error => {
        alert(error);
    })
}


function deleteInquiry(id){

    fetch(`http://127.0.0.1:8000/manage_tutorlinc/inquiries/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error ('Network was not ok!')
        }
        else{
            deleteInquiryModal.style.display='none';
            getTeacher();
        }
    })
    .catch(error => {
        alert(error);
    })
}

function displayInquiry(inquiryData){
    const tbody = document.getElementById('tbody');
    
    tbody.innerHTML='';

    if(inquiryData.length === 0){
        tbody.innerHTML = '<tr><td colspan="5">No inquiry available</td></tr>';
        return;
    }

    const headers = Object.keys(inquiryData[0]).filter(header => (header !== 'id' && header !== 'email' &&  header !== 'phone' && header !== 'message' &&  header !== 'teacher'));

    inquiryData.forEach(item => {
        const tr = document.createElement('tr');
        tr.className='tr';

        const btnView = document.createElement('button');
        const btnDelete = document.createElement('button');

        btnView.className='btn-view';
        btnView.textContent='view';
        btnView.addEventListener('click', function() {
            inquiryHeader.textContent = `An inquiry from ${item.student_name}`;
            fullName.textContent = item.student_name;
            if(item.email === null || item.email === ""){
                email.innerHTML = '<i>[No email provided]</i>';
            }
            else{
                email.textContent = item.email;
            }
            phone.textContent = item.phone;
            message.textContent = item.message;
            inquiryResponseModal.style.display = 'flex';
        })

        btnDelete.className='btn-delete';
        btnDelete.textContent='Delete';
        btnDelete.addEventListener('click', function() {
            deleteInquiryModal.style.display='flex';

            deleteInquiryDeleteBtn.onclick=function(){
                deleteInquiry(item.id);
             }
             deleteInquiryCancelBtn.onclick=function(){
                deleteInquiryModal.style.display='none';
            }
        })

        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header];
            tr.appendChild(td);
            tr.appendChild(btnView);
            tr.appendChild(btnDelete);
        });
        tbody.appendChild(tr);
    });

}

quitInquiryResponse.addEventListener('click', () => {
    inquiryResponseModal.style.display = 'none';
})