import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useprofileStore = defineStore('profileStore', () => {
  // 반응형 상태
  const profile = ref([]);

  // 액션
  const addProfile = async (id, updatedProfile) => {
    try {
      // 서버에 데이터를 전송 (PUT 요청)
      const response = await axios.put(
        `http://localhost:3000/profile/${id}`,
        updatedProfile
      );

      // 서버 응답이 성공적일 경우 프로필 배열 업데이트
      const index = profile.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        profile.value[index] = response.data;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return {
    profile,
    addProfile,
  };
});
