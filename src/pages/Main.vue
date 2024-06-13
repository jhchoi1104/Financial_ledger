<template>
  <div class="container" style="padding-top: 50px">
    <Header v-if="showHeader" />
    <div class="wrapper">
      <div class="card card-3">
        <div class="card-heading"></div>
        <div class="card-body">
          <h2 class="title">간단 프로필 설정</h2>
          <form @submit.prevent="handleSubmit">
            <div class="input-group">
              <input
                class="input--style-3"
                type="text"
                placeholder="이름"
                v-model="profile.name"
                required
              />
            </div>
            <div class="input-group">
              <input
                class="input--style-3 js-datepicker"
                type="text"
                placeholder="생일"
                v-model="profile.date"
              />
              <i class="zmdi zmdi-calendar-note input-icon js-btn-calendar"></i>
            </div>
            <div class="input-group">
              <input
                class="input--style-3"
                type="text"
                placeholder="휴대폰 번호"
                v-model="profile.phone"
                @input="validatePhoneNumber"
                required
              />
              <div v-if="!isPhoneNumberValid" class="text-danger">
                - 입력 부탁드립니다
              </div>
            </div>
            <div class="input-group">
              <input
                class="input--style-3"
                type="text"
                placeholder="닉네임"
                v-model="profile.nickname"
                required
              />
            </div>

            <div class="p-t-10">
              <button
                class="btn btn--pill btn--green"
                type="submit"
                :disabled="!isPhoneNumberValid"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Header from '../components/Header.vue';
import { useRouter } from 'vue-router';
import { useprofileStore } from '../stores/profileStore';
import '../assets/css/main.css';

const router = useRouter();
const profileStore = useprofileStore(); // profileStore 인스턴스 생성

const profile = reactive({
  id: '1', // 업데이트하려는 리소스의 ID
  name: '',
  date: '',
  phone: '',
  nickname: '',
});

const showHeader = router.currentRoute.value.path !== '/';

const isPhoneNumberValid = ref(true);

const validatePhoneNumber = () => {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  isPhoneNumberValid.value = phoneRegex.test(profile.phone);
};

const handleSubmit = async () => {
  if (!isPhoneNumberValid.value) return;

  const profileItem = {
    date: profile.date,
    name: profile.name,
    phone: profile.phone,
    nickname: profile.nickname,
  };
  await profileStore.addProfile(profile.id, profileItem);
  router.push('/home');
};
</script>

<style scoped>
.container {
  width: 1000px;
}

.text-danger {
  color: red;
  margin-top: 5px;
}
</style>
