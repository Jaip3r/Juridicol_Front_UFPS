import axios from "./axios";

export async function findAccount(account) {
    return await axios.post('/auth/forgot-password', account, {
        headers:{
            "Content-Type": "application/json"
        }
    });
}

export async function resetPassword(body) {
    return await axios.put('/auth/reset-password', body, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}