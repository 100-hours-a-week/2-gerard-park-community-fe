import { fetchUserProfile } from './dropdown.js';

document.addEventListener('DOMContentLoaded', () => {
    const editProfileForm = document.getElementById('editProfileForm');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const deleteUserModal = document.getElementById('deleteUserModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    const profileUpload = document.getElementById('profile');
    const profilePreview = document.getElementById('profilePreview');

    fetchUserProfile();
    // 사용자 정보 불러오기
    fetchUserInfo();

    // 프로필 수정 폼 제출
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateUserInfo();
    });

    // 회원탈퇴 버튼 클릭
    deleteAccountBtn.addEventListener('click', () => {
        deleteUserModal.style.display = 'block';
    });

    // 회원탈퇴 확인
    confirmDelete.addEventListener('click', () => {
        deleteUser();
    });

    // 회원탈퇴 취소
    cancelDelete.addEventListener('click', () => {
        deleteUserModal.style.display = 'none';
    });

    // 프로필 이미지 업로드 및 프리뷰
    profileUpload.addEventListener('click', () => {
        const input = document.getElementById('inputImg');
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePreview.src = e.target.result;
                    profilePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });
});

async function fetchUserInfo() {
    const sessionId = sessionStorage.getItem('sessionId');

    if (!sessionId) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/users/user-info', {
            method: 'GET',
            headers: { 'Authorization': sessionId },
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('useremail').innerHTML = data.email;
            document.getElementById('username').value = data.username;
            if (data.profileImage) {
                profilePreview.src = data.profileImage;
                profilePreview.style.display = 'block';
            }
        } else {
            console.error('사용자 정보를 불러오는데 실패했습니다.');
            //alert("사용자 정보를 불러오지 못했습니다.");
            //window.location.href = '/login';
        }
    } catch (error) {
        console.error('에러:', error);
        //alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
        //window.location.href = '/login';
    }
}

async function updateUserInfo() {
    const email = document.getElementById('useremail').innerHTML;
    const username = document.getElementById('username').value;
    const profileInput = document.querySelector('input[type="file"]');
    const sessionId = sessionStorage.getItem('sessionId');
    const toastContainer = document.getElementById('toastContainer');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    if (profileInput && profileInput.files[0]) {
        formData.append('profileImage', profileInput.files[0]);
    }

    try {
        const response = await fetch('http://localhost:3000/users/update', {
            method: 'PATCH',
            headers: {
                'Authorization': sessionId,
            },
            body: formData,
            credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
            // 토스트 메시지 표시
            toastContainer.style.display = 'block';
            setTimeout(() => {
                toastContainer.style.display = 'none';
            }, 3000);
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
            headers: { 'Authorization': sessionId },
            credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
            sessionStorage.removeItem('sessionId');
            alert('회원탈퇴가 완료되었습니다.');
            window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        } else {
            alert('회원탈퇴에 실패했습니다: ' + data.message);
        }
    } catch (error) {
        console.error('에러:', error);
        alert('회원탈퇴 중 오류가 발생했습니다.');
    }
}
