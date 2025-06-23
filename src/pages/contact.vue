<script setup lang="ts">
import { ref, computed } from 'vue';
import validator from 'email-validator';
import { useToastController } from 'bootstrap-vue-next';
import BlogService from '../services/BlogService';
import { useRouter } from 'vue-router';
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

/**
 * Contact Form
 */

interface ContactForm {
    email: string
    subject: string
    content: string
}

const form = ref<ContactForm>({
    email: "",
    subject: "",
    content: ""
});

async function submitHandler(event: Event) {
    const payload = {
        email: form.value.email,
        subject: form.value.subject,
        content: form.value.content
    };
    await BlogService.contact(payload)
    .then((response) => {
        if (response.status === 200) {
            toastMessage("success","Contact Form Sent")
            router.push({name: 'Root'})
        }
    })
    .catch((error) => {
        toastMessage("danger", error.message);
    })
}

const emailValidation = computed(() => validator.validate(form.value.email))
</script>

<template>
    <BContainer flex>
        <BRow class="justify-content-md-center">
            <BCol sm="10" md="8" lg="6">
                <BCard class="mt-6">
                    <BCardTitle><IBiEnvelope class="contact-icon" /> Contact Us</BCardTitle>
                    <BCardBody>
                        <BForm @submit.prevent="submitHandler">
                            <BFormFloatingLabel label-for="floatingEmail" class="my-2">
                                <template #label>
                                    <IBiEnvelopeAt class="contact-icon" />
                                    Email
                                </template>
                                <BFormInput
                                    id="floatingEmail"
                                    v-model="form.email"
                                    type="email"
                                    placeholder="Email"
                                    required />
                                    <BFormInvalidFeedback :state="emailValidation">Must be a valid email address</BFormInvalidFeedback>
                            </BFormFloatingLabel>
                            <BFormInput
                                v-model="form.subject" 
                                type="text" 
                                placeholder="Subject" 
                                required 
                                class="my-2"/>
                            <BFormTextarea 
                                v-model="form.content" 
                                placeholder="Message..." 
                                rows="10" 
                                required 
                                class="my-2"/>
                            <div class="d-grid gap-2 mt-2">
                                <BButton variant="primary" type="submit">Send</BButton>
                            </div>
                        </BForm>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
</template>

<style lang="css">
.contact-icon {
    margin-bottom: 4px;
    margin-right: 3px;
}
</style>