<script setup lang="ts">
import { ref, reactive, onBeforeMount, nextTick } from 'vue';
import { useToastController } from 'bootstrap-vue-next';
import AdminService from '../../services/AdminService';
import BlogService from '../../services/BlogService';
import dateformat from 'dateformat';
import type {TableFieldRaw} from 'bootstrap-vue-next';
import UserCard from '../../components/UserCard.vue';
import { User, Blog } from '../../types';

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

const users = ref<User[]>([]);

const userFields: TableFieldRaw<User>[] = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'name',
        label: 'Name',
    },
    {
        key: 'email',
        label: 'Email',
    },
    {
        key: 'role',
        label: 'Role',
    },
    {
        key: 'isVerified',
        label: 'Verified',
    },
    {
        key: 'verified',
        label: 'Verified Date'
    },
    {
        key: 'isEnabled',
        label: 'Enabled'
    },
    {
        key: 'controls',
        label: 'Controls'
    }

];

const blogs = ref<Blog[]>([]);

const blogFields: TableFieldRaw<Blog>[] = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'title',
        label: 'Title',
    },
    {
        key: 'createdAt',
        label: 'Created Date'
    },
    {
        key: 'isEnabled',
        label: 'Enabled'
    },
    {
        key: 'controls',
        label: 'Controls'
    }
]

onBeforeMount(() => {
    nextTick(async() => { 
        loadUsers();
        loadBlogs();
    });
});

function loadUsers() {
    users.value = [];
    AdminService.getUsers()
    .then((response) => {
        if (response.status === 200) {
            for (let i = 0; i < response.data.users.length; i++) {
                users.value.push({
                    id: response.data.users[i]._id,
                    name: response.data.users[i].name,
                    email: response.data.users[i].email,
                    role: response.data.users[i].role,
                    isVerified: response.data.users[i].isVerified,
                    verified: response.data.users[i].verified,
                    isEnabled: response.data.users[i].isEnabled,
                });
            }
        }
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    })
}

function loadBlogs() {
    blogs.value = [];
    BlogService.getBlogsAdmin()
    .then((response) => {
        if (response.status === 200) {
            for (let i = 0; i < response.data.blogs.length; i++) {
                blogs.value.push({
                    id: response.data.blogs[i]._id,
                    name: response.data.blogs[i].name,
                    title: response.data.blogs[i].title,
                    description: response.data.blogs[i].description,
                    images: response.data.blogs[i].images,
                    createdAt: response.data.blogs[i].createdAt,
                    updatedAt: response.data.blogs[i].updatedAt,
                    isEnabled: response.data.blogs[i].isEnabled,
                });
            }
        }
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    })
}

const userEditVisible = ref(false);
const userEditIndex = ref<number>(0);
const userEditData = ref<User>({
    id: "0",
    name: "",
    email: "",
    role: "",
    isVerified: false,
    verified: "",
    isEnabled: true
});

function editUser(index: number) {
    userEditIndex.value = index;
    if (index === -1) {
        userEditData.value.id = "0";
        userEditData.value.name = "";
        userEditData.value.email = "";
        userEditData.value.role = "user";
        userEditData.value.isVerified = false;
        userEditData.value.verified = "";
        userEditData.value.isEnabled = true;
    } else {
        userEditData.value.id = users.value[index].id;
        userEditData.value.name = users.value[index].name;
        userEditData.value.email = users.value[index].email;
        userEditData.value.role = users.value[index].role;
        userEditData.value.isVerified = users.value[index].isVerified;
        userEditData.value.verified = users.value[index].verified;
        userEditData.value.isEnabled = users.value[index].isEnabled;
    }
    userEditVisible.value = true;
}

const blogEditVisible = ref(false);
const blogEditData = ref<Blog>({
    id: '0',
    name: '',
    title: '',
    description: '',
    images: [],
    createdAt: '',
    updatedAt: '',
    isEnabled: false
})

function editBlog(index: number) {
    blogEditData.value.id = blogs.value[index].id;
    blogEditData.value.name = blogs.value[index].name;
    blogEditData.value.title = blogs.value[index].title;
    blogEditData.value.description = blogs.value[index].description;
    blogEditData.value.images = blogs.value[index].images;
    blogEditData.value.createdAt = blogs.value[index].createdAt;
    blogEditData.value.updatedAt = blogs.value[index].updatedAt;
    blogEditData.value.isEnabled = blogs.value[index].isEnabled;
    blogEditVisible.value = true;
}

</script>

<template>
    <BContainer class="admin-header">
        <h1 class="display-4">Administration</h1>
        <p class="lead">Admin tools</p>
    </BContainer>
    <BContainer>
        <BRow class="justify-content-md-center">
            <BCol cols="10">
                <BTabs content-class="mt-3">
                    <BTab title="Users">
                        <div class="my-2 text-end">
                            <BButton variant="primary" @click="editUser(-1)">New User</BButton>
                        </div>
                        <BTable striped :items="users" :fields="userFields">
                            <template #cell(isVerified)="data">
                                <div v-if="data.value"><BBadge class="bg-success">Verified</BBadge></div>
                                <div v-else><BBadge class="bg-danger">Unverified</BBadge></div>
                            </template>
                            <template #cell(isEnabled)="data">
                                <div v-if="data.value"><BBadge class="bg-success">Enabled</BBadge></div>
                                <div v-else><BBadge class="bg-danger">Disabled</BBadge></div>
                            </template>
                            <template #cell(verified)="data">
                                <div>{{ dateformat(data.value) }}</div>
                            </template>
                            <template #cell(controls)="data">
                                <span>
                                    <div>
                                        <IBiPencilSquare class="admin-icon" @click="editUser(data.index)" />
                                        <!-- <IBiTrash class="admin-icon text-danger" /> -->
                                    </div>
                                </span>
                            </template>
                        </BTable>
                    </BTab>
                    <BTab title="Blogs">
                        <BTable striped :items="blogs" :fields="blogFields">
                            <template #cell(createdAt)="data">
                                <div>{{ dateformat(data.value) }}</div>
                            </template>
                            <template #cell(isEnabled)="data">
                                <div v-if="data.value"><BBadge class="bg-success">Enabled</BBadge></div>
                                <div v-else><BBadge class="bg-danger">Disabled</BBadge></div>
                            </template>
                            <template #cell(controls)="data">
                                <span>
                                    <div>
                                        <IBiPencilSquare class="admin-icon" @click="editBlog(data.index)" />
                                        <!-- <IBiTrash class="admin-icon text-danger" /> -->
                                    </div>
                                </span>
                            </template>
                        </BTable>
                    </BTab>
                </BTabs>
            </BCol>
        </BRow>
    </BContainer>
    <UserCard
        v-model:visible="userEditVisible"
        v-model:user="userEditData"
        @editUser="loadUsers"
        @hide="userEditVisible = false"/>
    <BlogCard
        v-model:visible="blogEditVisible"
        v-model:blog="blogEditData"
        @editBlog="loadBlogs"
        @hide="blogEditVisible = false" />
</template>

<style lang="css">
.admin-header {
    margin-block: 50px;
}

.admin-icon {
    margin-bottom: 4px;
    margin-right: 3px;
}
</style>