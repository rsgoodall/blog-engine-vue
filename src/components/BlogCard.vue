<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import slugify from 'slugify';
import VuePictureCropper, { cropper } from 'vue-picture-cropper'; 
import { BvTriggerableEvent } from 'bootstrap-vue-next';
import { useToastController } from 'bootstrap-vue-next';
import BlogService from '../services/BlogService';
const {show} = useToastController();

const emit = defineEmits(['update:visible','editBlog','closeBlog']);

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    blog: {
        type: Object,
        required: true
    }
});

const localBlog = ref(props.blog);
const localImage = ref<null | File>(null);

watch(
    () => props.visible, (visible) => {
        if (visible) {
            localImage.value = null;
            result.dataURL = '';
            result.blobURL = '';
        }
    }
)

function titleChange(value: string) {
    localBlog.value.name = slugify(value, { lower: true, strict: true });
}
// function uploadImage(e: Event) {
//     return new Promise(resolve =>{
//         setTimeout(() => {
//             console.log("upload image");
//             if (localImage.value) {
//                 console.log("blog ok uploading image");
//                 const form = new FormData();
//                 form.append('image', localImage.value);
//                 axios.post(import.meta.env.VITE_APP_API_URL + `/blogs/${props.blog.id}/posts/uploadImage`, form, { headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true})
//                 .then((res) =>{
//                     console.log("res:", res)
//                 })
//                 .catch((error) => {
//                     toastMessage("error", error.message);
//                     e.stopPropagation();
//                     return;
//                 })
//             }
//             resolve('resolved');
//         }, 2000);
//     })
// }

async function ok(e: Event) {
    if (result.dataURL !== '') {
        if (localBlog.value.images.length === 0) {
            localBlog.value.images.push(result.dataURL);
        } else {
            localBlog.value.images[0] = result.dataURL;
        }
    }
    if (localBlog.value.id === '0') {
        const payload = {
            name: localBlog.value.name,
            title: localBlog.value.title,
            description: localBlog.value.description,
            images: localBlog.value.images,
            isEnabled: localBlog.value.isEnabled
        }
        // call backend
        await BlogService.createBlog(payload)
        .then((response) => {
            if (response.status === 200) {
                toastMessage("success","Blog created");
            } else {
                toastMessage("danger", response.statusText);
                e.stopPropagation();
            }
        })
        .catch((error) => {
            toastMessage("danger", error.message);
            e.stopPropagation();
        })
    } else {
        const payload = {
            title: localBlog.value.title,
            description: localBlog.value.description,
            images: localBlog.value.images,
            isEnabled: localBlog.value.isEnabled,
        }
        await BlogService.updateBlog(localBlog.value.id, payload)
        .then((response) => {
            if (response.status === 200) {
                toastMessage("success", "Blog updated");
            } else {
                toastMessage("danger", response.statusText);
                e.stopPropagation();
            }
        })
        .catch((error) => {
            toastMessage("danger", error.message);
            e.stopPropagation();
        })

    }
    emit('editBlog', localBlog.value);
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
 * Cropper Controls
 */
const cropperVisible = ref<Boolean>(true);
const uploadInput = ref<HTMLInputElement | null>(null);
const pic = ref<string>("");

const result = reactive({
    dataURL: '',
    blobURL: ''
})

function selectFile(e: BvTriggerableEvent) {
    // Reset last selection and results
    pic.value = '';
    result.dataURL = '';
    result.blobURL = '';

    // get selected files
    const { files } = e.target as HTMLInputElement;
    if (!files || !files.length) {
        return;
    }

    // convert dataURL and pass to cropper
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        // Update the picture source of the img prop
        pic.value = String(reader.result);

        // Clear selected files of input element
        if (!uploadInput.value) {
            return;
        }
        uploadInput.value = '';
        cropperVisible.value = true;
    }
}

