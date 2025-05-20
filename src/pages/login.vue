<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useAuthStore } from '../stores';
const store = useAuthStore();

interface LoginForm {
    email: string
    password: string
}

const form = ref<LoginForm>({
    email: '',
    password: ''
});


const submitHandler = (event: Event) => {
    console.log("submitHandler: ", form.value);
    store.login(form.value.email, form.value.password);
}

const passwordValidation = computed(() => form.value.password.length > 5);
</script>



<template>
    <BContainer>
        <BRow align-h="center" class="justify-content-md-center">
            <BCol cols="6">
                <BCard class="login-card">
                    <BCardTitle><IBiPerson class="login-icon"/>Log In</BCardTitle>
                    
                    <BCardBody>
                        <BForm @submit.prevent="submitHandler">
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
                        </BForm>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
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