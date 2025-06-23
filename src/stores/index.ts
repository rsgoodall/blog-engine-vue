import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import router from '../router';
import { apiClient } from '../services/Common';

export const useAuthStore = defineStore('auth', () => {

    const token = useLocalStorage('token','');
    const user = useLocalStorage('user', {
        name: '',
        userId: '',
        role: '',
        blogs: []
    });

    function login(email: string, password: string) {
        const payload = {
            email: email,
            password: password
        }

        return apiClient.post('/auth/login', payload ,{ withCredentials: true});
    }

    function logout() {
        apiClient.delete('/auth/logout', { withCredentials: true})
        .then((response) => {
            if (response.status === 200) {
                token.value = '';
                user.value.name = '';
                user.value.userId = '';
                user.value.role = '';
                user.value.blogs = [];
                localStorage.removeItem('user');
                router.push('/login');
            } else {
                // something else happend
                console.error(response.statusText);
            }
        })
        .catch((error) => {
            console.error(error.message);
        })
    }

    function forgotPassword(email: string) {
        const payload = {
            email: email
        }
        return apiClient.post('/auth/forgot-password', payload);
    }

    function resetPassword(token: string, email: string, password: string) {
        const payload = {
            token: token,
            email: email,
            password: password
        }
        return apiClient.post('/auth/reset-password', payload);
    }

    function verifyEmail(email: string, token: string) {
        const payload = {
            email: email,
            verificationToken: token
        }
        return apiClient.post('/auth/verify-email', payload);
    }
    function register(name: string, email: string, password: string) {
        const payload = {
            name: name,
            email: email,
            password: password
        }
        return apiClient.post('/auth/register', payload);
    }
    
    return {
        user,
        login,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        register
    }
})