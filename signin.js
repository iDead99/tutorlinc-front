const submitBtn = document.querySelector('.btn');
const email = document.getElementById('email');
const password = document.getElementById('password');

const spinner = document.querySelector('.spinner');

const userPassError = document.getElementById('user-pass-error');

email.addEventListener('input', ()=> {
    userPassError.textContent='';
})
password.addEventListener('input', ()=> {
    userPassError.textContent='';
})

document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault()
    login()
    spinner.style.display='block';
    submitBtn.disabled=true;
    if(submitBtn.disabled===true){
        submitBtn.style.opacity='50%';
    }
})

function login(){
    fetch('http://127.0.0.1:8000/auth/jwt/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(error => {
                userPassError.textContent=error.detail;
                spinner.style.display='none';
                submitBtn.disabled=false;
                if(submitBtn.disabled===false){
                    submitBtn.style.opacity='100%';
                }
            })
        }
        else{
            spinner.style.display='none';
            submitBtn.disabled=false;
            if(submitBtn.disabled===false){
                submitBtn.style.opacity='100%';
            }
            window.location.href="master-dashboard.html";
        }
        return response.json()
    })
    .then(data => {
        localStorage.setItem('accessToken', data.access)
    })
    .catch(error => {
        return error;
    })
}