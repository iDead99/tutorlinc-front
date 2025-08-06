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
        // cloudinary
        // else{
        //     profileImage.src = data.profile_picture;
            // Fallback in case the image file is missing
            // profileImage.onerror = function () {
            //     this.onerror = null; // Prevent infinite loop if fallback also fails
            //     this.src = "./images/logo.png";
            // };
        // }
        // local
        else {
            profileImage.src = `http://127.0.0.1:8000/${data.profile_picture}`;

            // Fallback in case the image file is missing
            profileImage.onerror = function () {
                this.onerror = null; // Prevent infinite loop if fallback also fails
                this.src = "./images/logo.png";
            };
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

// local saving and fetching
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

    // Disable button to prevent duplicate clicks
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    try {
        const formData = new FormData();
        formData.append('profile_picture', file);

        const response = await fetch('http://127.0.0.1:8000/manage_tutorlinc/teachers/me/', {
            method: 'PATCH',
            headers: {
                'Authorization': `JWT ${accessToken}`
            },
            body: formData
        });

        if (!response.ok) {
            let errorMessage = 'An unexpected error occurred.';

            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || JSON.stringify(errorData);
            } catch {
                const errorText = await response.text();
                console.error('Server error response (non-JSON):', errorText);
            }

            throw new Error(errorMessage);
        }

        const updatedData = await response.json();

        // Update image preview
        if (updatedData.profile_picture) {
            profileImage.src = `http://127.0.0.1:8000${updatedData.profile_picture}`;
        }

        // Reset form/modal
        imagePreviewModal.style.display = 'none';
        profilePictureInput.value = '';

    } catch (error) {
        console.error('Upload Error:', error);
        alert(error.message || 'An error occurred while updating the profile picture.');
    } finally {
        // Always re-enable button and reset text
        saveButton.disabled = false;
        saveButton.textContent = 'Save';
    }
});

// local upload function
async function updateTeacherProfile(data, file = null) {
    const formData = new FormData();

    // Append data fields
    for (const key in data) {
        formData.append(key, data[key]);
    }

    // Append image file if provided
    if (file) {
        formData.append("profile_picture", file);
    }

    const response = await fetch("http://127.0.0.1:8000/manage_tutorlinc/teachers/me/", {
        method: "PATCH",
        headers: {
            Authorization: `JWT ${accessToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        console.error(error);
        throw new Error("Failed to update profile");
    }

    return await response.json();
}

// Cloudinary Upload Function (reused)
// async function uploadToCloudinary(file) {
//     const cloudName = "dnytooumu";
//     const uploadPreset = "TutorLinc_profile_images_preset";

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", uploadPreset);
//     formData.append("folder", "profile_images");

//     const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
//         method: "POST",
//         body: formData,
//     });

//     const data = await response.json();

//     if (!data.secure_url) {
//         throw new Error("Cloudinary upload failed");
//     }

//     return data.secure_url;
// }


// cloudinary saving and fetching
// saveButton.addEventListener('click', async (event) => {
//     event.preventDefault();

//     const file = profilePictureInput.files[0];

//     if (!file) {
//         alert('Please select an image before saving.');
//         return;
//     }

//     const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//     if (!validImageTypes.includes(file.type)) {
//         alert('Invalid file type. Please upload an image (JPG, PNG, GIF, or WEBP).');
//         profilePictureInput.value = '';
//         return;
//     }

//     saveButton.disabled = true;
//     saveButton.textContent = 'Saving...';

//     try {
//         // === Upload to Cloudinary ===
//         const uploadedUrl = await uploadToCloudinary(file);

//         // === Send PATCH request with Cloudinary URL ===
//         const payload = {
//             profile_picture: uploadedUrl
//         };

//         const response = await fetch('http://127.0.0.1:8000/manage_tutorlinc/teachers/me/', {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `JWT ${accessToken}`
//             },
//             body: JSON.stringify(payload)
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.detail || 'Failed to update profile picture.');
//         }

//         profileImage.src = uploadedUrl; // Update the image shown
//         imagePreviewModal.style.display = 'none';
//         profilePictureInput.value = '';

//     } catch (error) {
//         console.error('Error:', error);
//         alert(error.message || 'An error occurred while updating the profile picture.');
//     } finally {
//         saveButton.disabled = false;
//         saveButton.textContent = 'Save';
//     }
// });


cancelButton.addEventListener('click', async (event) => {
    event.preventDefault();

    imagePreviewModal.style.display = 'none';

});