<template>
  <div class="container mt-5">
    <div class="row" style="min-height: 400px">
      <!-- 왼쪽 프로필 입력 화면 -->
      <div class="col-md-3 text-center">
        <div class="profile-title" style="font-size: 30px; font-weight: 800">
          User Profile
        </div>
        <img
          :src="profile.image || '/src/image/level3-crop.png'"
          alt="Profile Image"
          class="rounded-circle img-fluid mb-3"
          style="width: 150px; height: 150px; object-fit: cover"
        />
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="nickname">닉네임</label>
            <input
              v-model="profile.nickname"
              type="text"
              class="form-control"
              id="nickname"
              placeholder="Your nickname"
            />
          </div>
          <div class="form-group">
            <label for="email">이메일</label>
            <input
              v-model="profile.email"
              type="email"
              class="form-control"
              id="email"
              placeholder="abcd@google.com"
            />
          </div>
          <div class="form-group">
            <label for="phone">전화번호</label>
            <input
              v-model="profile.phone"
              type="text"
              class="form-control"
              id="phone"
              placeholder="010-0000-0000"
            />
          </div>
          <button type="submit" class="btn btn-primary button_style">
            수정
          </button>
        </form>
      </div>
      <!-- 중간 구분선 -->
      <div class="col-md-1 d-flex align-items-center">
        <div class="divider w-100"></div>
      </div>
      <!-- 오른쪽 자산 입력 화면 -->
      <div class="col-md-8">
        <!-- 현재 총 자산 섹션 -->
        <div class="asset-section mb-5">
          <div style="font-size: 30px; font-weight: 800">현재 총 자산</div>
          <form>
            <div class="form-group">
              <label for="assetName">은행 이름</label>
              <input
                type="text"
                class="form-control right_input"
                id="assetName"
                placeholder="은행 이름을 입력하세요"
              />
            </div>
            <div class="form-group">
              <label for="assetValue">계좌 번호</label>
              <input
                type="number"
                class="form-control right_input"
                id="assetValue"
                placeholder="계좌번호를 입력하세요"
              />
            </div>
            <div class="form-group">
              <label for="assetDescription">설명</label>
              <input
                class="form-control right_input"
                id="assetDescription"
                rows="4"
                placeholder="memo"
              />
            </div>
            <button type="submit" class="btn btn-primary button_style">
              저장
            </button>
          </form>
        </div>
        <!-- 과소비 지수 섹션 -->
        <div class="overspending-section">
          <div style="font-size: 30px; font-weight: 800">과소비 지수</div>
          <form>
            <div class="form-group">
              <!-- <label for="overspendingIndex">내 현재 과소비 지수:</label> -->
              <input
                v-model="overspendingIndex"
                type="number"
                class="form-control right_input"
                id="overspendingIndex"
                placeholder="계산된 값을 입력하세요"
              />
              <div v-if="overspendingMessage">
                <p style="font-size: 20px; font-style: bold; color: red">
                  내 현재 과소비 지수: {{ overspendingIndex }}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'; // 여기에 ref를 추가
import { useRouter } from 'vue-router';
import { useprofileStore } from '../stores/profileStore';
import axios from 'axios'; // axios 추가
import '../assets/css/main.css';
import { constructNow } from 'date-fns';

const router = useRouter();
const profileStore = useprofileStore(); // profileStore 인스턴스 생성

const profile = reactive({
  id: '1', // 업데이트하려는 리소스의 ID
  name: '',
  date: '',
  phone: '',
  nickname: '',
  email: '',
  image: '',
});

const showHeader = router.currentRoute.value.path !== '/';

const overspendingIndex = ref(0); // 과소비 지수
const overspendingMessage = ref(''); // 과소비 지수에 따른 메시지

const handleSubmit = async () => {
  const profileItem = {
    date: profile.date,
    name: profile.name,
    phone: profile.phone,
    nickname: profile.nickname,
    email: profile.email,
    image: profile.image,
  };
  await profileStore.addProfile(profile.id, profileItem); // 수정된 함수 호출
};

const fetchBudgetData = async () => {
  try {
    const response = await axios.get('/api/budget');
    const data = response.data;

    budgetData = data; // 서버에서 가져온 데이터의 name을 반응형 상태에 저장
  } catch (error) {
    console.error('예산 데이터 가져오기 실패:', error);
  }
};

const calculateOverspendingIndex = async () => {
  try {
    const response = await axios.get('/api/budget'); // 실제 db.json 파일 경로로 수정
    const data = response.data;

    const saving_1 = data.find((item) => item.category === '저축');
    const salary_1 = data.find((item) => item.category === '월급');

    const saving = saving_1.amount;
    const salary = salary_1.amount;

    overspendingIndex.value = (salary - saving) / salary;
    console.log(overspendingIndex.value);

    if (overspendingIndex.value < 0.5) {
      overspendingMessage.value = '알뜰한 당신 최고에요!';
    } else if (overspendingIndex.value < 0.7) {
      overspendingMessage.value = '적정 단계! 좀 더 분발하세요!';
    } else if (overspendingIndex.value < 0.9) {
      overspendingMessage.value = '과소비 직전!!!';
    } else {
      overspendingMessage.value = '재정 파산...ㅠㅠ';
    }

    if (saving === 0) {
      throw new Error('저축 값이 0이므로 과소비 지수를 계산할 수 없습니다.');
    }
  } catch (error) {
    console.error('과소비 지수 계산 실패:', error);
  }
};

onMounted(async () => {
  try {
    await profileStore.getProfile(profile.id); // profile.id를 인자로 전달하여 데이터 가져오기
    Object.assign(profile, profileStore.profile); // 가져온 프로필 데이터를 profile 상태에 반영
    await calculateOverspendingIndex(); // 과소비 지수 계산 함수 호출
  } catch (error) {
    console.error('프로필 가져오기 실패:', error);
    // 실패 처리 로직 추가
  }
});

watch(
  () => [, ,],
  () => {
    calculateOverspendingIndex();
  }
);
</script>

<style scoped>
.divider {
  border-left: 3px solid grey;
  height: 100%; /* 부모 요소의 높이에 따라 달라질 수 있음 */
  min-height: 450px; /* 최소 높이 설정 */
}

.profile-title {
  margin-bottom: 30px; /* 제목과 폼 사이에 30px 여백 추가 */
}

.right_input {
  width: 300px;
}

label,
input {
  margin: 5px;
}

.button_style {
  background-color: rgb(246, 145, 108);
}
</style>
