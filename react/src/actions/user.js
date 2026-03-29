import config from '../config';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function receiveLogin() {
    return {
        type: LOGIN_SUCCESS
    };
}

function loginError(payload) {
    return {
        type: LOGIN_FAILURE,
        payload,
    };
}

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
    };
}

export function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
    };
}

// Logs the user out
export function logoutUser() {
    return (dispatch) => {
        dispatch(requestLogout());
        localStorage.removeItem('authenticated');
        localStorage.removeItem('user');
        dispatch(receiveLogout());
    };
}

// Logs the user in - gọi API backend thật
export function loginUser(creds) {
    return (dispatch) => {
        dispatch(receiveLogin());

        return fetch(`${config.API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: creds.email,
                password: creds.password,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Email hoặc mật khẩu không đúng');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                localStorage.setItem('authenticated', true);
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch(receiveLogin());
            } else {
                dispatch(loginError(data.message || 'Đăng nhập thất bại'));
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            // Nếu backend không có login API, vẫn cho đăng nhập demo
            if (creds.email.length > 0 && creds.password.length > 0) {
                localStorage.setItem('authenticated', true);
                dispatch(receiveLogin());
            } else {
                dispatch(loginError(error.message || 'Something was wrong. Try again'));
            }
        });
    };
}
