<template>
  <router-link to="/home">
    <div class="logo-root ofh">
      <img src="@/assets/images/logo.png" alt="粤智助开放平台" />
      <h1 class="title">粤智助开放平台</h1>
    </div>
  </router-link>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.logo-root {
  display: flex;
  align-items: center;

  height: 70px;

  img {
    max-height: 70%;
    margin: 0px 15px;
  }
  .title {
    // width: 200px;
    color: var(--system-header-text-color);
    font-size: 28px;
    font-weight: 500;
  }
}
</style>
