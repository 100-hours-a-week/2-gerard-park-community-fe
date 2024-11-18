import * as checkValidate from './check.js'

const loginForm = document.getElementById('loginform');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let countValidateError = 0;
  const email = document.getElementById('userid').value;
  const password = document.getElementById('userpw').value;

  if (!checkValidate.isEmail(email)) {
    document.getElementById('idhelp').innerHTML = "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";
    //return false;
    countValidateError++;   
  } else {
    document.getElementById('idhelp').innerHTML = '';
  }
  
  if (!checkValidate.isPassword(password)) {
    document.getElementById('pwhelp').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자,소문자, 숫자, 트수문자를 각각 최소 1개 포함해야 합니다.';
    //return false;
    countValidateError++;
  } else {
    document.getElementById('pwhelp').innerHTML = '';
  }
  
  if(countValidateError!=0) {
    return false;
  }
  
  fetch('http://127.0.0.1:5500/page/login.html')
  .then((response) => {
    // 응답을 JSON으로 변환
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {
        email,
        password
      })
    };
  })
  .then((data) => {
    // 데이터 처리
    console.log(data);
  })
  .catch((error) => {
    // 에러 처리
    console.error(
      'There was a problem with your fetch operation:',
      error
    );
  });
  
  /*
  try {
    const response = fetch('http://127.0.0.1:5500/page/login.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });
  
    const data = response.json();

    if (response.ok) {
      console.log('로그인 성공:', data);
      // 로그인 성공 후 처리 (예: 토큰 저장, 메인 페이지로 리다이렉트)
      //localStorage.setItem('token', data.token);
      //window.location.href = '/board';
    } else {
      console.error('로그인 실패:', data.message);
      // 에러 메시지 표시
    }
  } catch (error) {
      console.error('에러:', error);
  }
   */   
});