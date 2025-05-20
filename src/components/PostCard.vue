<script setup lang="ts">
import { ref, watch } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { BvTriggerableEvent, useToastController } from 'bootstrap-vue-next';
import slugify from 'slugify';
import BlogService from '../services/BlogService';

const {show} = useToastController();

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
 * Props
 */
const emit = defineEmits(['update:visible','editPost']);

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    post: {
        type: Object,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    blogId: {
        type: String,
        required: true
    }
});

watch(
    () => props.visible, (visible) => {
        if (visible) {
            if (props.post.category !== "") {
                localSelectedCategory.value = props.post.category;
            } else {
                localSelectedCategory.value = null;
            }
        }
    }
)

const localPost = ref(props.post);
const localSelectedCategory = ref(null);

function titleChange(value: string) {
    localPost.value.slug = slugify(value, { lower: true, strict: true });
}

async function ok(e: BvTriggerableEvent) {
    if (localPost.value.title === '' || localPost.value.content === '') {
        e.stopPropagation();
        return;
    } else {
        if (localSelectedCategory.value !== "" && localSelectedCategory.value !== null) {
            localPost.value.category = localSelectedCategory.value;
        }
    }
    if (localPost.value.id === '0') {
        const payload = {
            title: localPost.value.title,
            slug: localPost.value.slug,
            content: localPost.value.content,
            category: localPost.value.category,
            tags: localPost.value.tags
        }
        await BlogService.createPost(props.blogId, payload)
        .then((response) => {
            if (response.status === 200) {
                toastMessage("success", "Post created. Success!");
            }
        })
        .catch((error) => {
            toastMessage("danger", error.message);
        })

    } else {
        const payload = {
            title: localPost.value.title,
            slug: localPost.value.slug,
            content: localPost.value.content,
            category: localPost.value.category,
            tags: localPost.value.tags
        }
        await BlogService.updatePost(props.blogId, localPost.value.id, payload)
        .then((response) => {
            if (response.status === 200) {
                toastMessage("success", "Post updated. Success!");
            }
        })
        .catch((error) => {
            toastMessage("danger", error.message);
        })
    }
    console.log("postcard: editPost");
    emit('editPost');
}

const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
        files.map((file) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('image', file);
                BlogService.uploadPostImage(props.blogId, form)
                .then((res) => rev(res))
                .catch((error) => rej(error));
            })

        })
    );
    callback(res.map((item) => item.data.image));
}
</script>

<template>
    <BModal
        v-model="props.visible"
        centered
        ok-title="Save" class="modal-xl" @ok="ok">
        <template v-if="localPost.id === '0'" #title>
            New Post
        </template>
        <template v-else #title>
            Edit Post
        </template>
        <BForm>
            <BFormFloatingLabel label-for="floatingTitle" class="my-2">
                <template #label>
                    Title
                </template>
                <BFormInput 
                    id="floatingTitle" 
                    class="mb-3" 
                    v-model="localPost.title" 
                    @update:model-value="titleChange"
                    placeholder="Enter a title" 
                    required />
                <BFormInvalidFeedback :state="localPost.title.length > 2">Title needs to be at least 3 characters</BFormInvalidFeedback>
            <BFormFloatingLabel label-for="floatingSlug" class="my-2">
                <template #label>
                    Title Slug
                </template>
                <BFormInput id="floatingSlug" class="mb-3" v-model="localPost.slug" placeholder="Title Slug" disabled />
            </BFormFloatingLabel>
            </BFormFloatingLabel>
            <BFormFloatingLabel label-for="floatingCategory" class="my-2">
                <template #label>
                    Category
                </template>
                <BFormSelect id="floatingCategory" class="my-3" v-model="localSelectedCategory" :options="props.categories">
                    <template #first>
                        <BFormSelectOption :value="null" disabled>-- Please select a category --</BFormSelectOption>
                    </template>
                </BFormSelect>
            </BFormFloatingLabel>
            <BFormFloatingLabel label-for="floatingTags" class="my-2">
                <template #label>
                    Tags
                </template>
                <BFormTags class="my-3" v-model="localPost.tags"/>
            </BFormFloatingLabel>
            <div style="text-align: left;">
                <MdEditor v-model="localPost.content" language="en-US" @onUploadImg="onUploadImg"/>
            </div>
            <BFormInvalidFeedback :state="localPost.content.length > 0">Content cannot be empty</BFormInvalidFeedback>
        </BForm>
    </BModal>
</template>