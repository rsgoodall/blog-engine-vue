<script setup lang="ts">
import dateformat from 'dateformat';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { loadRouteLocation, useRoute, useRouter } from 'vue-router';
import { useToastController } from 'bootstrap-vue-next';
import { ref, reactive, onMounted, watch  } from 'vue';
import BlogService from '../../services/BlogService';
import PostCard from '../../components/PostCard.vue';
import { Blog, Post } from '../../types';
import { useClipboard } from '@vueuse/core';
// import {toastMessage } from '../../helpers';
import { useAuthStore } from '../../stores';

const store = useAuthStore();

const route = useRoute();
const router = useRouter();
const props = defineProps(["name","tag","category","sort","search"]);

const {show} = useToastController();

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

const tags = ref<string[]>([]);
const posts = ref<Post[]>([]);
const filteredPosts = ref<Post[]>([]);
const numPosts = ref(0);
const blogUrl = ref("");

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

const searchText = ref("")

function submitSearch() {
    //router.push({ name: 'Blog', query: {search: searchText.value}});
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
 * On load
 */
onMounted(() => {
    // get blog
    BlogService.getBlog(props.name)
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
            numPosts.value = response.data.count;
            posts.value.sort((objA: any, objB: any) => {
                new Date(objB.createdAt) - new Date(objA.createdAt)
            });
            filteredPosts.value = posts.value;
        } else {
            toastMessage("danger", response.statusText);
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

/**
 * Categories List
 */
const categoriesList = ref<string[]>([]);
const categoriesCardVisible = ref(false);

function saveCategories (categories: string[]) {
    categoriesList.value = categories;
    categoriesCardVisible.value = false;
}

/**
 * Edit Post
 */
const editPostData = ref<Post>({
    id: '0',
    title: '',
    slug: '',
    content: '',
    tags: [],
    category: '',
    comments: [],
    createdAt: ''
})

const editPostIndex = ref(0);
const postCardVisible = ref(false);

function editPost (postIndex: number) {
    editPostIndex.value = postIndex;
    if (postIndex === -1) {
        editPostData.value.id = '0';
        editPostData.value.title = '';
        editPostData.value.content = '';
        editPostData.value.category = '';
        editPostData.value.tags = [];
        editPostData.value.comments = [];
        editPostData.value.createdAt = '';
    } else {
        editPostData.value.id = posts.value[postIndex].id;
        editPostData.value.title = posts.value[postIndex].title;
        editPostData.value.content = posts.value[postIndex].content;
        editPostData.value.category = posts.value[postIndex].category;
        editPostData.value.tags = posts.value[postIndex].tags;
        editPostData.value.comments = posts.value[postIndex].comments;
        editPostData.value.createdAt = posts.value[postIndex].createdAt;
    }
    postCardVisible.value = true;
}

const deletePostVisible = ref(false);
const deletePostIndex = ref(0);
const deletePostTitle = ref("");

function deletePost(index: number) {
    deletePostIndex.value = index;
    deletePostTitle.value = posts.value[index].title;
    deletePostVisible.value = true;
}

function performDelete() {
    BlogService.deletePost(blog.id, posts.value[deletePostIndex.value].id)
    .then((response) => {
        if (response.status === 200) {
            toastMessage("success", "Post deleted. Success!");
            loadPosts();
        }
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    });
    deletePostVisible.value = false;
}

/**
 * Toast Message
 */
function toastMessage(type: any, message: string) {
    show?.({props: {
        body: message,
        variant: type,
        bodyClass: "text-center"
    }})
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
    <!-- <BContainer fluid class="blog-header">
        <BRow>
            <BCol cols="8">
                <h1 class="display-4">{{ blog.title }}</h1>
                <p class="lead">{{ blog.description }}</p>
            </BCol>
        </BRow>
    </BContainer> -->
    <BContainer fluid class="blog-container">
        <BRow>
            <BCol cols="8">
                <h1 class="display-4">{{ blog.title }} <a href="javascript:void(0)" @click="blogLink"><IBiLink style="height: 2rem; width: 2rem;" v-b-tooltip.hover.top="'Copy Link'"/></a></h1>
                <p class="lead">{{ blog.description }}</p>
                <hr />
                <div v-for="post,pindex in filteredPosts">
                    <BCard class="border-0">
                        <div class="text-start">
                            {{ dateformat(post.createdAt) }}
                        </div>
                        <div class="text-end">
                            <BButton @click="deletePost(pindex)"><IBiTrash v-b-tooltip.hover.top="'Delete Post'" /></BButton>
                            <BButton @click="editPost(pindex)"><IBiPen v-b-tooltip.hover.top="'Edit Post'"/></BButton>
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
            <BCol cols="4">
                <BImg  class="rounded-2 mb-4" fluid-grow :src="blog.images[0]" />
                <BCard class="mb-4">
                    <BButton v-if="store.user.name !== ''" @click="editPost(-1)">New Post</BButton>
                    <router-link :to="{ name: 'Blog', query: { name: props.name} }"><BButton>Clear Filters</BButton></router-link>
                    <router-link :to="{ name: 'Blog', query: { name: props.name, sort: 'asc'}}"><BButton>SortAsc</BButton></router-link>
                    <router-link :to="{ name: 'Blog', query: { name: props.name, sort: 'dsc'}}"><BButton>SortDsc</BButton></router-link>
                </BCard>
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
                            <router-link :to="{ name: 'Blog', query: { name: props.name, category: cat }}">{{ cat }}</router-link>
                        </div>
                    </BCardBody>
                    <BButton v-if="store.user.name !== ''" @click="categoriesCardVisible = true">Edit Categories</BButton>
                </BCard>
                <BCard>
                    <BCardTitle>Tags</BCardTitle>
                    <BCardBody>
                        <div v-for="tag in tags">
                            <router-link :to="{ name: 'Blog', query: { name: props.name, tag: tag }}">
                                <BBadge>{{ tag }}</BBadge>
                            </router-link>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
    <PostCard
        v-model:visible="postCardVisible"
        v-model:post="editPostData"
        v-model:categories="categoriesList"
        v-model:blogId="blog.id"
        @editPost="loadPosts"
        @hide="postCardVisible = false"/>
    <CategoryCard
        v-model:visible="categoriesCardVisible"
        v-model:categories="categoriesList"
        @editCategories="saveCategories"
        @hide="categoriesCardVisible = false" />
    <BModal v-model:visible="deletePostVisible" 
        @hide="deletePostVisible = false"
        header-bg-variant="danger"
        ok-title="Yes"
        @ok="performDelete"
        centered title="Delete Post">
        <p>WARNING: This operation cannot be undone!</p>
        <p>Do you want to delete post: "{{ deletePostTitle }}"?</p>
    </BModal>
    <!-- TO DO Floating Add Post Button-->
</template>

<style lang="css" scoped>
.blog-container {
    margin-block: 75px;
}
</style>