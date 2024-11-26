export function checkLength(value, num) {
    return value.length <= num;
}
export function isEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}
export function onlyNumberAndEnglish(str) {
    return /^[A-Za-z0-9][A-Za-z0-9]*$/.test(str);
}
export function isPassword(str) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(str);
}
export function isMatch(pw1, pw2) {
    return pw1 == pw2;
}
export function isNickname(str) {
    return /^[A-Za-z\d_][A-Za-z\d_]{0,9}$/.test(str);
}
export function st(str) {

}