<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import NavHeader from './components/NavHeader.vue';

onMounted(() => {
    const navbar = document.querySelector('.navbar');
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-sticky');
        } else {
            navbar.classList.remove('navbar-sticky');
        }
    })
});

onBeforeUnmount(() => {
    const navbar = document.querySelector('.navbar');
    window.removeEventListener("scroll",() =>{
        navbar.classList.remove('navbar-sticky');
    })
})
</script>

<template>
  <header>
    <NavHeader />
  </header>
  <RouterView />
  <BPopoverOrchestrator />
  <BToastOrchestrator />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
