<template>
  <header v-if="showHeader" id="header">
    <div class="d-flex flex-column">
      <div class="profile">
        <img src="../image/pig.png" alt="" class="img-fluid rounded-circle" />
        <h1 class="text-light"><router-link to="/">How Save?</router-link></h1>
        <div class="social-links mt-3 text-center">
          <div>
            <a
              class="text-white"
              href="https://github.com/jhchoi1104/Account_book_KB"
              target="_blank"
              style="font-size: 24px"
            >
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>

      <nav id="navbar" class="nav-menu navbar">
        <ul>
          <li>
            <router-link to="/home" class="nav-link scrollto"
              ><i class="fa-regular fa-calendar"></i>
              <span>Home</span></router-link
            >
          </li>
          <li>
            <router-link to="/history" class="nav-link scrollto"
              ><i class="bx bx-user"></i> <span>목록별</span></router-link
            >
          </li>
          <li>
            <router-link to="/Modification" class="nav-link scrollto"
              ><i class="fa-solid fa-keyboard"></i>
              <span>입력</span></router-link
            >
          </li>
          <li>
            <router-link to="/setting" class="nav-link scrollto"
              ><i class="fa-solid fa-id-card"></i>
              <span>프로필설정</span></router-link
            >
          </li>
        </ul>
      </nav>
      <!-- .nav-menu -->
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showHeader = computed(() => route.path !== '/');
</script>

<style scoped>
.li {
  padding-right: 2px;
}
/* 스타일 추가 (기본적으로 필요한 경우) */
</style>
