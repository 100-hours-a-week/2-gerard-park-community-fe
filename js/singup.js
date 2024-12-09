import * as checkValidate from './check.js'

const signupForm = document.getElementById('signupform');
const profileUpload = document.getElementById('profile');
const profilePreview = document.getElementById('profilePreview');

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

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let countValidateError = 0;
    const email = document.getElementById('userid').value;
    const password = document.getElementById('userpw').value;
    const pwcf = document.getElementById('userpwcf').value;
    const username = document.getElementById('username').value;
    const profileInput = document.getElementById('inputImg');

    if (email == '') {
        document.getElementById('idhelp').innerHTML = '*이메일을 입력해주세요.';
        countValidateError++;
    } else if (!checkValidate.isEmail(email)) {
        document.getElementById('idhelp').innerHTML = '*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)';
        countValidateError++;
    } else {
        document.getElementById('idhelp').innerHTML = '';
    }

    if (username == '') {
        document.getElementById('namehelp').innerHTML = '*닉네임을 입력해주세요.'
        countValidateError++;
    } else if (!checkValidate.checkLength(username, 10)) {
        document.getElementById('namehelp').innerHTML = '*닉네임은 최대 10자까지 작성 가능합니다.'
        countValidateError++;
    } else if (!checkValidate.isNickname(username)) {
        document.getElementById('namehelp').innerHTML = '*띄어쓰기를 없애주세요.'
        countValidateError++;
    } else {
        document.getElementById('namehelp').innerHTML = ''
    }

    if (password == '') {
        document.getElementById('pwhelp').innerHTML = '*비밀번호를 입력해주세요.';
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';s
        } else if (!checkValidate.isMatch(password, pwcf)) {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
        countValidateError++;
    } else if (!checkValidate.isPassword(password)) {
        document.getElementById('pwhelp').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자,소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
        } else if (!checkValidate.isMatch(password, pwcf)) {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
        countValidateError++;
    } else {
        document.getElementById('pwhelp').innerHTML = '';
        if (pwcf == '') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
            countValidateError++;
        } else if (!checkValidate.isMatch(password, pwcf)) {
            document.getElementById('pwhelp').innerHTML = '*비밀번호가 다릅니다.';
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
            countValidateError++;
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
    }

    if (countValidateError != 0) {
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

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('회원가입 성공:', data);
        window.location.href = '/login';
    } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입에 실패했습니다.');
    }
});
//뒤로가기
document.querySelector('#backBtn').addEventListener('click', () => {
    window.history.back();
});