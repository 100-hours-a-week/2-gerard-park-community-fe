import { fetchUserProfile } from './dropdown.js';

document.addEventListener('DOMContentLoaded', () => {
    const editPostForm = document.getElementById('editPostForm');
    const sessionId = sessionStorage.getItem('sessionId');

    if (!sessionId) {
        alert('로그인이 필요합니다.');
        window.location.href = '/page/login.html';
    }

    fetchUserProfile();
    // 게시글 정보 불러오기
    fetchPostInfo();

    // 게시글 수정 폼 제출
    editPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updatePostInfo();
    });
});

async function fetchPostInfo() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        const sessionId = sessionStorage.getItem('sessionId');

        if (!postId) {
            alert('잘못된 접근입니다.');
            window.location.href = '/page/board.html';
        }

        const response = await fetch(`http://localhost:3000/board/post/${postId}`, {
            method: 'GET',
            headers: {
                'Authorization': sessionId
            },
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('postTitle').value = data.title;
            document.getElementById('postContent').value = data.content;            
            // 이미지가 있는 경우 미리보기 표시
            if (data.image) {
                const imagePreview = document.createElement('img');
                imagePreview.src = data.image;
                imagePreview.style.maxWidth = '200px';
                document.querySelector('#imgP').appendChild(imagePreview);
            }
        } else {
            console.error('게시글 정보를 불러오는데 실패했습니다.');
            alert('게시글 정보를 불러오지 못했습니다.');
            window.location.href = '/page/board.html';
        }
    } catch (error) {
        console.error('에러:', error);
        alert('게시글 정보를 불러오는 중 오류가 발생했습니다.');
        window.location.href = '/page/board.html';
    }
}

async function updatePostInfo() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        const sessionId = sessionStorage.getItem('sessionId');

        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const image = document.getElementById('postImg').files[0];

        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        const response = await fetch(`http://localhost:3000/board/post/${postId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': sessionId
            },
            body: formData,
            credentials: 'include',
        });

        const data = await response.json();        
        if (response.ok) {
            alert('게시글이 성공적으로 수정되었습니다.');
            window.location.href = `/page/viewpost.html?id=${postId}`;
        } else {
            alert('게시글 수정에 실패했습니다: ' + data.message);
        }
    } catch (error) {
        console.error('에러:', error);
        alert('게시글 수정 중 오류가 발생했습니다.');
    }
}

// 이미지 미리보기 처리
document.getElementById('postImg').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewContainer = document.querySelector('.inputBox div');
            previewContainer.innerHTML = ''; // 기존 미리보기 제거
            
            const imagePreview = document.createElement('img');
            imagePreview.src = e.target.result;
            imagePreview.style.maxWidth = '200px';
            previewContainer.appendChild(imagePreview);
        };
        reader.readAsDataURL(file);
    }
});

// 뒤로가기
document.querySelector('#backBtn').addEventListener('click', () => {
    window.history.back();
});