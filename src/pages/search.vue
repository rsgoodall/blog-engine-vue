<script setup lang="ts">
import { ref, onBeforeMount, nextTick } from 'vue';
import { Blog } from '../types';
import BlogService from '../services/BlogService';

const blogs = ref<Blog[]>([])

const searchText = ref("");
function submitSearch() {
    const payload = {
        text: searchText.value
    }
    BlogService.searchBlogs(payload)
    .then((response) => {
        if (response.status === 200) {
            blogs.value = [];
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
            })
        }
    })
    .catch((error) => {
        console.log("error:", error);
    })
}
</script>

<template>
    <!-- Heading -->
    <BContainer class="search-container-header">
        <BRow class="justify-content-md-center">
            <BCol cols="8">
                <h1>Search MultiBlog...</h1>
            </BCol>
        </BRow>
        <BRow class="justify-content-md-center">
            <BCol cols="6" class="my-5">
                <BForm @submit.prevent="submitSearch">
                    <BInputGroup>
                        <BFormInput v-model="searchText" type="text" placeholder="What do you want to search for today?" required />
                        <template #append>
                            <BButton class="bg-primary" type="submit"><IBiSearch /> Search</BButton>
                        </template>
                    </BInputGroup>
                </BForm>
            </BCol>
        </BRow>
        <BRow v-if="blogs.length !== 0" class="justify-content-md-center">
            <BCol cols="4" v-for="blog in blogs">
                <BCard class="my-5" img-top :img-src="blog.images[0]" img-alt="image" img-height="300" style="min-width: 418px;max-width: 418px;">
                    <BCardTitle>
                        <BRow>
                            <BCol cols="10">
                                {{ blog.title }}
                            </BCol>
                        </BRow>
                    </BCardTitle>
                    <BCardText class="text-truncate">
                        {{ blog.description }}
                    </BCardText>
                    <BRow class="justify-content-center">
                        <BButtonGroup>
                            <BButton variant="primary">
                                <RouterLink :to="{ name: 'BlogView', params: {blogName: blog.name }}" class="text-white text-decoration-none"><IBiDoorOpen height="20" width="20" /> Open</RouterLink>
                            </BButton>
                        </BButtonGroup>
                    </BRow>
                </BCard>
            </BCol>
        </BRow>
        <BRow v-else class="justify-content-md-center">
            <BCol cols="4">
                <h3>No results</h3>
            </BCol>
        </BRow>
    </BContainer>
</template>

<style lang="css" scoped>
.search-container-header {
    margin-top: 100px;
}
</style>