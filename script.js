const container = document.querySelector('.container');
const regiserBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

regiserBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

const loginSubmitBtn = document.querySelector('.login-submit');

loginSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault(); // prevent form from reloading the page

    // Optional: Validate username/password here

    // Redirect to main page
    window.location.href = "index.html";
});

