export function checkLogin() {
    return JSON.parse(window.localStorage.getItem('session'));
}

export function checkCollapse(isCollapse) {
    return isCollapse === true ? true : false;
}
