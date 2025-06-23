<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useToastController } from 'bootstrap-vue-next';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
const store = useAuthStore();
const router = useRouter();

interface RegisterForm {
    name: string
    email: string
    password: string
    acceptTerms: boolean
}

const form = ref<RegisterForm>({
    name: "",
    email: "",
    password: "",
    acceptTerms: false
})

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

const submitHandler = (event: Event) => {
    store.register(form.value.name, form.value.email, form.value.password)
    .then((response) => {
        if (response.status === 201) {
            toastMessage("success", "Registered. Verify your email before login.")
            router.push('/login')
        }
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    })

}
onMounted(async () => {
    const response = await fetch("/TermsOfUse.md");
    termsAndConditions.value = await response.text();
})

const registrationEnabled = ref<boolean>(import.meta.env.VITE_APP_REG_ENABLED.toLowerCase() === 'true');

const passwordValidation = computed(() => form.value.password.length > 5);
const registerBtnEnabled = computed(() => form.value.name !== '' && form.value.email !== '' && form.value.password !== '' && form.value.acceptTerms);

const termsAndConditions = ref("");
</script>
<template>
    <BContainer flex>
        <BRow class="register-form justify-content-md-center">
            <BCol sm="10" md="6" lg="8" xl="8">
                <BCard>
                    <BCardTitle>Register</BCardTitle>
                    <BCardBody v-if="registrationEnabled">
                        <BForm @submit.prevent="submitHandler">
                            <BFormFloatingLabel label-for="floatingName" class="my-2">
                                <template #label>
                                    <IBiPerson />
                                    Name
                                </template>
                                <BFormInput 
                                    id="floatingName" 
                                    v-model="form.name" 
                                    type="text" 
                                    placeholder="Name" 
                                    required />
                            </BFormFloatingLabel>
                            <BFormFloatingLabel label-for="floatingEmail" class="my-2">
                                <template #label>
                                    <IBiEnvelopeAt class="register-icon" />
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
                                    <IBiKey class="register-icon" />
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
                            <BRow class="my-2">
                                <BCol>
                                    <BFormCheckbox v-model="form.acceptTerms" required>
                                    I accept the Terms of Use
                                    </BFormCheckbox>
                                    <BFormInvalidFeedback :state="form.acceptTerms">You must accept Terms of Use</BFormInvalidFeedback>
                                </BCol>
                                <BCol class="d-flex flex-column align-items-end">
                                    <BButton v-b-toggle.termsAndConditions variant="secondary">Show Terms of Use</BButton>
                                </BCol>
                            </BRow>
                            <BCollapse id="termsAndConditions" class="my-2">
                                <BCard>
                                    <MdPreview v-model="termsAndConditions" />
                                </BCard>
                            </BCollapse>
                            <div class="d-grid gap-2">
                                <BButton variant="primary" type="submit" :disabled="!registerBtnEnabled">Register</BButton>
                            </div>
                        </BForm>
                    </BCardBody>
                    <BCardBody v-else>
                        <h1>Registration is currently closed<br>Come back later</h1>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
</template>

<style lang="css">
.register-form {
    margin-block: 100px;
}

.register-icon {
    margin-bottom: 4px;
    margin-right: 3px;
}
</style>