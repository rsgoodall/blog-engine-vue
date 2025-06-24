<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useAuthStore } from '../stores';
import { useRouter } from 'vue-router';
import { useToastController } from 'bootstrap-vue-next';
const store = useAuthStore();
const router = useRouter();

interface LoginForm {
    email: string
    password: string
}

const form = ref<LoginForm>({
    email: '',
    password: ''
});

const forgotPasswordModal = ref(false);
const forgotPassword = ref<any>({
    email: ''
});
const forgotPasswordHandler = (event: Event) => {
    store.forgotPassword(forgotPassword.value.email)
    .then((response) => {
        toastMessage("success", response.data.message);
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    })
    forgotPasswordModal.value = false;
}

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

const loginHandler = (event: Event) => {
    store.login(form.value.email, form.value.password)
    .then((response) => {
        if (response.status === 200) {
            store.user.name = response.data.user.name;
            store.user.userId = response.data.user.userId;
            store.user.role = response.data.user.role;
            store.user.blogs = [];
            router.push('/home');
        }
    })
    .catch((error) => {
        if (error.status === 401) {
            toastMessage("danger", error.response.data.message);
        } else {
            toastMessage("danger",error.message);
        }
    })
}

const passwordValidation = computed(() => form.value.password.length > 5);
</script>



<template>
    <BContainer>
        <BRow align-h="center" class="justify-content-center">
            <BCol sm="10" md="8" lg="8" xl="6">
                <BCard class="login-card">
                    <BCardTitle><IBiPerson class="login-icon"/>Log In</BCardTitle>
                    <BCardBody>
                        <BForm @submit.prevent="loginHandler">
                            <BFormFloatingLabel label-for="floatingEmail" class="my-2">
                                <template #label>
                                    <IBiEnvelopeAt class="login-icon" />
                                    Email
                                </template>
                                <BFormInput
                                    id="floatingEmail"
                                    v-model="form.email"
                                    type="email" 
                                    placeholder="Email"
                                    required />
                            </BFormFloatingLabel>
                            <BFormFloatingLabel label-for="floatingPassword" class="my-2">
                                <template #label>
                                    <IBiKey class="login-icon" />
                                    Password
                                </template>
                                <BFormInput 
                                    id="floatingPassword"
                                    v-model="form.password"
                                    type="password"
                                    placeholder="Password"
                                    required />
                                <BFormInvalidFeedback :state="passwordValidation">Password needs to be at least 8 characters</BFormInvalidFeedback>
                            </BFormFloatingLabel>
                            <div class="d-grid gap-2">
                                <BButton variant="primary" type="submit">Log In</BButton>
                            </div>
                            <div class="d-grid gap-2 mt-3">
                                <BButton variant="secondary" @click.prevent="forgotPasswordModal = true">Forgot Password</BButton>
                            </div>
                        </BForm>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
        <BModal v-model="forgotPasswordModal" title="Reset Password" ok-only ok-title="close">
            <BForm @submit.prevent="forgotPasswordHandler">
                <BFormFloatingLabel label-for="forgotPasswordEmail" class="my-2">
                    <template #label>
                        <IBiEnvelopeAt class="login-icon" />
                        Email
                    </template>
                    <BFormInput
                        id="forgotPasswordEmail"
                        v-model="forgotPassword.email"
                        type="email"
                        placeholder="Email"
                        required />
                    <div class="d-grid gap-2 mt-3">
                        <BButton variant="primary" type="submit">Reset Password</BButton>
                    </div>
                </BFormFloatingLabel>
            </BForm>
        </BModal>
    </BContainer>

</template>

<style lang="css">
.login-card {
    margin-top: 100px;
    max-width: 600px;
    border-width: 0px;
}

.login-icon {
    margin-bottom: 4px;
    margin-right: 3px;
}
</style>