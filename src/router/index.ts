import { createRouter, createWebHistory  } from 'vue-router';
import { useAuthStore } from '../stores';

import Root from '../pages/index.vue';

const routes = [
    {
        path: '/',
        children: [
            {
                path: '',
                name: 'Root',
                component: Root,
            },
            {
                path: '/search',
                name: 'Search',
                component: () => import('../pages/search.vue'),
                //alias: '/blogs',
            },
            {
                path: '/home',
                name: 'Home',
                component: () => import ('../pages/home.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/login',
                name: 'Login',
                component: () => import('../pages/login.vue'),
            },
            {
                path: '/register',
                name: 'Register',
                component: () => import('../pages/register.vue'),
            },
            {
                path: '/contact',
                name: 'Contact',
                component: () => import('../pages/contact.vue'),
            },
            {
                path: '/reset-password',
                name: 'ResetPassword',
                component: () => import('../pages/resetPassword.vue'),
                props: (route: any) => ({
                    token: route.query.token,
                    email: route.query.email
                })
            },
            {
                path: '/verify-email',
                name: 'VerifyEmail',
                component: () => import('../pages/verifyEmail.vue'),
                props: (route: any) => ({
                    token: route.query.token,
                    email: route.query.email
                })
            },
            {
                path: '/blogs/:blogName',
                name: 'Blog',
                component: () => import('../pages/blogs/blog.vue'),
                props: (route: any) => ({
                    blogName: route.params.blogName,
                    tag: route.query.tag,
                    category: route.query.category,
                    sort: route.query.sort,
                    search: route.query.search,
                }),
                meta: { requiresAuth: false }
            },
            {
                path: '/blogs/:blogName/posts/:post',
                name: 'Post',
                component: () => import('../pages/blogs/blog.vue'),
                props: (route: any) => ({
                    blogName: route.params.blogName,
                    tag: route.query.tag,
                    category: route.query.category,
                    sort: route.query.sort,
                    search: route.query.search,
                }),
                meta: { requiresAuth: false }
            },
            {
                path: '/blogs/404',
                name: 'Blog404',
                component: () => import('../pages/blogs/404.vue'),
            },
            {
                path: '/admin',
                name: 'Admin',
                component: () => import('../pages/admin/index.vue'),
                meta: { requiresAuth: true }
            },
            // TO DO: catch all
            {
                path: '/:catchAll(.*)*',
                component: () => import('../pages/blogs/404.vue'),
            }
        ]
    }
]

// const routes = [
//     {
//         path: '/',
//         name: 'Root',
//         component: Root,
//     },
//     {
//         path: '/search',
//         name: 'Search',
//         component: () => import('../pages/search.vue'),
//         //alias: '/blogs',
//     },
//     {
//         path: '/home',
//         name: 'Home',
//         component: () => import ('../pages/home.vue'),
//         meta: { requiresAuth: true }
//     },
//     {
//         path: '/login',
//         name: 'Login',
//         component: () => import('../pages/login.vue'),
//     },
//     {
//         path: '/register',
//         name: 'Register',
//         component: () => import('../pages/register.vue'),
//     },
//     {
//         path: '/contact',
//         name: 'Contact',
//         component: () => import('../pages/contact.vue'),
//     },
//     {
//         path: '/reset-password',
//         name: 'ResetPassword',
//         component: () => import('../pages/resetPassword.vue'),
//         props: (route: any) => ({
//             token: route.query.token,
//             email: route.query.email
//         })
//     },
//     {
//         path: '/verify-email',
//         name: 'VerifyEmail',
//         component: () => import('../pages/verifyEmail.vue'),
//         props: (route: any) => ({
//             token: route.query.token,
//             email: route.query.email
//         })
//     },
//     {
//         path: '/blogs/:blogName',
//         name: 'Blog',
//         component: () => import('../pages/blogs/blog.vue'),
//         props: (route: any) => ({
//             blogName: route.params.blogName,
//             tag: route.query.tag,
//             category: route.query.category,
//             sort: route.query.sort,
//             search: route.query.search,
//         }),
//         meta: { requiresAuth: false }
//     },
//     {
//         path: '/blogs/:blogName/posts/:post',
//         name: 'Post',
//         component: () => import('../pages/blogs/blog.vue'),
//         props: (route: any) => ({
//             blogName: route.params.blogName,
//             tag: route.query.tag,
//             category: route.query.category,
//             sort: route.query.sort,
//             search: route.query.search,
//         }),
//         meta: { requiresAuth: false }
//     },
//     {
//         path: '/blogs/404',
//         name: 'Blog404',
//         component: () => import('../pages/blogs/404.vue'),
//     },
//     {
//         path: '/admin',
//         name: 'Admin',
//         component: () => import('../pages/admin/index.vue'),
//         meta: { requiresAuth: true }
//     },
//     // TO DO: catch all
//     {
//         path: '/:catchAll(.*)*',
//         component: () => import('../pages/blogs/404.vue'),
//     }
// ]

const router = createRouter({ history: createWebHistory(), routes});
router.beforeEach((to, from) => {
    const store = useAuthStore();
    if (to.meta.requiresAuth && store.user.userId === '') {
        return {
            path: '/login'
        }
    }
});

export default router;