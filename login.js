
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    const loginForm = document.querySelector('.form-box.login form');
    const registerForm = document.querySelector('.form-box.register form');
    
    
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    

    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });
    
    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });
    

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
    
        const username = registerForm.querySelector('.input-box:nth-child(2) input').value;
        const email = registerForm.querySelector('.input-box:nth-child(3) input').value;
        const password = registerForm.querySelector('.input-box:nth-child(4) input').value;
        
    
        const users = JSON.parse(localStorage.getItem('users'));
        
      
        if (users.some(user => user.username === username)) {
            alert("Username already exists!");
            return;
        }
        
       
        users.push({
            username,
            email,
            password 
        });
        
       
        localStorage.setItem('users', JSON.stringify(users));
        
        alert("Registration successful! You can now login.");
        
        registerForm.reset();
        container.classList.remove('active');
    });
    
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
    
        const username = loginForm.querySelector('.input-box:nth-child(2) input').value;
        const password = loginForm.querySelector('.input-box:nth-child(3) input').value;
        
       
        const users = JSON.parse(localStorage.getItem('users'));
        
        
        const user = users.find(user => user.username === username && user.password === password);
        
        if (user) {
           
            sessionStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                email: user.email
            }));
            
            alert("Login successful!");
            
            window.location.href = "index.html";
        } else {
            alert("Invalid username or password!");
        }
    });
});
