import './dropdown.js';

async function loadPosts() {
    try {
        // 세션 확인
        const sessionId = sessionStorage.getItem('sessionId');
        /*
        if (!sessionData) {
            window.location.href = '/page/login.html';
            return;
        } */

        const response = await fetch('http://localhost:3000/board/posts', {
            method: 'GET',
            headers: {
                'Authorization': sessionId
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        
        const posts = await response.json();
        const boardList = document.getElementById('boardList');
        boardList.innerHTML = ''; // Clear existing content
        
        posts.forEach(post => {
            const postElement = `
                <div class="post">
                    <div class="row_c" style="justify-content: flex-start;">
                        <img src="${post.profileImage || '../lib/defaultProfilePic.jpg'}" class="imgProfile" alt="profile">
                        <div style="margin-left: 10px;font-weight: 500;font-size: large;">
                            ${post.username}
                        </div>
                    </div>
                    
                    <div class="rel">
                        <div>
                            <h3><a href="/page/viewpost.html?id=${post.id}">${post.title}</a></h3>
                        </div>
                        
                        <div class="row">
                            <div class="row_c" style="width: 30%;">
                                <div class="row_c">
                                    <button class="like-btn" data-post-id="${post.id}">
                                        ${post.isLiked ? '❤️' : '🤍'} ${post.likes || 0}
                                    </button>
                                </div>
                                <div class="row_c">댓글 ${post.comments || 0}</div>
                                <div class="row_c">조회수 ${post.views || 0}</div>
                            </div>
                            
                            <div class="row_c" style="width: 30%;">
                                ${new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
            `;
            boardList.innerHTML += postElement;
        });

        // 좋아요 버튼 이벤트 리스너 추가
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', handleLike);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// 좋아요 처리 함수
async function handleLike(e) {
    try {
        const postId = e.target.dataset.postId;
        const sessionId = sessionStorage.getItem('sessionId');
        
        const response = await fetch(`http://localhost:3000/board/post/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': sessionId
            },
            credentials: 'include'
        });

        if (response.ok) {
            // 좋아요 상태 업데이트를 위해 게시글 목록 새로고침
            loadPosts();
        }
    } catch (error) {
        console.error('Error handling like:', error);
    }
}

// 게시글 작성 버튼 이벤트 리스너
document.querySelector('#makePost').addEventListener('click', () => {
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        alert('로그인이 필요합니다.');
        window.location.href = '/page/login.html';
        return;
    }
    window.location.href = '/page/makepost.html';
});

// 페이지 로드 시 게시글 목록 불러오기
document.addEventListener('DOMContentLoaded', loadPosts);