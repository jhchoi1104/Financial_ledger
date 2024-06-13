<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Header from './components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 경로가 '/' 인 경우에만 padding-left: 0 으로 설정
const isHomePage = router.currentRoute.value.path === '/';
</script>

<template>
  <div class="wrapper">
    <Header />
    <div class="abc" :style="{ 'padding-left': isHomePage ? '0' : '300px' }">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1199px) {
  .wrapper {
    padding-left: 300px;

    background: rgb(198, 246, 255);
    /* linear-gradient(
      /* to right,
      rgb(50, 224, 255),
      rgb(198, 246, 255)
    );*/
  }
}
@media (max-width: 1199px) {
  .wrapper {
    padding-top: 40px;
    background: rgb(198, 246, 255);
  }
}
</style>
