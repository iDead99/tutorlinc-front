const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const statusToggle = document.querySelector('.status-toggle');
const statusText = document.querySelector('.status-text');

const totalSubject = document.getElementById('total-subjects');
const totalInquiry = document.getElementById('total-inquiries');

const addNewSubjectModal = document.getElementById('add-new-subject-modal');
const quitAddSubjectBtn = document.querySelector('.quit-add-subject-btn');


const publicVapidKey = 'BF5-lsS79GGBTVETO7P9iQTa9X51iOjzurHQoW9TUbiCumAiDACW-brv8qpTqpra7Il75JA0nztP1M_wJ1JniSU';

async function registerServiceWorker(userId) {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Push permission not granted");
        return;
      }

      const registration = await navigator.serviceWorker.register('service-worker.js');
      console.log("✅ Service Worker registered", registration);

      // Check for existing subscription
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("🔁 Existing subscription found, unsubscribing...");
        await existingSubscription.unsubscribe();
      }

      // Now subscribe with new key
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      console.log("✅ New subscription created:", subscription);

      await fetch('http://127.0.0.1:8000/manage_tutorlinc/subscriptions/', {
        method: 'POST',
        body: JSON.stringify({
          user: userId,
          endpoint: subscription.endpoint,
          auth: subscription.toJSON().keys.auth,
          p256dh: subscription.toJSON().keys.p256dh
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error("Push subscription failed", error);
    }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i)
    outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

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

document.addEventListener('DOMContentLoaded', function() {
    getTeacher();
    getAvailabilityStatus();
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
        getInquiry(data.id)
        registerServiceWorker(data.id);

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
        let subjectNumber=0;
        data.forEach(() => {
            subjectNumber++;
        })
        totalSubject.textContent=subjectNumber;
        if(subjectNumber === 0){
            addNewSubjectModal.style.display = 'flex';

            quitAddSubjectBtn.addEventListener('click', function() {
                addNewSubjectModal.style.display = 'none';
            })

        }
        else{
            addNewSubjectModal.style.display = 'none';
        }
    })
    .catch(error => {
        alert(error);
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
        let inquiryNumber=0;
        data.forEach(() => {
            inquiryNumber++;
        })
        totalInquiry.textContent=inquiryNumber;
    })
    .catch(error => {
        alert(error);
    })
}

statusToggle.addEventListener('click', function() {
        if(statusText.textContent === 'Active'){
            const availabilityStatusData={
                availability_status: 'Inactive',
                };
                const response = confirm('If you toggle this off, you will appear inactive to students. Are you sure you want to proceed?')
                if (response === true){
                    updateAvailabilityStatus(availabilityStatusData);
                }
                else{
                    return;
                }
        }
        else if(statusText.textContent === 'Inactive'){
            const availabilityStatusData={
                availability_status: 'Active',
                };
            updateAvailabilityStatus(availabilityStatusData);
        }
})

function getAvailabilityStatus(){
    
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
        document.querySelector('.status-container').style.display = 'flex';
        statusText.textContent = data.availability_status;
        if(statusText.textContent === 'Active'){
            statusToggle.classList.remove('toggle-inactive');
            statusToggle.classList.toggle('toggle-active')
            statusText.style.color = 'green';
        }
        else{
            statusToggle.classList.remove('toggle-active');
            statusToggle.classList.toggle('toggle-inactive')
            statusText.style.color = 'red';
        }
    })
    .catch(error => {
        alert(error)
    })
}

function updateAvailabilityStatus(availabilityStatusData){

    fetch('http://127.0.0.1:8000/manage_tutorlinc/teachers/me/', {
        method: 'PATCH',
        headers: {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type': 'application/json',          
        },
        body: JSON.stringify(availabilityStatusData)
    })
    .then(response => {
        if(!response.ok){
            throw new Error('network not ok!')
        }
        else{
            getAvailabilityStatus();
        }
        return response.json()
    })
    .catch(error => {
        alert(error)
    })
}