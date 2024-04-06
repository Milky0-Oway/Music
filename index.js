const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
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

registerButton.addEventListener('click', () => {
    const passwordFirstValue = passwordFirst.value;
    const passwordSecondValue = passwordSecond.value;
    const userNameValue = userName.value;
    const emailValue = email.value;

    if(passwordFirstValue === "" || userNameValue === "" || emailValue === ""){
        errorContainer.textContent = "Заполните все поля";
    }
    else if (passwordFirstValue === passwordSecondValue) {
        errorContainer.textContent = "Регистрация прошла успешно";
    }
    else {
        errorContainer.textContent = "Пароли не совпадают";
    }
});