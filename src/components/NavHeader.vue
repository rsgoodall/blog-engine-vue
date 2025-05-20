<script setup lang="ts">
import { useAuthStore } from '../stores';
const store = useAuthStore();

</script>

<template>
    <BNavbar fixed="top">
        <BNavbarBrand href="/">MultiBlog</BNavbarBrand>
        <BNavbarNav>
            <BNavItem :to="{ name: 'Search' }"><IBiSearch width="20" height="20" class="nav-header-icon"/>Search</BNavItem>
            <BNavItem v-if="store.user.name !== ''" :to="{ name: 'Home' }"><IBiHouse class="nav-header-icon"/>Home</BNavItem>
            <!-- <BNavItem :to="{ name: 'Home'}"><IBiHouse class="nav-header-icon"/>Home</BNavItem> -->
            <BNavItem v-if="store.user.name === ''" :to="{ name: 'Login'}"><IBiPerson width="20" height="20" class="nav-header-icon" />Log In</BNavItem>
            <BNavItemDropdown v-else right>
                <template #button-content>
                    <IBiPerson width="20" height="20" class="nav-header-icon" />{{ store.user.name }}
                </template>
                <BDropdownItem :to="{ name: 'Admin'}"><IBiGear class="nav-header-icon" />Admin</BDropdownItem>
                <BDropdownItem @click="store.logout()"><IBiDoorClosed class="nav-header-icon" />Logout</BDropdownItem>
            </BNavItemDropdown>
        </BNavbarNav>

    </BNavbar>
</template>

<style lang="css">
.nav-header-icon {
    margin-bottom: 4px;
    margin-right: 3px;
}
</style>