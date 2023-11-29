<template>
    <div class="home_header flex flex-between">
       <Logo />

       <User />
    </div>
</template>

<script setup lang="ts">
import Logo from './logo.vue'
import User from './userInfo.vue'
</script>

<style lang="scss" scoped>
.home_header {
    height: 100%;
    background: var(--system-header-background);
}

</style>