import * as checkValidate from './check.js'

const signupForm = document.getElementById('signupform');
const profileUpload = document.getElementById('profile');
const profilePreview = document.getElementById('profilePreview');
const emailInput = document.getElementById('userid');
const passwordInput = document.getElementById('userpw');
const pwcfInput = document.getElementById('userpwcf');
const usernameInput = document.getElementById('username');
const signupBtn = document.querySelector('.buttonValidate');

let emailValidate = false;
let passwordValidate = false;
let pwcfValidate = false;
let usernameValidate = false;

// 이미지 프리뷰 기능
profileUpload.addEventListener('click', () => {
    const input = document.getElementById('inputImg');
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
                profilePreview.style.display = 'block';
                profileUpload.querySelector('span').style.display = 'none';  // '+' 기호 숨김
            };
            reader.readAsDataURL(file);
        }
    };

    input.click();
});

emailInput.onkeyup = function () {
    let email = emailInput.value;
    if (email == '') {
        document.getElementById('idhelp').innerHTML = '*이메일을 입력해주세요.';
        emailValidate = false;
    } else if (!checkValidate.isEmail(email)) {
        document.getElementById('idhelp').innerHTML = '*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)';
        emailValidate = false;
    } else {
        document.getElementById('idhelp').innerHTML = '';
        emailValidate = true;
    }

    if (emailValidate && passwordValidate && pwcfValidate && usernameValidate) {
        signupBtn.classList.replace('buttonValidate', 'buttonValidateOn');
    } else {
        signupBtn.classList.replace('buttonValidateOn', 'buttonValidate');
    }
}

usernameInput.onkeyup = function () {
    let username = usernameInput.value;
    if (username == '') {
        document.getElementById('namehelp').innerHTML = '*닉네임을 입력해주세요.'
        usernameValidate = false;
    } else if (!checkValidate.checkLength(username, 10)) {
        document.getElementById('namehelp').innerHTML = '*닉네임은 최대 10자까지 작성 가능합니다.'
        usernameValidate = false;
    } else if (!checkValidate.isNickname(username)) {
        document.getElementById('namehelp').innerHTML = '*띄어쓰기를 없애주세요.'
        usernameValidate = false;
    } else {
        document.getElementById('namehelp').innerHTML = ''
        usernameValidate = true;
    }

    if (emailValidate && passwordValidate && pwcfValidate && usernameValidate) {
        signupBtn.classList.replace('buttonValidate', 'buttonValidateOn');
    } else {
        signupBtn.classList.replace('buttonValidateOn', 'buttonValidate');
    }
}

passwordInput.onkeyup = function () {
    let password = passwordInput.value;
    let pwcf = pwcfInput.value;
    if (password == '') {
        document.getElementById('pwhelp').innerHTML = '*비밀번호를 입력해주세요.';
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
        } else if (!checkValidate.isMatch(password, pwcf)) {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
        passwordValidate = false;
    } else if (!checkValidate.isPassword(password)) {
        document.getElementById('pwhelp').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자,소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
        } else if (!checkValidate.isMatch(password, pwcf)) {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
        passwordValidate = false;
    } else {
        document.getElementById('pwhelp').innerHTML = '';
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
        } else if (!checkValidate.isMatch(password, pwcf)) {
            document.getElementById('pwhelp').innerHTML = '*비밀번호가 다릅니다.';
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
        passwordValidate = true;
    }

    if (emailValidate && passwordValidate && pwcfValidate && usernameValidate) {
        signupBtn.classList.replace('buttonValidate', 'buttonValidateOn');
    } else {
        signupBtn.classList.replace('buttonValidateOn', 'buttonValidate');
    }
}

pwcfInput.onkeyup = function () {
    let password = passwordInput.value;
    let pwcf = pwcfInput.value;

    if (password == '') {
        document.getElementById('pwhelp').innerHTML = '*비밀번호를 입력해주세요.';
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
        } else if (!checkValidate.isMatch(password, pwcf)) {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
        pwcfValidate = false;
    } else if (!checkValidate.isPassword(password)) {
        document.getElementById('pwhelp').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자,소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
        } else if (!checkValidate.isMatch(password, pwcf)) {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
        pwcfValidate = false;
    } else {
        document.getElementById('pwhelp').innerHTML = '';
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
            pwcfValidate = false;
        } else if (!checkValidate.isMatch(password, pwcf)) {
            document.getElementById('pwhelp').innerHTML = '*비밀번호가 다릅니다.';
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
            pwcfValidate = false;
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
            pwcfValidate = true;
        }
    }

    if (emailValidate && passwordValidate && pwcfValidate && usernameValidate) {
        signupBtn.classList.replace('buttonValidate', 'buttonValidateOn');
    } else {
        signupBtn.classList.replace('buttonValidateOn', 'buttonValidate');
    }
}

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;
    const pwcf = pwcfInput.value;
    const profileInput = document.getElementById('inputImg');

    if (emailValidate && usernameValidate && passwordValidate && pwcfValidate) {
        console.log('유효성 통과!');
    } else {
        if (email == '') {
            document.getElementById('idhelp').innerHTML = '*이메일을 입력해주세요.'
        }
        if (password == '') {
            document.getElementById('pwhelp').innerHTML = '*비밀번호를 입력해주세요.'
        }
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
        }
        if (username == '') {
            document.getElementById('namehelp').innerHTML = '*닉네임을 입력해주세요.'
        }
        return false;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);
    if (profileInput && profileInput.files[0]) {
        formData.append('profileImage', profileInput.files[0]);
    }

    try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        console.log('회원가입 성공:', data);
        window.location.href = '/login';
    } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입에 실패했습니다.\n'+error);
    }
});
//뒤로가기
document.querySelector('#backBtn').addEventListener('click', () => {
    window.history.back();
});