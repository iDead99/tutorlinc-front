const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const subjectTable = document.querySelector('.subjects-table');
const confirmDeleteSubject = document.getElementById('confirm-delete-subject');
const confirmDeleteSubjectYESbtn = document.getElementById('confirm-delete-subject-yes-btn');
const confirmDeleteSubjectNObtn = document.getElementById('confirm-delete-subject-no-btn');

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
        getSubject(data.id);
    })
    .catch(error => {
        alert(error)
    })
}

function getSubject(id){

    fetch(`http://127.0.0.1:8000/manage_tutorlinc/subjects/?teacher__id=${id}`, {
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
            displaySubject(data);
    })
    .catch(error => {
        alert(error);
    })
}


function deleteSubject(id){

    fetch(`http://127.0.0.1:8000/manage_tutorlinc/subjects/${id}/`, {
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
            window.location.href="subject.html";
        }
    })
    .catch(error => {
        alert(error);
    })
}


function displaySubject(subjectData){
    const tbody = document.getElementById('tbody');
    
    tbody.innerHTML='';

    if(subjectData.length === 0){
        tbody.innerHTML = '<tr><td colspan="5">No subject available</td></tr>';
        return;
    }

    const headers = Object.keys(subjectData[0]).filter(header => (header !== 'id' && header !== 'day_to_teach' &&  header !== 'start_time' && header !== 'end_time' && header!=='teacher'));

    subjectData.forEach(item => {
        const tr = document.createElement('tr');
        tr.className='tr';

        const btnEdit = document.createElement('button');
        const btnDelete = document.createElement('button');

        btnEdit.className='btn-edit';
        btnEdit.textContent='Edit';
        btnEdit.addEventListener('click', function() {
            if(item.id){
                window.location.href = `edit-subject.html?id=${item.id}`;
            }
        })

        btnDelete.className='btn-delete';
        btnDelete.textContent='Delete';
        btnDelete.addEventListener('click', function() {
            subjectTable.style.display='none';
            document.querySelector('.add-subject-btn').style.display='none';
            confirmDeleteSubject.style.display='block';

            confirmDeleteSubjectYESbtn.onclick=function(){
                deleteSubject(item.id);
             }
             confirmDeleteSubjectNObtn.onclick=function(){
                window.location.href="subject.html";
            }
        })

        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header];
            tr.appendChild(td);
            tr.appendChild(btnEdit)
            tr.appendChild(btnDelete);
        });
        tbody.appendChild(tr);
    });

}
