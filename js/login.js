import * as checkValidate from './check.js';

const loginForm = document.getElementById('loginform');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let countValidateError = 0;
    const email = document.getElementById('userid').value;
    const password = document.getElementById('userpw').value;

    if (!checkValidate.isEmail(email)) {
        document.getElementById('idhelp').innerHTML = '*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)'
        countValidateError++;
    } else {
        document.getElementById('idhelp').innerHTML = ''
    }

    if (!checkValidate.isPassword(password)) {
        document.getElementById('pwhelp').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자,소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'
        countValidateError++;
    } else {
        document.getElementById('pwhelp').innerHTML = ''
    }

    if (countValidateError !== 0) {
        return false;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include', // 쿠키 포함
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('로그인 성공:', data);
        //document.cookie = `sessionId=${data.sessionId}; path=/;`;
        // 세션 ID를 세션 스토리지에 저장
        const test = JSON.stringify(data);
        sessionStorage.setItem('sessionId', test);
        alert('로그인');
        //로그인 성공 후 처리 (예: 메인 페이지로 리다이렉트)
        window.location.href = '/page/board.html';
    } catch (error) {
        console.error('에러:', error);
    }
});