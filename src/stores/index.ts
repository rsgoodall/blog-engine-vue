import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import router from '../router';
import axios from 'axios';
import { apiClient } from '@/services/Common';
// import type { User, Blog, Post} from '../types';
// import Messages from '~/helpers';

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

        apiClient.post('/auth/login', payload ,{ withCredentials: true})
        // axios.post(import.meta.env.VITE_APP_API_URL + '/auth/login', payload ,{ withCredentials: true, headers: { }})
        .then((response) => {
            if (response.status === 200) {
                user.value.name = response.data.user.name;
                user.value.userId = response.data.user._id;
                user.value.role = response.data.user.role;
                user.value.blogs = [];
                router.push('/home');
            } else {
                console.error(response.statusText);
                //Messages.error(response.statusText);
            }
        })
        .catch((error) => {
            console.error(error.message);
            //Messages.error(error.message);
        })
    }

    function logout() {
        axios.delete(import.meta.env.VITE_APP_API_URL + '/auth/logout', { withCredentials: true})
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
                //Messages.error(response.statusText);
            }
        })
        .catch((error) => {
            console.error(error.message);
            //Messages.error(error.message);
        })
    }

    return {
        user,
        login,
        logout,
        // getBlogs,
        // getMyBlogs,
        // updateBlog,
        // getPosts,
        // updatePosts,
        // getUsers,
        // updateUser
    }
})