<script setup lang="ts">
import { onBeforeMount, watch, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToastController } from 'bootstrap-vue-next';
import { useClipboard } from '@vueuse/core';
import dateformat from 'dateformat';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

import { Blog, Post } from '../../types';
import BlogService from '../../services/BlogService';

const route = useRoute();
const router = useRouter();
const props = defineProps(["blogName","tag","category","search","sort"]);

const isReady = ref(false);
const posts = ref<Post[]>([]);
const filteredPosts = ref<Post[]>([]);
const blogUrl = ref("");
const tags = ref<string[]>([]);
const categoriesList = ref<string[]>([]);

const blog = ref<Blog>({
    id: '0',
    name: '',
    title: '',
    description: '',
    images: [],
    createdAt: '',
    updatedAt: '',
    isEnabled: false
});

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
 * Filter Posts
 */
 function filterPosts() {
    filteredPosts.value = [];
    if (!props.category && !props.tag && !props.sort && !props.search) {
        filteredPosts.value = posts.value;
    } else {
        if (props.search) {
            posts.value.forEach(post => {
                if (post.title.includes(props.search) || post.content.includes(props.search)) {
                    filteredPosts.value.push(post);
                }
            })
        } else {
            if (props.category) {
                posts.value.forEach(post => {
                    if (post.category === props.category) {
                        filteredPosts.value.push(post);
                    }
                });
            }
            if (props.tag) {
                posts.value.forEach(post => {
                    if (post.tags.includes(props.tag)) {
                        filteredPosts.value.push(post);
                    }
                });
            }
            if (props.sort) {
                if (filteredPosts.value.length === 0) {
                    filteredPosts.value = posts.value;
                }
                if (props.sort === 'asc') {
                    let sort = filteredPosts.value.sort((objA: any, objB: any) => new Date(objA.createdAt) - new Date(objB.createdAt));
                } else {
                    let sort = filteredPosts.value.sort((objA: any, objB: any) => 
                        new Date(objB.createdAt) - new Date(objA.createdAt)
                    );
                }
            }
        }
    }
}

function loadPosts() {
    posts.value = [];
    BlogService.getPosts(blog.value.id)
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
            filteredPosts.value = posts.value;
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

function loadBlog() {
    BlogService.getBlog(String(props.blogName))
    .then((response) => {
        if (response.status === 200) {
            blog.value.id = response.data.blog[0]._id;
            blog.value.name = response.data.blog[0].name;
            blog.value.title = response.data.blog[0].title;
            blog.value.description = response.data.blog[0].description;
            blog.value.images = response.data.blog[0].images;
            blog.value.isEnabled = response.data.blog[0].isEnabled;
            blogUrl.value = import.meta.env.VITE_APP_PUBLIC_URL + `/blogs/${blog.value.name}`;
        } else {
            // back to index
            // Messages.error(response.statusText);
        }
    })
    .then(() => {
        loadPosts();
        isReady.value = true;
    })
    .catch((error) => {
        router.push({ name: 'Blog404'})
    })
}

onBeforeMount(() => {
    console.log("onBeforeMount")
    loadBlog();
})

const searchText = ref("")
function submitSearch() {
    router.push({ name: 'BlogView', params: { blogName: props.blogName }, query: {search: searchText.value}});
}

watch (
    () => props.tag, (tag) => {
        filterPosts();
    }
);

watch (
    () => props.category, (category) => {
        filterPosts();
    }
)

watch (
    () => props.sort, (sort) => {
        filterPosts();
    }
)

watch (
    () => props.search, (search) => {
        filterPosts();
    }
)

/**
 * Copy links to clipboard
 */
 function blogLink() {
    useClipboard().copy(blogUrl.value);
    toastMessage("success","Link copied!");
}

function postLink(post: Post) {
    console.log("post: ", post);
    useClipboard().copy(blogUrl.value + `/posts/${post.slug}`);
    toastMessage("success","Link copied!");
}
</script>

<template>
    <BContainer v-if="isReady" fluid class="blog-container">
        <BRow>
            <BCol cols="9">
                <!-- <h1 class="display-4">{{ blog.title }} <a href="javascript:void(0)" @click="blogLink"><IBiLink style="height: 2rem; width: 2rem;" v-b-tooltip.hover.top="'Copy Link'"/></a></h1>
                <p class="lead">{{ blog.description }}</p>
                <hr /> -->
                <div v-if="filteredPosts.length !== 0" v-for="post in filteredPosts">
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
            </BCol>
            <BCol cols="3">
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
                            <router-link :to="{ name: 'BlogView', params: { blogName: blog.name}, query: {  category: cat }}">{{ cat }}</router-link>
                        </div>
                    </BCardBody>
                </BCard>
                <BCard>
                    <BCardTitle>Tags</BCardTitle>
                    <BCardBody>
                        <div v-for="tag in tags">
                            <router-link :to="{ name: 'BlogView', params: { blogName: blog.name }, query: { tag: tag }}">
                                <BBadge>{{ tag }}</BBadge>
                            </router-link>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
</template>

<style lang="css" scoped>
.blog-container {
    margin-block: 75px;
}
</style>