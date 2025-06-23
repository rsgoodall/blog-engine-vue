<script setup lang="ts">
import { ref, watch } from 'vue';
import AdminService from '../services/AdminService';
import { BvTriggerableEvent, useToastController } from 'bootstrap-vue-next';
// import { toastMessage } from '~/helpers';
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
const emit = defineEmits(['update:visible','editUser']);

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    user: {
        type: Object,
        required: true
    },
});

const localUser = ref(props.user);
const roles = ref<string[]>(["user","admin"]);

function ok(e: Event) {
    const payload = {
        id: localUser.value.id,
        name: localUser.value.name,
        email: localUser.value.email,
        role: localUser.value.role,
        isVerified: localUser.value.isVerified,
        isEnabled: localUser.value.isEnabled
    };
    AdminService.updateUser(payload)
    .then((response) => {
        if (response.status === 200) {
            toastMessage("success", "User updated!");
            emit('editUser');
        }

    })
    .catch((error) => {
        toastMessage("danger", error.message);
        e.stopPropagation();
    })
}
</script>

<template>
    <BModal
        v-model="props.visible"
        centered
        ok-title="Save" class="modal-md" @ok="ok">
        <template v-if="localUser.id === '0'" #title>
            New User
        </template>
        <template v-else #title>
            Edit User
        </template>
        <BForm>
            <BFormFloatingLabel label-for="floatingName" class="my-2">
                <template #label>
                    Name
                </template>
                <BFormInput id="floatingName" class="mb-3" v-model="localUser.name" placeholder="Enter name" required />
                <BFormInvalidFeedback :state="localUser.name.length > 3">Name needs to be at least 3 characters</BFormInvalidFeedback>
            </BFormFloatingLabel>
            <BFormFloatingLabel label-for="floatingEmail" class="my-2">
                <template #label>
                    Email
                </template>
                <BFormInput id="floatingEmail" type="email" class="mb-3" v-model="localUser.email" placeholder="Enter email" required />
            </BFormFloatingLabel>
            <BFormFloatingLabel label-for="floatingRole" class="my-2">
                <template #label>
                    Role
                </template>
                <BFormSelect id="floatingRole" class="my-3" v-model="localUser.role" :options="roles">
                    <template #first>
                        <BFormSelectOption :value="null" disabled>-- Please select a Role --</BFormSelectOption>
                    </template>
                </BFormSelect>
            </BFormFloatingLabel>
            <div class="my-2 ms-2">
                <BFormRadioGroup id="floatingEnabled" v-model="localUser.isEnabled">
                    <BFormRadio :value="true">Enabled</BFormRadio>
                    <BFormRadio :value="false">Disabled</BFormRadio>
                </BFormRadioGroup>
            </div>
            <div v-if="user.id !== '0'" class="my-2 ms-2">
                <BFormRadioGroup id="floatingVerified" v-model="localUser.isVerified">
                    <BFormRadio :value="true">Verified</BFormRadio>
                    <BFormRadio :value="false">Unverified</BFormRadio>
                </BFormRadioGroup>
            </div>
        </BForm>
    </BModal>
</template>