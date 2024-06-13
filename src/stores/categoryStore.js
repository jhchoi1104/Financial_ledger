import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, computed } from 'vue';

export const useCategoryStore = defineStore('categoryStore', () => {
  // 반응형 상태
  const incomeCategory = ref([]);
  const expenseCategory = ref([]);

  // 액션
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/db.json');
      incomeCategory.value = response.data.incomeCategory;
      expenseCategory.value = response.data.expenseCategory;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // 게터
  const getFilteredCategories = (type) => {
    if (type === '수입') {
      return incomeCategory.value;
    } else if (type === '지출') {
      return expenseCategory.value;
    } else {
      return [];
    }
  };

  return {
    incomeCategory,
    expenseCategory,
    fetchCategories,
    getFilteredCategories,
  };
});
