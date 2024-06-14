// stores/profileStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useprofileStore = defineStore('profileStore', () => {
  // 반응형 상태
  const profile = ref([]);

  // 액션
  const addProfile = async (updatedProfile) => {
    try {
      // 서버에 데이터를 전송 (PUT 요청)
      const response = await axios.put(
        `http://localhost:3000/profile/1`,
        updatedProfile
      );
      alert('프로필 저장되었습니다.');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/profile/1`);
      profile.value = response.data; // 가져온 프로필 데이터를 상태에 저장
    } catch (error) {
      console.error('프로필 가져오기 실패:', error);
    }
  };

  return {
    profile,
    addProfile,
    getProfile,
  };
});
