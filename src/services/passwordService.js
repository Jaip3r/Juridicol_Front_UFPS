import axios from "./axios";

export async function findAccount(account) {
    return await axios.post('/auth/forgot-password', account, {
        headers:{
            "Content-Type": "application/json"
        }
    })
}