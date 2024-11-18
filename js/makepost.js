import * as checkValidate from './check.js'
import'./dropdown.js';
const makepostForm = document.getElementById('makepostform');

makepostForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let countValidateError = 0;
  let bodyData = new FormData();
  const title = document.getElementById('posttitle').value;
  const content = document.getElementById('postcontent').value;
  const img = document.getElementById('postimg').files[0];
  const submitButton = document.querySelector('makepostbtn');

  if (title == '') {
    countValidateError++;
  }
  
  if (content == '') {
    countValidateError++;
  }
  
  if(countValidateError!=0) {
    document.getElementById('makeposthelp').innerHTML = '*제목, 내용을 모두 작성해주세요.';
    return false;
  } else {
    document.getElementById('makeposthelp').innerHTML = '';
    bodyData.append('title', title);
    bodyData.append('content', content);
    bodyData.append('img', img);
  }
  
  fetch('http://127.0.0.1:5500/page/makepost.html')
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
      body: bodyData,
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
});