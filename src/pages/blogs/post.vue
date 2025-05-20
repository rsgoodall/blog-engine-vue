<script setup lang="ts">
import dateformat from 'dateformat';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRoute, useRouter } from 'vue-router';
import { useToastController } from 'bootstrap-vue-next';
import { ref, reactive, onMounted, watch  } from 'vue';
import BlogService from '../../services/BlogService';
import { Blog, Post } from '../../types';
import { useClipboard } from '@vueuse/core';

const route = useRoute();

const blog = reactive<Blog>({
    id: '0',
    name: '',
    title: '',
    description: '',
    images: [],
    createdAt: '',
    updatedAt: '',
    isEnabled: false
});

const posts = ref<Post[]>([]);
const filteredPosts = ref<Post[]>([]);
const blogUrl = ref("");
const tags = ref<string[]>([]);
const categoriesList = ref<string[]>([]);

/**
 * Toast Message
 */
 const {show} = useToastController();
function toastMessage(type: any, message: string) {
    show?.({props: {
        body: message,
        variant: type,
        bodyClass: "text-center"
    }})
}

/**
 * On load
 */
 onMounted(() => {
    // get blog
    BlogService.getBlog(route.params.blogName.toString())
    .then((response) => {
        if (response.status === 200) {
            blog.id = response.data.blog[0]._id;
            blog.name = response.data.blog[0].name;
            blog.title = response.data.blog[0].title;
            blog.description = response.data.blog[0].description;
            blog.images = response.data.blog[0].images;
            blog.isEnabled = response.data.blog[0].isEnabled;
            blogUrl.value = import.meta.env.VITE_APP_PUBLIC_URL + `/#/blogs/${blog.name}`;
        } else {
            // back to index
            // Messages.error(response.statusText);
        }
    })
    .then(() => {
        loadPosts();
    })
    .catch((error) => {
        //router.push({ name: 'Blog404'})
        //router.push('/blogs/404');
        console.log("blog error");
    })
});

function loadPosts() {
    posts.value = [];
    BlogService.getPosts(blog.id)
    .then((response) => {
        if (response.status === 200) {
            for (let i = 0; i < response.data.posts.length; i++) {
                posts.value.push({
                    id: response.data.posts[i]._id,
                    title: response.data.posts[i].title,
                    slug: response.data.posts[i].slug,
                    category: response.data.posts[i].category,
                    comments: response.data.posts[i].comments,
                    content: response.data.posts[i].content,
                    createdAt: response.data.posts[i].createdAt,
                    tags: response.data.posts[i].tags
                });
            }
            posts.value.forEach(function(post) {
                if (post.slug === route.params.post) {
                    filteredPosts.value.push(post);
                }
            })
        }
    })
    .then(() => {
        posts.value.forEach(function(post) {
            if (post.category !== '' && post.category !== null) {
                if (!categoriesList.value.includes(post.category)) {
                    categoriesList.value.push(post.category);
                }
            }
        })
    })
    .then(() => {
        posts.value.forEach(function(post) {
            if (post.tags.length !== 0) {
                post.tags.forEach((element) => {
                    if (!tags.value.includes(element)) {
                        tags.value.push(element);
                    }
                })
            }
        })
    })
}

const searchText = ref("")
function submitSearch() {
    //router.push({ name: 'Blog', query: {search: searchText.value}});
}

/**
 * Copy links to clipboard
 */
 function blogLink() {
    useClipboard().copy(blogUrl.value);
    toastMessage("success","Link copied!");
}

function postLink(post: Post) {
    useClipboard().copy(blogUrl.value + `/posts/${post.slug}`);
    toastMessage("success","Link copied!");
}
</script>

<template>
    <BContainer fluid class="blog-container">
        <BRow>
            <BCol cols="9">
                <div class="mx-4">
                <h1 class="display-4">{{ blog.title }} <a href="javascript:void(0)" @click="blogLink"><IBiLink style="height: 2rem; width: 2rem;" v-b-tooltip.hover.top="'Copy Link'"/></a></h1>
                <p class="lead">{{ blog.description }}</p>
                <hr />
                <div v-if="filteredPosts.length !== 0" v-for="post,pindex in filteredPosts">
                    <BCard class="border-0">
                        <div class="text-start">
                            {{ dateformat(post.createdAt) }}
                        </div>
                        <BCardTitle>{{ post.title }} <a href="javascript:void(0)" @click="postLink(post)"><IBiLink v-b-tooltip.hover.top="'Copy Link'"/></a>
                        </BCardTitle>
                        <BCardBody>
                            <MdPreview v-model="post.content" />
                        </BCardBody>
                        <div class="text-end">
                            {{ post.comments.length }} comments
                        </div>
                    </BCard>
                    <hr />
                </div>
                <div v-else>
                    <h2>Post not found</h2>
                </div>
                </div>
            </BCol>
            <BCol cols="3">
                <div class="me-4">
                    <BImg  class="rounded-2 mb-4" fluid-grow :src="blog.images[0]" />
                    <BCard class="mb-4">
                        <BCardTitle>Search</BCardTitle>
                        <BCardBody>
                            <BForm @submit="submitSearch">
                                <BInputGroup>
                                    <BFormInput v-model="searchText" type="text" placeholder="Search..." required/>
                                    <template #append>
                                        <BButton><IBiSearch /></BButton>
                                    </template>
                                </BInputGroup>
                            </BForm>
                        </BCardBody>
                    </BCard>
                    <BCard class="mb-4">
                        <BCardTitle>Categories</BCardTitle>
                        <BCardBody>
                            <div v-for="cat in categoriesList">
                                <router-link :to="{ name: 'BlogView', params: { blogName: blog.name }, query: {  category: cat }}">{{ cat }}</router-link>
                            </div>
                        </BCardBody>
                    </BCard>
                    <BCard>
                        <BCardTitle>Tags</BCardTitle>
                        <BCardBody>
                            <div v-for="tag in tags">
                                <router-link :to="{ name: 'BlogView',params: { blogName: blog.name }, query: { tag: tag }}">
                                    <BBadge>{{ tag }}</BBadge>
                                </router-link>
                            </div>
                        </BCardBody>
                    </BCard>
                </div>
            </BCol>
        </BRow>
    </BContainer>
</template>

<style lang="css" scoped>
.blog-container {
    margin-block: 75px;
}
</style>