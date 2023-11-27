<template>
    <div class="home_header flex">
       <div class="flex">
            <!-- <img src="" alt=""> -->
            <h1 class="title">粤智助开放平台</h1>
       </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.home_header {
    line-height: 70px;
    height: 100%;
    background: var(--system-header-background);

    & .title{
        color: var(--system-header-text-color);
        font-weight: 300;
    }
}

</style>