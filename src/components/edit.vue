<template>
  <div class="modal">
    <div
      style="
        display: flex;
        flex-direction: column;
        margin-bottom: auto;
        gap: 2px;
      "
    >
      <div class="d-flex justify-content-right">
        <h4><i class="fa-regular fa-pen-to-square"></i> 편집</h4>
      </div>
      <br />
      <h5>날짜</h5>
      <input
        type="date"
        id="date-input"
        v-model="editDate"
        class="form-control"
      />
      <br />

      <h5>분류</h5>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="flexRadio2"
          id="flexRadioDefault2"
          checked
          value="지출"
          v-model="type"
        />
        <label class="form-check-label" for="flexRadioDefault2"> 지출 </label>
      </div>

      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="flexRadio2"
          id="flexRadioDefault2"
          value="수입"
          v-model="type"
        />
        <label class="form-check-label" for="flexRadioDefault2"> 수입 </label>
      </div>
      <br />

      <h5>카테고리</h5>
      <select
        class="form-select"
        aria-label="Default select example"
        v-if="type === '지출'"
        v-model="category"
      >
        <option selected value="">카테고리를 선택하세요.</option>
        <option value="세금">세금</option>
        <option value="식비">식비</option>
        <option value="주거">주거</option>
        <option value="광열">광열</option>
        <option value="보건">보건</option>
        <option value="오락">오락</option>
        <option value="교통">교통</option>
        <option value="통신">통신</option>
        <option value="저축">저축</option>
      </select>
      <select
        class="form-select"
        aria-label="Default select example"
        v-if="type === '수입'"
        v-model="category"
      >
        <option selected disabled value="">카테고리를 선택하세요.</option>
        <option value="월급">월급</option>
        <option value="이자">이자</option>
        <option value="차입">차입</option>
      </select>

      <br />

      <h5>금액</h5>
      <input
        type="number"
        class="form-control"
        id="amount"
        placeholder="금액을 입력하세요."
        name="amount"
        v-model="amount"
      />
      <br />
      <h5>메모</h5>
      <textarea
        id="content"
        class="form-control"
        placeholder="내용을 입력하세요"
        name="content"
        rows="2"
        v-model="memo"
      ></textarea>
      <div class="modal_button">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="apply_edit(editDate, type, category, amount, memo)"
          style="font-size: 1rem; padding: 0px 10px; margin-right: 10px"
        >
          편집
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          style="font-size: 1rem; padding: 0px 10px"
          @click="cancel"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTodoListStore } from '@/stores/history.js';
import { ref, computed } from 'vue';

const TodoListStore = useTodoListStore();
const { apply_edit, cancel } = useTodoListStore();
const editDate_origin = computed(() => TodoListStore.editDate);
const type_origin = computed(() => TodoListStore.type);
const category_origin = computed(() => TodoListStore.category);
const amount_origin = computed(() => TodoListStore.amount);
const memo_origin = computed(() => TodoListStore.memo);
const state_EditComponent_origin = computed(
  () => TodoListStore.state_EditComponent
);

const memo = ref(memo_origin.value);
const amount = ref(amount_origin.value);
const category = ref(category_origin.value);
const type = ref(type_origin.value);
const editDate = ref(editDate_origin.value);
const state_EditComponent = ref(state_EditComponent_origin);
</script>

<style scoped>
/* 모달 창 */
.modal {
  position: fixed;
  top: 0;
  left: 83.3333%;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 반투명한 검정색 배경 */
  display: flex;
  justify-content: flex-end; /* 오른쪽으로 정렬 */
  align-items: flex-start; /* 상단으로 정렬 */
  z-index: 1000; /* 다른 요소들보다 앞에 위치하도록 z-index 설정 */

  width: 16.6667%; /* 전체의 2/12를 차지 (100% / 12 * 2) */
  height: 100vh; /* 화면 높이 100% */
  background: white; /* 모달의 배경색 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25); /* 약간의 그림자 효과 */
  display: flex;
  flex-direction: column; /* 세로 방향으로 내용 정렬 */
  padding: 20px; /* 내부 여백 */
}

.modal_button {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
}
</style>
