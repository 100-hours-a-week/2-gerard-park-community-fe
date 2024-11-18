const dropBtn = document.querySelector('#dropButton');
const dropMenu = document.querySelector('.dropdown-content');

dropBtn.addEventListener('click', () => {
    dropMenu.classList.toggle('show');
});