<template>
  <div class="filter_group">
    <h5>분류</h5>
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        name="flexRadioDefault"
        id="flexRadioDefault1"
        checked
        value="total"
        @click="extractTotalList"
        v-model="selectionOption"
      />
      <label class="form-check-label" for="flexRadioDefault1"> 전체 </label>
    </div>
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        name="flexRadioDefault"
        id="flexRadioDefault2"
        value="spend"
        @click="extractSpendLIst"
        v-model="selectionOption"
      />
      <label class="form-check-label" for="flexRadioDefault2"> 지출 </label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        name="flexRadioDefault"
        id="flexRadioDefault2"
        value="income"
        @click="extractIncomeList"
        v-model="selectionOption"
      />
      <label class="form-check-label" for="flexRadioDefault2"> 입금 </label>
    </div>

    <br />

    <h5>기간</h5>
    <input
      type="date"
      id="date-input"
      v-model="startDate"
      class="form-control"
      @change="() => startDate_change(startDate)"
    />
    ~
    <input
      type="date"
      id="date-input"
      v-model="finishDate"
      class="form-control"
      @change="() => finishDate_change(finishDate)"
    />
    <button
      type="button"
      class="btn btn-primary btn-sm"
      style="margin-left: 92px; margin-top: 5px"
      @click="changeDate"
    >
      적용
    </button>
    <button
      type="button"
      class="btn btn-secondary btn-sm"
      style="margin-left: 5px; margin-top: 5px"
      @click="resetDate"
    >
      초기화
    </button>
    <br /><br />

    <h5>카테고리</h5>
    <select
      class="form-select"
      aria-label="Default select example"
      v-if="selectionOption === 'total'"
      v-model="selectedValue"
      @change="() => optionFiltering(selectedValue)"
    >
      <option selected>카테고리를 선택하세요.</option>
      <option value="세금">세금</option>
      <option value="식비">식비</option>
      <option value="주거">주거</option>
      <option value="광열">광열</option>
      <option value="보건">보건</option>
      <option value="오락">오락</option>
      <option value="교통">교통</option>
      <option value="통신">통신</option>
      <option value="월급">월급</option>
      <option value="이자">이자</option>
      <option value="차입">차입</option>
    </select>
    <select
      class="form-select"
      aria-label="Default select example"
      v-if="selectionOption === 'spend'"
    >
      <option selected>카테고리를 선택하세요.</option>
      <option value="세금">세금</option>
      <option value="식비">식비</option>
      <option value="3">주거</option>
      <option value="광열">광열</option>
      <option value="보건">보건</option>
      <option value="오락">오락</option>
      <option value="교통">교통</option>
      <option value="통신">통신</option>
    </select>
    <select
      class="form-select"
      aria-label="Default select example"
      v-if="selectionOption === 'income'"
    >
      <option selected>카테고리를 선택하세요.</option>
      <option value="월급">월급</option>
      <option value="이자">이자</option>
      <option value="차입">차입</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTodoListStore } from '@/stores/history.js';

const {
  extractIncomeList,
  extractSpendLIst,
  extractTotalList,
  changeDate,
  resetDate,
  startDate_change,
  finishDate_change,
  optionFiltering,
  startDate,
  finishDate,
  selectedValue,
} = useTodoListStore();

// 분류(전체, 지출, 수입)
const selectionOption = ref('total');
</script>