async function getResult() {
    if (!cropper) {
        return;
    }

    const base64 = cropper.getDataURL();
    const blob: Blob | null = await cropper.getBlob();
    if (!blob) {
        return;
    }

    const file = await cropper.getFile({
        fileName: 'my filename'
    });

    result.dataURL = base64;
    result.blobURL = URL.createObjectURL(blob);
    localBlog.value.images[0] = base64;
    cropperVisible.value = false;
}

function clear() {
    if (!cropper) {
        return;
    }
    cropper.clear();
}

function reset() {
    if (!cropper) {
        return;
    }
    cropper.reset();
    cropperVisible.value = true;
}

function ready() {
    console.log("Cropper is ready");
}

function clearExisting() {
    localBlog.value.images.splice(0,1);
}

const okDisabled = computed(() => {
    if (localBlog.value.title !== '' && localBlog.value.name !== '' && localBlog.value.description !=='') {
        return false;
    } else {
        return true;
    }
})
</script>

<template>
    <BModal
        id="editBlogModal"
        v-model="props.visible"
        centered
        ok-title="Save"
        class="modal-xl" 
        @ok.prevent="ok"
        :ok-disabled="okDisabled"
        >
        <template v-if="localBlog.id === '0'" #title>
            New Blog
        </template>
        <template v-else #title>
            Edit Blog
        </template>
        <BRow>
            <BCol cols="6">
                <BForm>
                    <BFormFloatingLabel label-for="floatingTitle" class="my-2">
                        <template #label>
                            Title
                        </template>
                        <BFormInput
                            id="floatingTitle"
                            v-model="localBlog.title"
                            @update:model-value="titleChange"
                            type="text" 
                            placeholder="Title"
                            required />
                    </BFormFloatingLabel>
                    <BFormFloatingLabel label-for="floatingName" class="mb-2">
                        <template #label>
                            Name
                        </template>
                        <BFormInput
                            id="floatingName"
                            v-model="localBlog.name"
                            type="text" 
                            placeholder="Name"
                            required />
                    </BFormFloatingLabel>
                    <BFormFloatingLabel label-for="floatingDesc" class="my-2">
                        <template #label>
                            Description
                        </template>
                        <BFormTextarea
                            id="floatingDesc"
                            v-model="localBlog.description"
                            rows="3"
                            placeholder="Description..."
                            required />
                    </BFormFloatingLabel>
                    <BFormFile v-model="uploadInput" type="file" accept="image/*" @change="selectFile"/>
                    <div class="my-2 ms-2">
                        State:
                        <BFormRadioGroup v-model="localBlog.isEnabled">
                            <BFormRadio :value="true">Enabled</BFormRadio>
                            <BFormRadio :value="false">Disabled</BFormRadio>
                        </BFormRadioGroup>
                    </div>
                </BForm>
            </BCol>
            <BCol cols="6">
                <BImg fluid v-if="localBlog.images.length > 0" :src="localBlog.images[0]" />
                <div v-else>
                    No Image
                </div>
            </BCol>
        </BRow>

        <BRow class="justify-content-md-center my-2">
            <BCol cols="6" offset="2">
                <BButtonToolbar>
                    <BButtonGroup v-if="uploadInput !== null">
                        <BButton class="me-2" @click="clear">Clear</BButton>
                        <BButton class="me-2" @click="reset">Reset</BButton>
                        <BButton class="me-2" @click="getResult">Use</BButton>
                    </BButtonGroup>
                    <BButton v-if="localBlog.images.length > 0" class="ms-2" @click="clearExisting">Remove Existing</BButton>
                </BButtonToolbar>
            </BCol>
        </BRow>
        <BRow>
            <VuePictureCropper v-if="cropperVisible === true"
            :boxStyle="{ width: '100%', height: '100%', backgroundColor: '#f8f8f8', margin: 'auto'}"
            :img="pic"
            :options="{ viewMode: 1, dragMode: 'crop', aspectRatio: 4 / 3 }" />
            <BImg v-if="cropperVisible === false" :src="result.dataURL"/>
        </BRow>
    </BModal>
</template>