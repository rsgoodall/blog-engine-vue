<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import BlogService from '../services/BlogService';
import { BvTriggerableEvent, useToastController } from 'bootstrap-vue-next';

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
const emit = defineEmits(['update:visble', 'editComment']);

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    blogId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    comment: {
        type: Object,
        required: true
    }
})

async function ok(e: Event) {
    if (props.comment.content === '') {
        e.stopPropagation();
        return;
    }
    const payload = {
        content: props.comment.content
    }
    if (props.comment._id === '0') {
        await BlogService.createComment(props.blogId, props.postId, payload)
        .then((response) => {
            if (response.status === 200) {
                toastMessage("success","Comment created. Success!");
            }
        })
        .catch((error) => {
            toastMessage("danger", error.message);
        })

    } else {
        await BlogService.updateComment(props.blogId, props.postId, props.comment._id, payload)
        .then((response) => {
            if (response.status === 200) {
                toastMessage("success", "Comment updated. Success!");
            }
        })
        .catch((error) => {
            toastMessage("danger", error.message);
        })
    }
    emit('editComment');
}

/**
 * Image upload 
 */

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

const okDisabled = computed(() => {
    if (props.comment.content !== '') {
        return false;
    } else {
        return true;
    }
})
</script>

<template>
    <BModal
        v-model="props.visible"
        centered
        ok-title="Save"
        class="modal-xl"
        @ok="ok"
        :ok-disabled="okDisabled">
        <template v-if="props.comment._id === '0'" #title>
            New Comment
        </template>
        <template v-else #title>
            Edit Comment
        </template>
        <BForm>
            <div style="text-align: left;">
                <MdEditor v-model="props.comment.content" language="en-US" @onUploadImg="onUploadImg" />
            </div>
            <BFormInvalidFeedback :state="props.comment.content.length > 0">Comment cannot be empty</BFormInvalidFeedback>
        </BForm>
    </BModal>
</template>