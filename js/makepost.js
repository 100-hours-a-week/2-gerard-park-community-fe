import { fetchUserProfile, API_URL } from './dropdown.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
});
const makepostForm = document.getElementById('makepostform');

const sessionId = sessionStorage.getItem('sessionId');

if (!sessionId) {
    alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
    window.location.href = '/login';
}

makepostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let countValidateError = 0;
    let bodyData = new FormData();
    const title = document.getElementById('posttitle').value;
    const content = document.getElementById('postcontent').value;
    const image = document.getElementById('postimg').files[0];

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
        if (image) {
            bodyData.append('image', image);
        }
    }

    try {
        const response = await fetch(`${API_URL}/board/makepost`, {
            method: 'POST',
            headers: {
                'Authorization': sessionId,
                //'Content-Type': 'multipart/form-data'
            },
            body: bodyData,
            credentials: 'include' // 쿠키 포함
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        alert('게시글이 작성되었습니다.');
        window.location.href = `/post?id=${data.id}`;
    } catch (error) {
        console.error('Error:', error);
        alert('게시글 작성에 실패했습니다.');
    }
});
//뒤로가기
document.querySelector('#backBtn').addEventListener('click', () => {
    window.location.href = '/board';
});