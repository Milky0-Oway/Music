const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const loginButton = document.getElementById("login-btn");
const login = document.getElementById("login");
const password = document.getElementById("password");
const registerButton = document.getElementById("register-btn");
const passwordFirst = document.getElementById("password-first");
const passwordSecond = document.getElementById("password-second");
const userName = document.getElementById("username");
const email = document.getElementById("email");
const errorContainer = document.getElementById("password-error");

registerLink.addEventListener('click', ()=>{
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=>{
    wrapper.classList.remove('active');
});

loginButton.addEventListener('click', () => {
    const loginValue = login.value;
    const passwordValue = password.value;
    const formData = new FormData();
    formData.append('login', loginValue);
    formData.append('password', passwordValue);

    const loginUrl = `http://localhost:5285/Home/Login?${new URLSearchParams(formData).toString()}`;

    fetch(loginUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                errorContainer.textContent = "Вход выполнен успешно";
            } else {
                throw new Error('Ошибка при входе');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            errorContainer.textContent = "Произошла ошибка";
        });
});

registerButton.addEventListener('click', () => {
    const passwordFirstValue = passwordFirst.value;
    const passwordSecondValue = passwordSecond.value;
    const userNameValue = userName.value;
    const emailValue = email.value;

    if(passwordFirstValue === "" || userNameValue === "" || emailValue === ""){
        errorContainer.textContent = "Заполните все поля";
    }
    else if (passwordFirstValue === passwordSecondValue) {
        const formData = new FormData();
        formData.append('login', userNameValue);
        formData.append('email', emailValue);
        formData.append('password', passwordFirstValue);
        fetch('http://localhost:5285/Home/Register', {
            method: 'PUT',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    errorContainer.textContent = "Регистрация прошла успешно";
                } else {
                    errorContainer.textContent = "Ошибка при регистрации";
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                errorContainer.textContent = "Произошла ошибка";
            });
    }
    else {
        errorContainer.textContent = "Пароли не совпадают";
    }
});