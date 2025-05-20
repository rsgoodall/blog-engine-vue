<script setup lang="ts">
import { computed, ref } from 'vue';

interface RegisterForm {
    name: string
    email: string
    password: string
}

const form = ref<RegisterForm>({
    name: "",
    email: "",
    password: ""
})
const submitHandler = (event: Event) => {
    console.log(submitHandler, event);
}

const passwordValidation = computed(() => form.value.password.length > 5);
</script>
<template>
    <BContainer flex>
        <BRow class="register-form justify-content-md-center">
            <BCol cols="6">
                <BCard>
                    <BCardTitle>Register</BCardTitle>
                    <BCardBody>
                        <BForm @submit="submitHandler">
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
                            <div class="d-grid gap-2">
                                <BButton variant="primary" type="submit">Register</BButton>
                            </div>
                        </BForm>
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