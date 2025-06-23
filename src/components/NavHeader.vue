<script setup lang="ts">
import { useAuthStore } from '../stores';
const store = useAuthStore();
const brand = import.meta.env.VITE_APP_BRAND;

</script>

<template>
    <BNavbar fixed="top" toggleable="sm" variant="white">
        <BNavbarBrand href="/">{{ brand}}</BNavbarBrand>
        <BNavbarToggle target="nav-collapse" />
        <BCollapse id="nav-collapse" is-nav>
            <BNavbarNav class="ms-auto mb-2 mb-lg-0">
            <BNavItem :to="{ name: 'Search' }"><IBiSearch width="20" height="20" class="nav-header-icon"/>Search</BNavItem>
            <BNavItem v-if="store.user.name !== ''" :to="{ name: 'Home' }"><IBiHouse class="nav-header-icon"/>Home</BNavItem>
            <!-- <BNavItem :to="{ name: 'Home'}"><IBiHouse class="nav-header-icon"/>Home</BNavItem> -->
            <BNavItem v-if="store.user.name === ''" :to="{ name: 'Login'}"><IBiPerson width="20" height="20" class="nav-header-icon" />Log In</BNavItem>
            <BNavItemDropdown v-else right>
                <template #button-content>
                    <IBiPerson width="20" height="20" class="nav-header-icon" />{{ store.user.name }}
                </template>
                <BDropdownItem :to="{ name: 'Admin'}"><IBiGear class="nav-header-icon" />Admin</BDropdownItem>
                <BDropdownItem :to="{ name: 'Contact'}"><IBiEnvelope class="nav-header-icon" />Contact</BDropdownItem>
                <BDropdownItem @click="store.logout()"><IBiDoorClosed class="nav-header-icon" />Logout</BDropdownItem>
            </BNavItemDropdown>
        </BNavbarNav>
        </BCollapse>
    </BNavbar>
</template>

<style lang="css">
.nav-header-icon {
    margin-bottom: 4px;
    margin-right: 3px;
}
</style>