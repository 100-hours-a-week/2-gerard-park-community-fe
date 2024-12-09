import { fetchUserProfile } from './dropdown.js';
// URL에서 게시글 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// 페이지 로드 시 게시글 불러오기
document.addEventListener('DOMContentLoaded', () => {
    const editPostBtn = document.getElementById('editPostBtn');
    const deletePostBtn = document.getElementById('deletePostBtn');
    const deletePostModal = document.getElementById('deletePostModal');
    const confirmDeletePost = document.getElementById('confirmDeletePost');
    const cancelDeletePost = document.getElementById('cancelDeletePost');

    fetchUserProfile();
    loadPost();

    // 게시글 수정 버튼 클릭
    editPostBtn.addEventListener('click', () => {
        editPost();
    });

    // 게시글 삭제 버튼 클릭
    deletePostBtn.addEventListener('click', () => {
        deletePostModal.style.display = 'block';
    });

    // 게시글 삭제 확인
    confirmDeletePost.addEventListener('click', () => {
        deletePost();
    });

    // 게시글 삭제 취소
    cancelDeletePost.addEventListener('click', () => {
        deletePostModal.style.display = 'none';
    });
});

async function loadPost() {
    const sessionId = sessionStorage.getItem('sessionId');
    try {
        const response = await fetch(`http://localhost:3000/board/post/${postId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': sessionId,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }
        const post = await response.json();
        // 게시글 내용 채우기
        document.querySelector('#postTitle').textContent = post.title;
        if (post.profileImage) {
            document.querySelector('#titleProfileImage').src = post.profileImage
        }
        document.querySelector('#postUserName').textContent = post.username;
        document.querySelector('#postDate').textContent = new Date(post.createdAt).toLocaleString();
        document.querySelector('.pre').textContent = post.content;
        if (post.image) {
            const postImg = document.querySelector('#postImg');
            postImg.src = post.image;
            postImg.style.display = 'block';
        } else {
            document.querySelector('#postImg').style.display = 'none';
        }
        // 좋아요, 조회수, 댓글수 업데이트
        document.querySelector('#likeC').textContent = post.likes;
        document.querySelector('#viewC').textContent = post.views;
        document.querySelector('#replyC').textContent = post.replies;
        // 작성자일 경우에만 수정/삭제 버튼 표시
        if (post.userId !== JSON.parse(sessionId).sessionId) {
            document.getElementById('editPostBtn').style.display = 'none';
            document.getElementById('deletePostBtn').style.display = 'none';
        } else {
            document.getElementById('editPostBtn').style.display = 'block';
            document.getElementById('deletePostBtn').style.display = 'block';
        }
        // 댓글 불러오기
        loadReplies();
    } catch (error) {
        console.error('Error loading post:', error);
    }
}

// 댓글 목록 불러오기
async function loadReplies() {
    const sessionId = sessionStorage.getItem('sessionId');
    try {
        const response = await fetch(`http://localhost:3000/board/post/${postId}/replies`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': sessionId,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch replies');
        }

        const replies = await response.json();
        const repliesContainer = document.querySelector('#replyContainer');
        repliesContainer.innerHTML = ''; // 기존 댓글 비우기

        replies.forEach(reply => {
            const replyElement = `
                <div class="row">
                    <div class="rel" style="flex: 3;">
                        <div class="row">
                            <div class="row_c" style="justify-content: flex-start;flex: 1;">
                                <img src=${reply.profileImage ? reply.profileImage : `"../lib/defaultProfilePic.jpg"`} class="imgProfile">
                                <div style="margin-left: 10px;font-weight: 500;font-size: large;">
                                    ${reply.username}
                                </div>
                            </div>
                            <div class="row_c" style="justify-content: flex-start;flex: 2;">
                                ${new Date(reply.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <div style="margin: 10px;">
                            ${reply.content}
                        </div>
                    </div>
                    ${reply.userId === JSON.parse(sessionId).sessionId ? `
                        <div class="row_c" style="flex: 1;">
                            <button onclick="editReply(${reply.id})" class="edbuttons">수정</button>
                            <button onclick="deleteReply(${reply.id})" class="edbuttons">삭제</button>
                        </div>
                    ` : ''}
                </div>
            `;
            repliesContainer.innerHTML += replyElement;
        });

    } catch (error) {
        console.error('Error loading replies:', error);
    }
}
//뒤로가기
document.querySelector('#backBtn').addEventListener('click', () => {
    window.location.href = '/board';
});

// 댓글 등록
document.querySelector('#replyBtn').addEventListener('click', async () => {
    const content = document.querySelector('textarea').value;
    if (!content.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }
    const sessionId = sessionStorage.getItem('sessionId');
    try {
        const response = await fetch(`http://localhost:3000/board/post/${postId}/reply`, {
            method: 'POST',
            headers: {
                'Authorization': sessionId,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to create reply');
        }

        // 댓글 등록 후 목록 새로고침
        document.querySelector('textarea').value = '';
        loadPost();
    } catch (error) {
        console.error('Error creating reply:', error);
    }
});

// 게시글 수정/삭제 함수
function editPost() {
    window.location.href = `/editpost?id=${postId}`;
}

async function deletePost() {
    const sessionId = sessionStorage.getItem('sessionId');
    try {
        const response = await fetch(`http://localhost:3000/board/post/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Authorization': sessionId,
            }
        });

        if (response.ok) {
            alert('게시글이 삭제되었습니다.');
            window.location.href = '/board';
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// 댓글 수정/삭제 함수
window.editReply = async function (replyId) {
    const newContent = prompt('수정할 내용을 입력하세요.');
    if (!newContent) return;

    const sessionId = sessionStorage.getItem('sessionId');
    try {
        const response = await fetch(`http://localhost:3000/board/reply/${replyId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': sessionId,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newContent }),
            credentials: 'include'
        });

        if (response.ok) {
            loadPost();
        }
    } catch (error) {
        console.error('Error updating reply:', error);
    }
}

window.deleteReply = async function (replyId) {
    const sessionId = sessionStorage.getItem('sessionId');
    const deleteReplyModal = document.getElementById('deleteReplyModal');
    const confirmDeleteReply = document.getElementById('confirmDeleteReply');
    const cancelDeleteReply = document.getElementById('cancelDeleteReply');

    deleteReplyModal.style.display = 'block';

    // 댓글 삭제 확인
    confirmDeleteReply.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:3000/board/reply/${replyId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': sessionId,
                }
            });

            if (response.ok) {
                deleteReplyModal.style.display = 'none';
                loadPost();
            }
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    });

    // 댓글 삭제 취소
    cancelDeleteReply.addEventListener('click', () => {
        deleteReplyModal.style.display = 'none';
    });
}