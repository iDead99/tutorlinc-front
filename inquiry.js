const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const inquiryTable = document.querySelector('.inquiry-table');
const confirmDeleteInquiry = document.getElementById('confirm-delete-inquiry');
const confirmDeleteInquiryYESbtn = document.getElementById('confirm-delete-inquiry-yes-btn');
const confirmDeleteInquiryNObtn = document.getElementById('confirm-delete-inquiry-no-btn');


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
    window.location.href="signin.html";
}
document.addEventListener('DOMContentLoaded', function() {
    getTeacher();
})


function getTeacher(){

    fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/teachers/me/', {
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

    fetch(`https://tutorlinc-ws.onrender.com/manage_tutorlinc/inquiries/?teacher__id=${id}`, {
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

    fetch(`https://tutorlinc-ws.onrender.com/manage_tutorlinc/inquiries/${id}/`, {
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
            window.location.href="inquiry.html";
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

    const headers = Object.keys(inquiryData[0]).filter(header => (header !== 'id' && header !== 'email' &&  header !== 'phone' && header !== 'teacher'));

    inquiryData.forEach(item => {
        const tr = document.createElement('tr');
        tr.className='tr';

        // const btnEdit = document.createElement('button');
        const btnDelete = document.createElement('button');

        // btnEdit.className='btn-edit';
        // btnEdit.textContent='Edit';
        // btnEdit.addEventListener('click', function() {
        //     if(item.id){
        //         window.location.href = `edit-subject.html?id=${item.id}`;
        //     }
        // })

        btnDelete.className='btn-delete';
        btnDelete.textContent='Delete';
        btnDelete.addEventListener('click', function() {
            inquiryTable.style.display='none';
            confirmDeleteInquiry.style.display='block';

            confirmDeleteInquiryYESbtn.onclick=function(){
                deleteInquiry(item.id);
             }
             confirmDeleteInquiryNObtn.onclick=function(){
                window.location.href="inquiry.html";
            }
        })

        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header];
            tr.appendChild(td);
            // tr.appendChild(btnEdit)
            tr.appendChild(btnDelete);
        });
        tbody.appendChild(tr);
    });

}
