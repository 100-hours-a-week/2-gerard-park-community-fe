import * as checkValidate from './check.js';

const loginForm = document.getElementById('loginform');
const emailInput = document.getElementById('userid');
const passwordInput = document.getElementById('userpw');
const loginBtn = document.querySelector('.buttonValidate');
const API_URL = 'http://localhost:3000';
let emailValidate = false;
let passwordValidate = false;


emailInput.onkeyup = function () {
    let email = emailInput.value;
    if (!checkValidate.isEmail(email)) {
        document.getElementById('idhelp').innerHTML = '*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)'
        emailValidate = false;
    } else {
        document.getElementById('idhelp').innerHTML = ''
        emailValidate = true;
    }

    if (emailValidate && passwordValidate) {
        loginBtn.classList.replace('buttonValidate', 'buttonValidateOn');
    } else {
        loginBtn.classList.replace('buttonValidateOn', 'buttonValidate');
    }
};

passwordInput.onkeyup = function () {
    let password = passwordInput.value;
    if (!checkValidate.isPassword(password)) {
        document.getElementById('pwhelp').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자,소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'
        passwordValidate = false;
    } else {
        document.getElementById('pwhelp').innerHTML = ''
        passwordValidate = true;
    }

    if (emailValidate && passwordValidate) {
        loginBtn.classList.replace('buttonValidate', 'buttonValidateOn');
    } else {
        loginBtn.classList.replace('buttonValidateOn', 'buttonValidate');
    }
};



loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let email = emailInput.value;
    let password = passwordInput.value;
    if (!(emailValidate && passwordValidate)) {
        if (email == '') {
            document.getElementById('idhelp').innerHTML = '*이메일을 입력해주세요.'
        }
        if (password == '') {
            document.getElementById('pwhelp').innerHTML = '*비밀번호를 입력해주세요.'
        }
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include', // 쿠키 포함
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        console.log('로그인 성공:', data);
        //document.cookie = `sessionId=${data.sessionId}; path=/;`;
        // 세션 ID를 세션 스토리지에 저장
        const test = JSON.stringify(data);
        sessionStorage.setItem('sessionId', test);
        alert('로그인');
        //로그인 성공 후 처리 (예: 메인 페이지로 리다이렉트)
        window.location.href = '/board';
    } catch (error) {
        console.error('에러:', error);
        alert('로그인에 실패했습니다.\n'+error);
    }
});