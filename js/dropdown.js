const dropBtn = document.querySelector('#dropButton');
const dropMenu = document.querySelector('.dropdown-content');
const logoutMenu = document.querySelector('#logout');
dropBtn.addEventListener('click', () => {
    dropMenu.classList.toggle('show');
});
logoutMenu.addEventListener('click', () => {
    logout();
});

async function logout() {
    try {
        const response = await fetch('http://localhost:3000/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: '',
            credentials: 'include' // 쿠키 포함
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        sessionStorage.removeItem('sessionId');
        alert("로그아웃");
        window.location.href = '/page/login.html';
    } catch (error) {
        console.error('에러:', error)
    }
}