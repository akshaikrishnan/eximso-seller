export const endpoints = {
    checkUser: '/api/auth/check-user',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    sendOtp: '/api/auth/send-otp',
    verifyOtp: '/api/auth/verify-otp',
    socialLogin: '/api/auth/social-login',
    forgotPassword: '/api/auth/forgot-password',

    //user
    user: '/api/user',

    //upload
    // singleUpload: '/api/upload',
    // multipleUpload: '/api/upload/multiple',

    singleUpload: '/api/s3-upload',
    multipleUpload: '/api/s3-upload/multiple'
} as const;
