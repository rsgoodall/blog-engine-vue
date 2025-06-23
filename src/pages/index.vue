<script setup lang="ts">
const brand = import.meta.env.VITE_APP_BRAND;
</script>

<template>
    <!-- Heading -->
    <BContainer class="root-container-header" fluid="sm">
        <BRow class="justify-content-md-center">
            <BCol sm="10" offset-sm="3" md="6" offset-md="2">
                <h1>Welcome to {{ brand }}...</h1>
            </BCol>
        </BRow>
    </BContainer>

    <!-- About -->
    <BContainer class="root-container-details" fluid="lg">
        <BRow class="justify-content-md-center align-items-center">
            <BCol sm="6" offset-sm="3" md="4" offset-md="0" lg="3">
                <BCard class="blog-card pt-2 mb-4 mx-4">
                    <BCardBody>
                        <BRow class="text-center">
                            <IBiPeople class="h1"/>
                        </BRow>
                        <BRow class="text-center">
                            <h5>Multi-Tenant Blog</h5>
                            <p>Multi User Blog Engine</p>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol sm="6" offset-sm="3" md="4" offset-md="0" lg="3">
                <BCard class="blog-card mb-4 mx-4">
                    <BCardBody>
                        <BRow class="text-center">
                            <a href="https://vuejs.org/" target="_blank">
                                <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
                            </a>
                        </BRow>
                        <BRow class="text-center">
                            <h5>VueJS 3</h5>
                            <p>Advanced FrontEnd with VueJS</p>
                        </BRow>
                    </BCardBody>

                </BCard>
            </BCol>
            <BCol sm="6" offset-sm="3" md="4" offset-md="0" lg="3">
                <BCard class="blog-card pt-2 mb-4 mx-4">
                    <BCardBody>
                        <BRow class="text-center">
                            <a href="https://getbootstrap.com/" target="_blank"><IBiBootstrap class="h1"/></a>
                            <h5>Bootstrap 5</h5>
                            <p>Styling with Bootstrap</p>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol sm="6" offset-sm="3" md="4" offset-md="0" lg="3">
                <BCard class="blog-card pt-2 mb-4 mx-4">
                    <BCardBody>
                        <BRow class="text-center">
                            <IBiHddRack class="h1" />
                            <h5>ExpressJS & MongoDB</h5>
                            <p>Perfomant Backend</p>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BContainer fluid="sm">
    <BContainer class="root-container-details">
        <BRow class="justify-content-center">
            <BCol sm="6" offset-sm="2" md="4" offset-md="1" class="mb-3">
                <h2>Don't have an account?<br> Join us today!  <router-link :to="{ name: 'Register'}"><BButton variant="primary">Register</BButton></router-link></h2>
            </BCol>
            <BCol sm="6" offset-sm="2" md="4" offset-md="1" class="mb-3">
                <h2>Have a question?<br> Let us know!  <router-link :to="{ name: 'Contact'}"><BButton variant="primary">Contact Us</BButton></router-link></h2>
            </BCol>
        </BRow>
    </BContainer>
</template>

<style lang="css" scoped>
.root-container-header {
    margin-top: 100px;
    margin-bottom: 100px;
}

.root-container-details {
    margin-block: 50px;
}

.blog-card {
    margin-right: 20px;
    max-width: 260px;
    min-width: 260px;
    height: 220px;
}

.logo {
  height: 4em;
  padding: 0.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>