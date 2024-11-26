const dropBtn = document.querySelector('#dropButton');
const dropMenu = document.querySelector('.dropdown-content');
const logoutMenu = document.querySelector('#logout');
const dropProfileImage = document.querySelector('#dropProfileImage');
dropBtn.addEventListener('click', () => {
    dropMenu.classList.toggle('show');
});
logoutMenu.addEventListener('click', () => {
    logout();
});

export async function fetchUserProfile() {
    const sessionId = sessionStorage.getItem('sessionId');

    if (!sessionId) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        window.location.href = '/page/login.html';
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
            if (data.profileImage) {
                dropProfileImage.src = data.profileImage;
            }
        } else {
            console.error('사용자 프로필 이미지를 불러오는데 실패했습니다.');
        }
    } catch (error) {
        console.error('에러:', error);
    }
}

async function logout() {
    try {
        const response = await fetch('http://localhost:3000/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: '',
            credentials: 'include', // 쿠키 포함
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        sessionStorage.removeItem('sessionId');
        alert('로그아웃');
        window.location.href = '/page/login.html';
    } catch (error) {
        console.error('에러:', error);
    }
}