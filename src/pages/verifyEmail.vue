<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToastController } from 'bootstrap-vue-next';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores';

const store = useAuthStore();
const props = defineProps(["token","email"]);
const router = useRouter();

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

interface VerifyEmailForm {
    email: string
    token: string
}

const form = ref<VerifyEmailForm>({
    email: '',
    token: ''
});

const submitHandler = (event: Event) => {
    console.log("submitHandler");
    store.verifyEmail(props.email, props.token)
    .then((response) => {
        if (response.status === 200) {
            toastMessage("success","Email verification successful");
            router.push({name: 'Login'});
        }
    })
    .catch((error) => {
        toastMessage('danger',error.message);
    })

}

onMounted(() => {
    form.value.email = props.email;
    form.value.token = props.token;
})
</script>

<template>
    <BContainer>
        <BRow align-h="center" class="justify-content-md-center">
            <BCol cols="6">
                <BCard class="verify-email-card">
                    <BCardTitle><IBiEnvelope class="verify-email-icon" /> Verify Email</BCardTitle>
                    <BCardBody>
                        <BForm @submit.prevent="submitHandler">
                            <BFormFloatingLabel id="floatingEmail" class="my-2">
                                <template #label>
                                    <IBiEnvelope class="verify-email-icon" />
                                </template>
                                <BFormInput
                                    id="floatingEmail"
                                    v-model="form.email"
                                    type="email"
                                    required
                                    disabled />
                            </BFormFloatingLabel>
                            <BFormFloatingLabel id="floatingToken" class="my-2">
                                <template #label>
                                    <IBiKey class="verify-email-icon" />
                                </template>
                                <BFormInput
                                    id="floatingToken"
                                    v-model="form.token"
                                    type="string"
                                    required
                                    disabled />
                            </BFormFloatingLabel>
                            <div class="d-grid gap-2">
                                <BButton variant="primary" type="submit">Verify Email</BButton>
                            </div>
                        </BForm>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
</template>

<style lang="css">
.verify-email-card {
    margin-top: 100px;
    max-width: 600px;
    border-width: 0px;
}

.verify-email-icon {
    margin-bottom: 4px;
    margin-right: 3px;
}
</style>