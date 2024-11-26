import * as checkValidate from './check.js'
import { fetchUserProfile } from './dropdown.js';

document.addEventListener('DOMContentLoaded', () => {
    const editPasswordForm = document.getElementById('editPasswordForm');

    fetchUserProfile();

    // 비밀번호 수정 폼 제출
    editPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('userpw').value;
        const pwcf = document.getElementById('userpwcf').value;
        const sessionId = sessionStorage.getItem('sessionId');
        const editPwBtn = document.getElementById('editPasswordBtn');
        let countValidateError = 0;

        if (password == '') {
            document.getElementById('pwhelp').innerHTML = '*비밀번호를 입력해주세요.';
            if (pwcf == '') {
                document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
            } else if (!checkValidate.isMatch(password, pwcf)) {
                document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
            } else {
                document.getElementById('pwcfhelp').innerHTML = '';
            }
            countValidateError++;
        } else if (!checkValidate.isPassword(password)) {
            document.getElementById('pwhelp').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자,소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
            if (pwcf == '') {
                document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
            } else if (!checkValidate.isMatch(password, pwcf)) {
                document.getElementById('pwcfhelp').innerHTML = '*비밀번호가 다릅니다.';
            } else {
                document.getElementById('pwcfhelp').innerHTML = '';
            }
            countValidateError++;
        } else {
            document.getElementById('pwhelp').innerHTML = '';
            if (pwcf == '') {
                document.getElementById('pwcfhelp').innerHTML = '*비밀번호를 한번더 입력해주세요.';
                countValidateError++;
            } else if (!checkValidate.isMatch(password, pwcf)) {
                document.getElementById('pwhelp').innerHTML = '*비밀번호가 확인과 다릅니다.';
                document.getElementById('pwcfhelp').innerHTML = '*비밀번호와 다릅니다.';
                countValidateError++;
            } else {
                document.getElementById('pwcfhelp').innerHTML = '';
                editPwBtn.style.backgroundColor = '7f6aee';
            }
        }

        if (countValidateError != 0) {
            return false;
        }

        try {
            const response = await fetch('http://localhost:3000/users/update-password', {
                method: 'PATCH',
                headers: {
                    'Authorization': sessionId,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                document.getElementById('userpw').value = '';
                document.getElementById('userpwcf').value = '';
                editPwBtn.style.backgroundColor = 'aca0eb';
            } else {
                alert('비밀번호 변경에 실패했습니다: ' + data.message);
            }
        } catch (error) {
            console.error('에러:', error);
            alert('비밀번호 변경 중 오류가 발생했습니다.');
        }
    });
});