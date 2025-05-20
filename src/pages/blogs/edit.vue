<script setup lang="ts">
import dateformat from 'dateformat';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRoute, useRouter } from 'vue-router';
import { useToastController, usePopoverController } from 'bootstrap-vue-next';
import { ref, reactive, onBeforeMount, onMounted, watch  } from 'vue';
import BlogService from '../../services/BlogService';
import PostCard from '../../components/PostCard.vue';
import CommentCard from '../../components/CommentCard.vue';
import { Blog, Post, Comment, UserMap } from '../../types';
import { useClipboard } from '@vueuse/core';
import { useAuthStore } from '../../stores';

const store = useAuthStore();
const route = useRoute();
const router = useRouter();
const props = defineProps(["blogName","tag","category","sort","search"]);

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

const isReady = ref<boolean>(false);
const tags = ref<string[]>([]);
const posts = ref<Post[]>([]);
const userList = ref<UserMap[]>([])
const filteredPosts = ref<Post[]>([]);
const numPosts = ref(0);
const blogUrl = ref("");

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

const searchText = ref("")
function submitSearch() {
    router.push({ name: 'BlogEdit', params: { blogName: blog.name }, query: {search: searchText.value}});
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
 onBeforeMount(() => {
    loadBlog();
});

function loadBlog() {
    // get blog
    BlogService.getBlog(props.blogName.toString())
    .then((response) => {
        if (response.status === 200) {
            blog.id = response.data.blog[0]._id;
            blog.name = response.data.blog[0].name;
            blog.title = response.data.blog[0].title;
            blog.description = response.data.blog[0].description;
            blog.images = response.data.blog[0].images;
            blog.isEnabled = response.data.blog[0].isEnabled;
            blogUrl.value = import.meta.env.VITE_APP_PUBLIC_URL + `/blogs/${blog.name}`;
        } else {
            // back to index
            // Messages.error(response.statusText);
        }
    })
    .then(() => {
        loadPosts();
    })
    .catch((error) => {
        router.push({ name: 'Blog404'})
        //router.push('/blogs/404');
        console.log("blog error");
    })
}

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
            userList.value = response.data.users;
            filterPosts();
            isReady.value = true;
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

async function finishEditPost() {
    loadPosts();
}

const deletePostVisible = ref(false);
const deletePostIndex = ref(0);
const deletePostTitle = ref("");

function deletePost(index: number) {
    deletePostIndex.value = index;
    deletePostTitle.value = posts.value[index].title;
    deletePostVisible.value = true;
}

function performDeletePost() {
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

/**
 * Comments
 */
const commentCardVisible = ref(false);
const editCommentPostId = ref("0");
const editCommentId = ref("0");
const editCommentContent = ref("");
const editCommentPostIndex = ref(0);
const editCommentIndex = ref(0);

const editCommentData = ref<Comment>({
    _id: '0',
    content: '',
    user: '',
    createdAt: '',
    updatedAt: ''
})

function editComment (postIndex: number, commentIndex: number) {
    editCommentPostIndex.value = postIndex;
    //editCommentIndex.value = commentIndex;
    editCommentPostId.value = posts.value[postIndex].id;
    if (commentIndex === -1) {
        console.log("editComment: new comment")
        // editCommentContent.value = "";
        // editCommentId.value = "0"
        editCommentData.value._id = '0';
        editCommentData.value.content = '';
        editCommentData.value.user = '';
        editCommentData.value.createdAt = '';
        editCommentData.value.updatedAt = '';

    } else {
        console.log("editComment: edit")
        //editCommentContent.value = posts.value[postIndex].comments[commentIndex].content;
        editCommentId.value = posts.value[postIndex].comments[commentIndex]._id;
        editCommentData.value = posts.value[postIndex].comments[commentIndex];
        console.log("editCommentContent: ", posts.value[postIndex].comments[commentIndex].content)
    }
    console.log("id:",editCommentId.value,"comment:",editCommentContent.value)
    commentCardVisible.value = true;

}

async function finishEditComment() {
    console.log("finishEditComment")
    //editCommentContent.value = "";
    console.log("finish editCommentContent:",editCommentContent.value);
    loadPosts();
}


const deleteCommentVisible = ref(false);
const deleteCommentPostIndex = ref(0);
const deleteCommentIndex = ref(0);

function deleteComment(pindex: number, cindex: number) {
    deleteCommentIndex.value = cindex;
    deleteCommentPostIndex.value = pindex;
    deleteCommentVisible.value = true;
}

function performDeleteComment() {
    BlogService.deleteComment(blog.id, posts.value[deleteCommentPostIndex.value].id, posts.value[deleteCommentPostIndex.value].comments[deleteCommentIndex.value]._id)
    .then((response) => {
        if (response.status === 200) {
            toastMessage("success", "Comment deleted. Success!");
            loadPosts();
        }
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    });
    deleteCommentVisible.value = false;

}
</script>

<template>
    <BContainer v-if="isReady" fluid class="blog-container">
        <BRow>
            <BCol cols="9">
                <div class="mx-4">
                    <h1 class="display-4">{{ blog.title }} <a href="javascript:void(0)" @click="blogLink"><IBiLink style="height: 2rem; width: 2rem;" v-b-tooltip.hover.top="'Copy Link'"/></a></h1>
                    <p class="lead">{{ blog.description }}</p>
                    <hr />
                    <div v-for="post,pindex in filteredPosts">
                        <BCard class="border-0">
                            <div class="text-start">
                                {{ dateformat(post.createdAt) }}
                            </div>
                            <div class="text-end">
                                <IBiTrash 
                                    v-if="store.user.blogs.includes(blog.id)" 
                                    class="text-danger ms-4" 
                                    @click="deletePost(pindex)" 
                                    v-b-tooltip.hover.top="'Delete Post'" />
                                <IBiPencilSquare 
                                    v-if="store.user.blogs.includes(blog.id)"
                                    class="text-primary ms-4"
                                    @click="editPost(pindex)"
                                    v-b-tooltip.hover.top="'Edit Post'"/>
                            </div>
                            <BCardTitle>{{ post.title }} <a href="javascript:void(0)" @click="postLink(post)"><IBiLink v-b-tooltip.hover.top="'Copy Link'"/></a>
                            </BCardTitle>
                            <BCardBody>
                                <MdPreview v-model="post.content" />
                            </BCardBody>
                            <div class="text-end">
                                {{ post.comments.length }} comments
                            </div>
                            <BCard v-for="comment,cindex in post.comments" class="border-1 my-2">
                                <div class="text-start">
                                    {{ dateformat(comment.createdAt) }} {{ userList.find(x => x.id === comment.user).name }} said:
                                </div>
                                <div class="text-end">
                                    <IBiTrash 
                                        class="text-danger ms-4"
                                        @click="deleteComment(pindex,cindex)"
                                        v-b-tooltip.hover.top="'Delete Comment'"/>
                                    <IBiPencilSquare 
                                        class="text-primary ms-4"
                                        @click="editComment(pindex,cindex)"
                                        v-b-tooltip.hover.top="'Edit Comment'"/>
                                </div>
                                <BCardBody>
                                    <MdPreview v-model="comment.content" />
                                </BCardBody>
                            </BCard>
                            <div class="d-flex align-items-end flex-column">
                                <BButton @click="editComment(pindex, -1)">Add Comment</BButton>
                            </div>
                        </BCard>
                        <hr />
                    </div>
                </div>
            </BCol>
            <BCol cols="3">
                <div class="me-4">
                    <BImg  class="rounded-2 mb-4" fluid-grow :src="blog.images[0]" />
                    <BCard class="mb-4">
                        <div class="d-flex align-item-center">
                        <BButton v-if="store.user.blogs.includes(blog.id)" @click="editPost(-1)" class="bg-primary me-1">New Post</BButton>
                        <router-link :to="{ name: 'BlogEdit', params: { blogName: blog.name } }"><BButton class="bg-primary me-1">Clear Filters</BButton></router-link>
                        <router-link :to="{ name: 'BlogEdit', params: { blogName: blog.name }, query: { sort: 'asc' } }"><BButton class="bg-primary me-1">Sort Asc</BButton></router-link>
                        <router-link :to="{ name: 'BlogEdit', params: { blogName: blog.name }, query: { sort: 'dsc'}}"><BButton class="bg-primary">Sort Dsc</BButton></router-link>
                        </div>
                    </BCard>
                    <BCard class="mb-4">
                        <BCardTitle>Search</BCardTitle>
                        <BCardBody>
                            <BForm @submit="submitSearch">
                                <BInputGroup>
                                    <BFormInput v-model="searchText" type="text" placeholder="Search..." required/>
                                    <template #append>
                                        <BButton class="bg-primary"><IBiSearch /></BButton>
                                    </template>
                                </BInputGroup>
                            </BForm>
                        </BCardBody>
                    </BCard>
                    <BCard class="mb-4">
                        <BCardTitle>Categories</BCardTitle>
                        <BCardBody>
                            <div v-for="cat in categoriesList">
                                <router-link :to="{ name: 'BlogEdit', params: { blogName: blog.name }, query: {  category: cat }}">{{ cat }}</router-link>
                            </div>
                        </BCardBody>
                        <BButton v-if="store.user.name !== ''" @click="categoriesCardVisible = true" class="bg-primary">Edit Categories</BButton>
                    </BCard>
                    <BCard>
                        <BCardTitle>Tags</BCardTitle>
                        <BCardBody>
                            <div v-for="tag in tags">
                                <router-link :to="{ name: 'BlogEdit', params: { blogName: blog.name}, query: { tag: tag }}">
                                    <BBadge>{{ tag }}</BBadge>
                                </router-link>
                            </div>
                        </BCardBody>
                    </BCard>
                </div>
            </BCol>
        </BRow>
    </BContainer>
    <PostCard
        v-model:visible="postCardVisible"
        v-model:post="editPostData"
        v-model:categories="categoriesList"
        v-model:blogId="blog.id"
        @edit-post="finishEditPost"
        @hide="postCardVisible = false"/>
    <CommentCard
        v-model:visible="commentCardVisible"
        v-model:blogId="blog.id"
        v-model:postId="editCommentPostId"
        v-model:comment="editCommentData"
        @edit-comment="finishEditPost"
        @hide="commentCardVisible = false" />
    <CategoryCard
        v-model:visible="categoriesCardVisible"
        v-model:categories="categoriesList"
        @editCategories="saveCategories"
        @hide="categoriesCardVisible = false" />
    <BModal v-model:visible="deletePostVisible" 
        @hide="deletePostVisible = false"
        header-bg-variant="danger"
        ok-title="Yes"
        @ok="performDeletePost"
        centered title="Delete Post">
        <p>WARNING: This operation cannot be undone!</p>
        <p>Do you want to delete post: "{{ deletePostTitle }}"?</p>
    </BModal>
    <BModal v-model:visible="deleteCommentVisible" 
        @hide="deleteCommentVisible = false"
        header-bg-variant="danger"
        ok-title="Yes"
        @ok="performDeleteComment"
        centered title="Delete Comment">
        <p>WARNING: This operation cannot be undone!</p>
        <p>Do you want to delete this comment?</p>
    </BModal>
    <!-- TO DO Floating Add Post Button-->
</template>

<style lang="css" scoped>
.blog-container {
    margin-block: 75px;
}
</style>