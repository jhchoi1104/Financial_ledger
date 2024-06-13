<template>
  <div class="time">
    <form @submit.prevent="submitForm" class="p-3 bg-light rounded">
      <div class="mb-3">
        <label for="datePicker" class="form-label">날짜</label>
        <VueDatePicker
          v-model="date"
          :enable-time-picker="false"
          locale="ko"
          :autoclose="false"
          id="datePicker"
          class="form-control"
        />
      </div>

      <div class="mb-3">
        <label for="typeSelect" class="form-label">유형</label>
        <select v-model="type" class="form-select" id="typeSelect" required>
          <option value="" disabled>수입, 지출</option>
          <option value="수입">수입</option>
          <option value="지출">지출</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="categorySelect" class="form-label">카테고리</label>
        <select
          v-model="category"
          class="form-select"
          id="categorySelect"
          required
        >
          <option value="" disabled>카테고리</option>
          <option
            v-for="item in filteredCategories"
            :key="item.id"
            :value="item.category"
          >
            {{ item.category }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="detailCategoryInput" class="form-label">자세한 내용</label>
        <input
          class="form-control"
          id="detailCategoryInput"
          v-model="detailCategory"
          placeholder="자세한 내용"
        />
      </div>

      <div class="mb-3">
        <label for="amountInput" class="form-label">금액</label>
        <div class="input-group">
          <input
            v-model="formattedAmount"
            @input="formatAmount"
            @focus="unformatAmount"
            @blur="formatAmount"
            class="form-control"
            type="text"
            placeholder="금액"
            id="amountInput"
            required
          />
          <span class="input-group-text">원</span>
        </div>
      </div>

      <div class="mb-3">
        <label for="memoInput" class="form-label">메모</label>
        <input
          class="form-control"
          v-model="memo"
          type="text"
          placeholder="메모"
          @keyup.enter="checkMemoField"
          id="memoInput"
        />
      </div>

      <div class="d-flex justify-content-between">
        <button type="submit" class="btn btn-primary">저장</button>
        <button type="button" @click="cancelForm" class="btn btn-secondary">
          취소
        </button>
      </div>
    </form>

    <!-- 저장 완료 알림 메시지 -->
    <div v-if="isSaved" class="alert alert-success mt-3" role="alert">
      저장이 완료되었습니다.
      <button @click="goToHomePage" type="button" class="btn btn-primary">
        확인
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { format } from 'date-fns'; // date-fns에서 format 함수 가져오기
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useRouter } from 'vue-router';
import { useDateStore } from '@/stores/dateStore';
import { useCategoryStore } from '@/stores/categoryStore';

const router = useRouter();
const dateStore = useDateStore();
const categoryStore = useCategoryStore();

const date = ref(new Date());
const type = ref('');
const category = ref('');
const detailCategory = ref('');
const amount = ref(0);
const memo = ref('');
const formattedAmount = ref('');
const isSaved = ref(false);

const filteredCategories = ref([]);

onMounted(() => {
  categoryStore.fetchCategories();
});

watchEffect(() => {
  filteredCategories.value = categoryStore.getFilteredCategories(type.value);

  if (type.value === '수입') {
    const defaultIncomeCategory = categoryStore.incomeCategory.find(
      (item) => item.category === '월급'
    );
    if (defaultIncomeCategory) {
      category.value = defaultIncomeCategory.category;
    }
  } else if (type.value === '지출') {
    const defaultExpenseCategory = categoryStore.expenseCategory.find(
      (item) => item.category === '세금'
    );
    if (defaultExpenseCategory) {
      category.value = defaultExpenseCategory.category;
    }
  }
});

const formatAmount = () => {
  if (!formattedAmount.value) return;
  const numberValue = parseFloat(formattedAmount.value.replace(/,/g, ''));
  formattedAmount.value = numberValue.toLocaleString('ko-KR');
  amount.value = numberValue;
};

const unformatAmount = () => {
  formattedAmount.value = formattedAmount.value.replace(/,/g, '');
};

const submitForm = () => {
  const formattedDate = format(new Date(date.value), 'yyyy-MM-dd'); // 날짜를 yyyy-MM-dd 형식으로 포맷팅

  const budgetItem = {
    date: formattedDate,
    type: type.value,
    category: category.value,
    detailCategory: detailCategory.value,
    amount: amount.value,
    memo: memo.value,
  };
  dateStore.addBudgetItem(budgetItem);
  isSaved.value = true;
};

const cancelForm = () => {
  date.value = new Date();
  type.value = '';
  category.value = '';
  detailCategory.value = '';
  formattedAmount.value = '';
  amount.value = 0;
  memo.value = '';
  isSaved.value = false;
};

const checkMemoField = (event) => {
  if (event.target.value.trim() !== '') {
    submitForm();
  }
};

const goToHomePage = () => {
  router.push('/home');
};
</script>

<style scoped>
.time {
  width: 500px;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /*수직 가운데 정렬*/
  height: 100px;
  /* background: linear-gradient(to right, #ff7e5f, #feb47b);  */
}

.bg-light {
  background-color: #f8f9fa !important;
}

.rounded {
  border-radius: 0.25rem !important;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}
</style>
