const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');

const phone = document.getElementById('phone');
const qualification = document.getElementById('qualification');
const bio = document.getElementById('bio');
// const profilePicture = document.getElementById('profile-picture');

// const profileImage = document.querySelector('.profile-image');
const profileName = document.getElementById('profile-name');

// const profilePictureInput = document.getElementById('profile-image-input');
const profileButton = document.getElementById('upload-button');

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
    getUser();
    getTeacher();
})

function getUser(){

    fetch('https://tutorlinc-ws.onrender.com/auth/users/me/', {
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
        firstName.value = data.first_name;
        lastName.value = data.last_name;
        email.value = data.email;

        profileName.textContent = `${firstName.value} ${lastName.value}`
    })
    .catch(error => {
        alert(error)
    })
}

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
        phone.value = data.phone;
        qualification.value = data.highest_qualification;

        if(data.profile_picture === null){
            profileImage.src = "./images/logo.png";
        }
        else{
            profileImage.src = data.profile_picture;
        }
        
        if(data.bio === ''){
            bio.value = 'No bio';
        }
        else{
            bio.value = data.bio;
        }
    })
    .catch(error => {
        // alert(error)
    })
}

// Select DOM elements
const profilePictureInput = document.getElementById('profile-image-input');
const uploadButton = document.getElementById('upload-button');
const profileImage = document.querySelector('.profile-image');
const imagePreviewModal = document.getElementById('image-preview-modal');
const imagePreview = document.getElementById('image-preview');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');

// Open file input when "Edit" button is clicked
uploadButton.addEventListener('click', () => {
    profilePictureInput.click();
});

// Show preview when file is selected
profilePictureInput.addEventListener('change', () => {
    const file = profilePictureInput.files[0];

    if (file) {
        // Show the modal with the image preview
        imagePreview.src = URL.createObjectURL(file); // Display the image preview
        imagePreviewModal.style.display = 'flex';
    }
});

// Save the picture when "Save" is clicked
saveButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const file = profilePictureInput.files[0];

    if (!file) {
        alert('Please select an image before saving.');
        return;
    }

    // Validate file type (only images allowed)
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        alert('Invalid file type. Please upload an image (JPG, PNG, GIF, or WEBP).');
        profilePictureInput.value = ''; // Clear invalid input
        return;
    }

    saveButton.disabled = true; // Prevent multiple clicks
    saveButton.textContent = 'Saving...';

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
        const response = await fetch('https://tutorlinc-ws.onrender.com/manage_tutorlinc/teachers/me/', {
            method: 'PATCH',
            headers: {
                'Authorization': `JWT ${accessToken}`
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to update profile picture.');
        }

        // Update the profile image only after a successful response
        profileImage.src = URL.createObjectURL(file);
        imagePreviewModal.style.display = 'none'; // Hide the modal
        profilePictureInput.value = ''; // Clear input after successful upload

    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'An error occurred while updating the profile picture.');
    } finally {
        saveButton.disabled = false; // Re-enable button
        saveButton.textContent = 'Save'; // Reset button text
    }
});

// Close the modal without saving when "Cancel" is clicked
cancelButton.addEventListener('click', () => {
    imagePreviewModal.style.display = 'none';
    profilePictureInput.value = ''; // Clear the file input
});

