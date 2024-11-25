import './dropdown.js';

// URL에서 게시글 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

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
        document.querySelector('#postUserName').textContent = post.username;
        document.querySelector('#postDate').textContent = new Date(post.createdAt).toLocaleString();
        document.querySelector('.pre').textContent = post.content;
        
        if (post.image) {
            document.querySelector('#postImg').src = post.image;
        }
        
        // 좋아요, 조회수, 댓글수 업데이트
        document.querySelectorAll('#likeC').textContent = post.likes;
        document.querySelectorAll('#viewC').textContent = post.views;
        document.querySelectorAll('#replyC').textContent = post.comments;
        
        // 작성자일 경우에만 수정/삭제 버튼 표시
        if (post.userId === sessionStorage.getItem('sessionId')) {
            const buttons = document.querySelector('.row_c:nth-child(3)');
            buttons.style.display = 'flex';
        }
        
        // 댓글 불러오기
        loadComments();
        
    } catch (error) {
        console.error('Error loading post:', error);
    }
}

// 댓글 목록 불러오기
async function loadComments() {
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
            throw new Error('Failed to fetch comments');
        }
        
        const comments = await response.json();
        const commentsContainer = document.querySelector('#replyContainer');
        commentsContainer.innerHTML = ''; // 기존 댓글 비우기
        
        comments.forEach(comment => {
            const commentElement = `
                <div class="row">
                    <div class="rel" style="flex: 3;">
                        <div class="row">
                            <div class="row_c" style="justify-content: flex-start;flex: 1;">
                                <img src="../lib/defaultProfilePic.jpg" class="imgProfile">
                                <div style="margin-left: 10px;font-weight: 500;font-size: large;">
                                    ${comment.username}
                                </div>
                            </div>
                            <div class="row_c" style="justify-content: flex-start;flex: 2;">
                                ${new Date(comment.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <div style="margin: 10px;">
                            ${comment.content}
                        </div>
                    </div>
                    ${comment.userId === sessionStorage.getItem('sessionId') ? `
                        <div class="row_c" style="flex: 1;">
                            <button onclick="editComment(${comment.id})">수정</button>
                            <button onclick="deleteComment(${comment.id})">삭제</button>
                        </div>
                    ` : ''}
                </div>
            `;
            commentsContainer.innerHTML += commentElement;
        });
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}
//뒤로가기
document.querySelector('#backBtn').addEventListener('click', () => {
    window.history.back();
});

// 댓글 등록
document.querySelector('.buttons').addEventListener('click', async () => {
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
            throw new Error('Failed to create comment');
        }
        
        // 댓글 등록 후 목록 새로고침
        document.querySelector('textarea').value = '';
        loadComments();
    } catch (error) {
        console.error('Error creating comment:', error);
    }
});

// 페이지 로드 시 게시글 불러오기
document.addEventListener('DOMContentLoaded', loadPost);

// 게시글 수정/삭제 함수
function editPost() {
    window.location.href = `/page/editpost.html?id=${postId}`;
}

async function deletePost() {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }
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
            window.location.href = '/page/board.html';
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// 댓글 수정/삭제 함수
async function editComment(commentId) {
    const newContent = prompt('수정할 내용을 입력하세요.');
    if (!newContent) return;

    const sessionId = sessionStorage.getItem('sessionId');
    try {
        const response = await fetch(`http://localhost:3000/board/reply/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': sessionId,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newContent }),
            credentials: 'include'
        });
        
        if (response.ok) {
            loadComments();
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
}

async function deleteComment(commentId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    const sessionId = sessionStorage.getItem('sessionId');
    try {
        const response = await fetch(`http://localhost:3000/board/reply/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Authorization': sessionId,
            }
        });
        
        if (response.ok) {
            loadComments();
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
}