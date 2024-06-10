export const endpoints = {
    checkUser: '/api/auth/check-user',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    socialLogin: '/api/auth/social-login',

    //user
    user: '/api/user',

    //upload
    singleUpload: '/api/upload',
    multipleUpload: '/api/upload/multiple'
} as const;
