const menuToggleContainer = document.querySelector('.menu-toggle-container');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

const fullName = document.getElementById('full-name');
const email = document.getElementById('email');

const phone = document.getElementById('phone');
const qualification = document.getElementById('qualification');
const bio = document.getElementById('bio');

const region = document.getElementById('region');
const town = document.getElementById('town');
const street = document.getElementById('street');

const profileName = document.getElementById('profile-name');

const profileButton = document.getElementById('upload-button');

const editProfileBtn = document.querySelector('.edit-profile-btn');
const editAddressBtn = document.querySelector('.edit-address-btn');

editProfileBtn.addEventListener('click', () => {
    window.location.href = 'edit-profile.html'
})
editAddressBtn.addEventListener('click', () => {
    window.location.href = 'address.html'
})

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

    fetch('http://127.0.0.1:8000/auth/users/me/', {
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
        fullName.textContent = `${data.first_name} ${data.last_name}`;
        email.textContent = data.email;

        profileName.textContent = `${data.first_name} ${data.last_name}`
    })
    .catch(error => {
        console.log(error)
    })
}

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

        getAddress(data.id);

        gender.textContent = data.gender;
        phone.textContent = data.phone;
        qualification.textContent = data.highest_qualification;

        if(data.profile_picture === null){
            profileImage.src = "./images/logo.png";
        }
        else{
            profileImage.src = data.profile_picture;
        }
        
        if(data.bio === ''){
            bio.textContent = 'No bio';
        }
        else{
            bio.textContent = data.bio;
        }
    })
    .catch(error => {
        console.log(error)
    })
}

function getAddress(id){
    fetch(`http://127.0.0.1:8000/manage_tutorlinc/addresses/?teacher__id=${id}`, {
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
        data.forEach(items => {
            region.textContent = items.region;
            town.textContent = items.town;
            street.textContent = items.street;
        })
    })
    .catch(error => {
        console.log(error)
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

profilePictureInput.addEventListener('change', () => {
    const profileImageFile = profilePictureInput.files[0];

    if (profileImageFile) {
        imagePreview.src = URL.createObjectURL(profileImageFile); // Preview
        imagePreviewModal.style.display = 'flex';
    }
});

saveButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const file = profilePictureInput.files[0];

    if (!file) {
        alert('Please select an image before saving.');
        return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        alert('Invalid file type. Please upload an image (JPG, PNG, GIF, or WEBP).');
        profilePictureInput.value = '';
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    try {
        // === Upload to Cloudinary ===
        const uploadedUrl = await uploadToCloudinary(file);

        // === Send PATCH request with Cloudinary URL ===
        const payload = {
            profile_picture: uploadedUrl
        };

        const response = await fetch('http://127.0.0.1:8000/manage_tutorlinc/teachers/me/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to update profile picture.');
        }

        profileImage.src = uploadedUrl; // Update the image shown
        imagePreviewModal.style.display = 'none';
        profilePictureInput.value = '';

    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'An error occurred while updating the profile picture.');
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = 'Save';
    }
});

// Cloudinary Upload Function (reused)
async function uploadToCloudinary(file) {
    const cloudName = "dnytooumu";
    const uploadPreset = "TutorLinc_profile_images_preset";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "profile_images");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!data.secure_url) {
        throw new Error("Cloudinary upload failed");
    }

    return data.secure_url;
}


cancelButton.addEventListener('click', async (event) => {
    event.preventDefault();

    imagePreviewModal.style.display = 'none';

});