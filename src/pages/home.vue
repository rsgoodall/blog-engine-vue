<script setup lang="ts">
import { ref, reactive, onBeforeMount, nextTick, toRaw } from 'vue';
import BlogService from '../services/BlogService';
import BlogCard from '../components/BlogCard.vue';
import { Blog } from '../types';
import { useAuthStore } from '../stores';
// import { toastMessage } from '../helpers';
import { useToastController } from 'bootstrap-vue-next';
import { useRouter} from 'vue-router';
const {show} = useToastController();
/**
 * Toast Message
 */
function toastMessage(type: string, message: string) {
    show?.({props: {
        body: message,
        variant: type,
        bodyClass: "text-center"
    }})
}

const store = useAuthStore();
const router = useRouter()

const blogs = ref<Blog[]>([])

onBeforeMount(() => {
    nextTick(() => {
        loadMyBlogs();
    });
});

function loadMyBlogs() {
    blogs.value = [];
    BlogService.getMyBlogs()
    .then((response) => {
        if (response.status === 200) {
            response.data.blogs.forEach((blog: any) => {
                blogs.value.push({
                    id: blog._id,
                    name: blog.name,
                    title: blog.title,
                    description: blog.description,
                    images: blog.images,
                    createdAt: blog.createdAt,
                    updatedAt: blog.updatedAt,
                    isEnabled: blog.isEnabled
                })
                if (!store.user.blogs.includes(blog._id)) {
                    store.user.blogs.push(blog._id);
                }
            })
        } else {
            toastMessage("danger", response.statusText);
        }
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    });
}


const editBlogData = ref<Blog>({
    id: '0',
    name: '',
    title: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    images: [],
    isEnabled: false
});

const blogCardVisible = ref(false);
const editBlogIndex = ref(0);


function editBlog (blogIndex: number) {
    editBlogIndex.value = blogIndex;
    if (blogIndex === -1) {
        editBlogData.value.id = '0';
        editBlogData.value.name = "";
        editBlogData.value.title = "";
        editBlogData.value.description = "";
        editBlogData.value.images = [];
        editBlogData.value.isEnabled = true;
    } else {
        editBlogData.value.id = blogs.value[blogIndex].id;
        editBlogData.value.name = blogs.value[blogIndex].name;
        editBlogData.value.title = blogs.value[blogIndex].title;
        editBlogData.value.description = blogs.value[blogIndex].description;
        editBlogData.value.images = blogs.value[blogIndex].images;
        editBlogData.value.isEnabled = blogs.value[blogIndex].isEnabled;
    }
    blogCardVisible.value = true;
}

const deleteBlogVisible = ref(false);
const deleteBlogIndex = ref(0);
const deleteBlogTitle = ref("");

function deleteBlog(index: number) {
    deleteBlogIndex.value = index;
    deleteBlogTitle.value = blogs.value[index].title;
    deleteBlogVisible.value = true;
}

function openBlog(blog: Blog) {
    router.push({ name: 'Blog', params: {blogName: blog.name }});
}

async function performDelete() {
    BlogService.deleteBlog(blogs.value[deleteBlogIndex.value].id)
    .then((response) => {
        if (response.status === 200) {
            toastMessage("success", "Blog deleted!");
        }
        deleteBlogVisible.value = false;
        loadMyBlogs();
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    })
}
</script>
<template>
    <BContainer fluid="sm">
        <BRow class="justify-content-md-center">
            <BCol md="6">
                <BCard class="home-new-blog-container border-0">
                    <BCardText v-if="blogs.length === 0" class="text-center">
                        <h3>You don't have any blogs yet, create one </h3><BButton class="btn w-40" variant="primary" @click="editBlog(-1)">New Blog</BButton>
                    </BCardText>
                    <BCardText v-else class="text-center">
                        <h3>Create a new blog </h3><BButton class="btn w-40" variant="primary" @click="editBlog(-1)">New Blog</BButton>
                    </BCardText>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
    <BContainer fluid="sm">
        <BRow class="justify-content-md-center">
            <BCol v-for="blog,bindex in blogs" sm="8" offset-sm="2" md="6" lg="5" xl="4" class="mx-2">
                <BCard class="my-4" img-top :img-src="blog.images[0]" img-alt="image" img-height="300" style="min-width: 418px;max-width: 418px;" >
                    <BCardTitle>
                        <BRow>
                            <BCol xs="8" md="9" lg="10">
                                {{ blog.title }}
                            </BCol>
                            <BCol xs="4" md="3" lg="2">
                                <IBiTrash class="text-danger ms-3" v-b-tooltip.hover.top="'Delete Blog'" @click="deleteBlog(bindex)"/>
                            </BCol>
                        </BRow>

                    </BCardTitle>
                    <BCardText class="text-truncate">
                        {{ blog.description }}
                    </BCardText>
                    <BRow class="justify-content-center">
                        <BButtonGroup>
                            <BButton @click="openBlog(blog)" variant="primary">
                                <IBiDoorOpen height="20" width="20" /> Open
                            </BButton>
                        <BButton @click="editBlog(bindex)" variant="info"><IBiPencilSquare height="20" width="20"/> Edit</BButton>
                        </BButtonGroup>
                    </BRow>
                    <div v-if="!blog.isEnabled" class="bg-danger text-center mt-2 py-1 text-white rounded-1">Disabled</div>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
    <BlogCard
        v-model:visible="blogCardVisible"
        v-model:blog="editBlogData"
        @editBlog="loadMyBlogs"
        @hide="blogCardVisible = false"/>
    <BModal v-model:visible="deleteBlogVisible" 
        @hide="deleteBlogVisible = false"
        header-bg-variant="danger"
        ok-title="Yes"
        @ok="performDelete"
        centered title="Delete Blog">
        <p>WARNING: This operation cannot be undone!</p>
        <p>Do you want to delete blog: "{{ deleteBlogTitle }}"?</p>
    </BModal>
</template>

<style lang="css" scoped>
.home-new-blog-container {
    margin-top: 100px;
}
</style>