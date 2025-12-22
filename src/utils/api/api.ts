import axiosClient from "../axios.client";

export const registerApi = async (data: any) => {
    return await axiosClient.post('/register', data);
};

export const loginApi = async (data: any) => {
    return await axiosClient.post('/login', data);
};

export const getProfileApi = async () => {
    return await axiosClient.get('/me');
};

export const updateProfileApi = async (data: any) => {
    return await axiosClient.put('/me', data);
};

// API Xác thực mã OTP
export const verifyCodeApi = async (data: { email: string; code: string }) => {
    return await axiosClient.post('/verify', data);
};

// API Gửi lại mã OTP
export const resendCodeApi = async (data: { email: string }) => {
    return await axiosClient.post('/resend-code', data);
};