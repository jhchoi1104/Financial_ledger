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
                v-model.trim="profile.name"
                required
              />
            </div>
            <div class="input-group">
              <input
                class="input--style-3 js-datepicker"
                type="text"
                placeholder="예) 2000-11-22"
                v-model.trim="profile.date"
                @input="validateDate"
                required
              />
              <div v-if="!isDateValid" class="text-danger">
                올바른 날짜 형식(YYYY-MM-DD)으로 입력해주세요.
              </div>
              <i class="zmdi zmdi-calendar-note input-icon js-btn-calendar"></i>
            </div>
            <div class="input-group">
              <input
                class="input--style-3"
                type="text"
                placeholder="휴대폰 번호 (예: 010-1234-5678)"
                v-model.trim="profile.phone"
                @input="validatePhoneNumber"
                required
              />
              <div v-if="!isPhoneNumberValid" class="text-danger">
                올바른 전화번호 형식(010-1234-5678)으로 입력해주세요.
              </div>
            </div>
            <div class="input-group">
              <input
                class="input--style-3"
                type="text"
                placeholder="닉네임"
                v-model.trim="profile.nickname"
                required
              />
            </div>

            <div class="p-t-10">
              <button
                class="btn btn--pill btn--green"
                type="submit"
                :disabled="!isPhoneNumberValid || !isDateValid"
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

const router = useRouter();
const profileStore = useprofileStore(); // profileStore 인스턴스 생성

const profile = reactive({
  id: 1, // 가져올 프로필의 ID (실제로 사용하는 방식에 맞게 변경)
  name: '',
  phone: '',
  date: '',
  nickname: '',
});

const showHeader = useRouter().currentRoute.value.path !== '/';

const isPhoneNumberValid = ref(true);
const isDateValid = ref(true);

const validatePhoneNumber = () => {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  isPhoneNumberValid.value = phoneRegex.test(profile.phone);
};

const validateDate = () => {
  const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;
  isDateValid.value = yyyymmddRegex.test(profile.date);
};

const handleSubmit = async () => {
  if (!isPhoneNumberValid.value || !isDateValid.value) return;

  const profileItem = {
    name: profile.name,
    phone: profile.phone,
    date: profile.date,
    nickname: profile.nickname,
  };

  try {
    await profileStore.addProfile(profile.id, profileItem);
    router.push('/home');
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    // 실패 처리 로직 추가
  }
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
