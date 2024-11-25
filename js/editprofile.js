import './dropdown.js';
document.addEventListener('DOMContentLoaded', () => {
    const editProfileForm = document.getElementById('editProfileForm');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');

    // 사용자 정보 불러오기
    fetchUserInfo();

    // 프로필 수정 폼 제출
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateUserInfo();
    });

    // 회원탈퇴 버튼 클릭
    deleteAccountBtn.addEventListener('click', () => {
        deleteModal.style.display = 'block';
    });

    // 회원탈퇴 확인
    confirmDelete.addEventListener('click', () => {
        deleteUser();
    });

    // 회원탈퇴 취소
    cancelDelete.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });
});

/* async function fetchUserInfo() {
    try {
        const response = await fetch('http://localhost:3000/users/user-info', {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('useremail').innerHTML = `${data.email}`;
            document.getElementById('username').value = data.username;
        } else {
            console.error('사용자 정보를 불러오는데 실패했습니다!');
        }
    } catch (error) {
        console.error('에러:', error);
    }
} */

async function fetchUserInfo() {
    const sessionId = sessionStorage.getItem('sessionId');

    if (!sessionId) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        window.location.href = '/page/login.html';
    }

    try {
        const response = await fetch('http://localhost:3000/users/user-info', {
            method: 'GET',
            headers: { 'Authorization': sessionId },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('useremail').innerHTML = data.email;
            document.getElementById('username').value = data.username;
        } else {
            console.error('사용자 정보를 불러오는데 실패했습니다.');
            //alert("사용자 정보를 불러오지 못했습니다.");
            //window.location.href = '/page/login.html';
        }

    } catch (error) {
        console.error('에러:', error);
        //alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
        //window.location.href = '/page/login.html';
    }
}

async function updateUserInfo() {
    const email = document.getElementById('useremail').innerHTML;
    const username = document.getElementById('username').value;
    const sessionId = sessionStorage.getItem('sessionId');
    try {
        const response = await fetch('http://localhost:3000/users/update', {
            method: 'PATCH',
            headers: {
                'Authorization': sessionId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username }),
            credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
            alert('회원정보가 성공적으로 업데이트되었습니다.');
        } else {
            alert('회원정보 업데이트에 실패했습니다: ' + data.message);
        }
    } catch (error) {
        console.error('에러:', error);
        alert('회원정보 업데이트 중 오류가 발생했습니다.');
    }
}

async function deleteUser() {
    const sessionId = sessionStorage.getItem('sessionId');
    try {
        const response = await fetch('http://localhost:3000/users/delete', {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Authorization': sessionId }
        });
        const data = await response.json();
        if (response.ok) {
            sessionStorage.removeItem('sessionId');
            alert('회원탈퇴가 완료되었습니다.');
            window.location.href = '/page/login.html'; // 로그인 페이지로 리다이렉트
        } else {
            alert('회원탈퇴에 실패했습니다: ' + data.message);
        }
    } catch (error) {
        console.error('에러:', error);
        alert('회원탈퇴 중 오류가 발생했습니다.');
    }
}
