import * as checkValidate from './check.js'
import './dropdown.js';
const makepostForm = document.getElementById('makepostform');

const sessionId = sessionStorage.getItem('sessionId');

if (!sessionId) {
  alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
  window.location.href = '/page/login.html';
}

makepostForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let countValidateError = 0;
  let bodyData = new FormData();
  const title = document.getElementById('posttitle').value;
  const content = document.getElementById('postcontent').value;
  const img = document.getElementById('postimg').files[0];

  if (title == '') {
    countValidateError++;
  }

  if (content == '') {
    countValidateError++;
  }

  if (countValidateError != 0) {
    document.getElementById('makeposthelp').innerHTML = '*제목, 내용을 모두 작성해주세요.';
    return false;
  } else {
    document.getElementById('makeposthelp').innerHTML = '';
    bodyData.append('title', title);
    bodyData.append('content', content);
    if (img) {
      bodyData.append('img', img);
    }
  }

  /* fetch('http://127.0.0.1:5500/page/makepost.html') //로컬 테스트용 코드
    .then((response) => {
      // 응답을 JSON으로 변환
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: bodyData,
      };
    })
    .then((data) => {
      // 데이터 처리
      console.log(data);
      console.log(Object.fromEntries(data.body).img);
    })
    .catch((error) => {
      // 에러 처리
      console.error(
        'There was a problem with your fetch operation:',
        error
      );
    }); */

  try {
    const response = await fetch('http://localhost:3000/board/makepost', {
      method: 'POST',
      headers: {
        'Authorization': sessionId,
        //'Content-Type': 'multipart/form-data'
      },
      body: bodyData,
      credentials: 'include' // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    alert('게시글이 작성되었습니다.');
    window.location.href = `/page/viewpost.html?id=${data.id}`;
  } catch (error) {
    console.error('Error:', error);
    alert('게시글 작성에 실패했습니다.');
  }
});