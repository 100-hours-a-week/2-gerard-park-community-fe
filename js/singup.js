import * as checkValidate from './check.js'

const signupForm = document.getElementById('signupform');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let countValidateError = 0;
    const email = document.getElementById('userid').value;
    const password = document.getElementById('userpw').value;
    const pwcf = document.getElementById('userpwcf').value;
    const username = document.getElementById('username').value;

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
    } else if (!checkValidate.checkLength(username,10)) {
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
        if (pwcf =='') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
        } else if (!checkValidate.isMatch(password,pwcf)) {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
        countValidateError++;
    }else if (!checkValidate.isPassword(password)) {
        document.getElementById('pwhelp').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자,소문자, 숫자, 트수문자를 각각 최소 1개 포함해야 합니다.';
        if (pwcf =='') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
        } else if (!checkValidate.isMatch(password,pwcf)) {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
        countValidateError++
    } else {
        document.getElementById('pwhelp').innerHTML = '';
        if (pwcf =='') {
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
            countValidateError++;
        } else if (!checkValidate.isMatch(password,pwcf)) {
            document.getElementById('pwhelp').innerHTML = '*비밀번호가 다릅니다.';
            document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
            countValidateError++;
        } else {
            document.getElementById('pwcfhelp').innerHTML = '';
        }
    }

    if(countValidateError!=0) {
        return false;
    }
    
    fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username
        })
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('회원가입 성공:', data);
        // 회원가입 성공 후 처리
        // window.location.href = '/login';
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
});
//뒤로가기
document.querySelector('#backBtn').addEventListener('click', () => {
    window.history.back();
});