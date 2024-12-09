import { fetchUserProfile } from './dropdown.js';

async function loadPosts() {
    try {
        /* // 세션 확인
        const sessionId = sessionStorage.getItem('sessionId');
        
        if (!sessionId) {
            alert('잘못된 접근입니다!');
            window.location.href = '/login';
            return;
        } */

        const response = await fetch('http://localhost:3000/board/posts', {
            method: 'GET',
            headers: {
                //'Authorization': sessionId
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
                <article class="bgwhite" data-post-id="${post.id}">                    
                    <div class="rel">
                        <div>
                            <h3>${post.title}</a></h3>
                        </div>
                        <div class="row">
                            <div class="row_c" style="width: 40%;">
                                <div class="row_c">
                                    <p>좋아요</p>
                                    <p>${post.likes || 0}</p>
                                </div>
                                <div class="row_c">
                                    <p>댓글</p>
                                    <p>${post.replies || 0}</p>
                                </div>
                                <div class="row_c">
                                    <p>조회수</p>
                                    <p>${post.views || 0}</p>
                                </div>
                            </div>
                            <div class="row_c" style="width: 30%;">
                                ${new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <hr style="border:1px solid#dbdbdb; height: 1px !important; display: block !important; width: 100% !important;"/>
                    <div class="row_c" style="justify-content: flex-start;">
                        <img src="${post.profileImage || '../lib/defaultProfilePic.jpg'}" class="imgProfile" alt="profile">
                        <div style="margin-left: 10px;font-weight: 500;font-size: large;">
                            ${post.username}
                        </div>
                    </div>
                </article>
            `;
            //boardList.innerHTML += postElement;
            boardList.innerHTML = postElement + boardList.innerHTML;
        });

        // 각 게시글에 이벤트 리스너 추가
        document.querySelectorAll('.bgwhite').forEach(post => {
            post.addEventListener('click', viewSelectedPost);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}
// 클릭한 게시글로 이동 함수
async function viewSelectedPost(e) {
    const selectedPostId = e.currentTarget.dataset.postId;
    window.location.href = `/post?id=${selectedPostId}`;
}

// 게시글 작성 버튼 이벤트 리스너
document.querySelector('#makePost').addEventListener('click', () => {
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
        return;
    }
    window.location.href = '/makepost';
});

// 페이지 로드 시 게시글 목록 불러오기
document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
    loadPosts();
});