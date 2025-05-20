import { createRouter, createWebHistory  } from 'vue-router';
import { useAuthStore } from '../stores';

import Root from '../pages/index.vue';

const routes = [
    {
        path: '/',
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
    // {
    //     path: '/blogs',
    //     name: 'Blog',
    //     component: () => import('../pages/blogs/name.vue'),
    //     props: (route: any) => (
    //         {
    //             name: route.query.name,
    //             tag: route.query.tag,
    //             category: route.query.category,
    //             sort: route.query.sort, 
    //             search: route.query.search,
    //         }
    //     ),
    // },
    {
        path: '/blogs/:blogName/view',
        name: 'BlogView',
        component: () => import('../pages/blogs/view.vue'),
        props: (route: any) => (
            {
                blogName: route.params.blogName,
                tag: route.query.tag,
                category: route.query.category,
                sort: route.query.sort,
                search: route.query.search,
            }
        ),
        alias: '/blogs/:blogName',
        meta: { requiresAuth: false }
    },
    {
        path: '/blogs/:blogName/edit',
        name: 'BlogEdit',
        component: () => import('../pages/blogs/edit.vue'),
        props: (route: any) => (
            {
                blogName: route.params.blogName,
                tag: route.query.tag,
                category: route.query.category,
                sort: route.query.sort,
                search: route.query.search,
            }
        ),
        meta: { requiresAuth: true }
    },
    {
        path: '/blogs/:blogName/posts/:post',
        name: 'Post',
        component: () => import('../pages/blogs/post.vue'),
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