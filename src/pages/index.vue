<script setup lang="ts">
</script>

<template>
    <!-- Heading -->
    <BContainer class="root-container-header">
        <BRow class="justify-content-md-center">
            <BCol>
                <h1>Welcome to MultiBlog...</h1>
            </BCol>
        </BRow>
    </BContainer>

    <!-- About -->
    <BContainer class="root-container-details" fluid="lg">
        <BRow class="justify-content-md-center">
            <BCol md="3">
                <BCard class="pt-2">
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
            <BCol md="3">
                <BCard>
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
            <BCol md="3">
                <BCard class="pt-2">
                    <BCardBody>
                        <BRow class="text-center">
                            <a href="https://getbootstrap.com/" target="_blank"><IBiBootstrap class="h1"/></a>
                            <h5>Bootstrap 5</h5>
                            <p>Styling with Bootstrap</p>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol md="3">
                <BCard class="pt-2">
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
    </BContainer>
</template>

<style lang="css" scoped>
.root-container-header {
    margin-top: 100px;
}

.root-container-details {
    margin-block: 100px;
}

.blog-card {
    margin-top: 20px;
    margin-right: 20px;
    max-width: 300px;
    min-width: 300px;
    height: 150px;
}

.logo {
  height: 4em;
  padding: 0.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>