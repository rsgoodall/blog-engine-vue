<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useAuthStore } from '../stores';
import { useRouter } from 'vue-router';
import { useToastController } from 'bootstrap-vue-next';

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

interface ResetPasswordForm {
    password: string
}

const form = ref<ResetPasswordForm>({
    password: ''
})

const resetHandler = (event: Event) => {
    store.resetPassword(props.token, props.email, form.value.password)
    .then((response) => {
        if (response.status === 200) {
            toastMessage("success",'Password reset successful');
            router.push({name: 'Login'});
        }
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    })


}

const passwordValidation = computed(() => form.value.password.length > 5);
</script>

<template>
    <BContainer>
        <BRow align-h="center" class="justify-content-md-center">
            <BCol cols="6">
                <BCard class="reset-password-card">
                    <BCardTitle><IBiKey class="reset-password-icon"/> Reset Password</BCardTitle>
                    <BCardBody>
                        <BForm @submit.prevent="resetHandler">
                            <BFormFloatingLabel id="floatingPassword">
                                <template #label>
                                    <IBiKey class="reset-password-icon"/>
                                </template>
                                <BFormInput
                                    id="floatingPassword"
                                    v-model="form.password"
                                    type="password"
                                    placeholder="Password"
                                    required />
                                <BFormInvalidFeedback :state="passwordValidation">Password needs to be at least 8 characters</BFormInvalidFeedback>
                                <div class="d-grid gap-2">
                                    <BButton variant="primary" type="submit">Reset Password</BButton>
                                </div>
                            </BFormFloatingLabel>
                        </BForm>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
</template>

<style lang="css">
.reset-password-card {
    margin-top: 100px;
    max-width: 600px;
    border-width: 0px;
}

.reset-password-icon {
    margin-bottom: 4px;
    margin-right: 3px;
}
</style>