<template>
  <div class="d-flex align-items-center gap-2">
    <input
      type="date"
      id="date-input"
      v-model="date1"
      class="form-control"
      @change="changeDate(date1)"
      style="width: 100px; height: 38px"
    />

    <select
      class="form-select form-control"
      v-if="selectionOption === 'total'"
      v-model="selectedValue"
      @change="() => optionFiltering(selectedValue)"
      style="width: 100px; height: 38px"
    >
      <option value="" disabled selected>분류</option>
      <option value="세금">세금</option>
      <option value="식비">식비</option>
      <option value="주거">주거</option>
      <option value="광열">광열</option>
      <option value="보건">보건</option>
      <option value="오락">오락</option>
      <option value="교통">교통</option>
      <option value="통신">통신</option>
      <option value="저축">저축</option>
      <option value="월급">월급</option>
      <option value="이자">이자</option>
      <option value="차입">차입</option>
    </select>
    <select
      class="form-select form-control"
      aria-label="Default select example"
      v-if="selectionOption === 'spend'"
      v-model="selectedValue"
      @change="() => optionFiltering(selectedValue)"
      style="width: 100px; height: 38px"
    >
      <option value="" disabled selected>분류</option>
      <option value="세금">세금</option>
      <option value="식비">식비</option>
      <option value="3">주거</option>
      <option value="광열">광열</option>
      <option value="보건">보건</option>
      <option value="오락">오락</option>
      <option value="교통">교통</option>
      <option value="통신">통신</option>
      <option value="저축">저축</option>
    </select>
    <select
      class="form-select form-control"
      aria-label="Default select example"
      v-if="selectionOption === 'income'"
      v-model="selectedValue"
      @change="() => optionFiltering(selectedValue)"
      style="width: 100px; height: 38px"
    >
      <option value="" disabled selected>분류</option>
      <option value="월급">월급</option>
      <option value="이자">이자</option>
      <option value="차입">차입</option>
    </select>

    <select
      class="form-select form-control"
      aria-label="Default select example"
      v-model="selectionOption"
      @change="() => selectList(selectionOption)"
      style="width: 100px; height: 38px"
    >
      <option value="total">전체</option>
      <option value="spend">지출</option>
      <option value="income">수입</option>
    </select>

    <div>
      <h3></h3>
    </div>
    <div>
      <h3></h3>
    </div>
  </div>

  <table class="table table-hover">
    <thead>
      <th style="width: 100px"></th>
      <th style="width: 100px"></th>
      <th style="width: 100px"></th>
      <th style="width: 100px"></th>
      <th></th>
      <th></th>
    </thead>
    <tbody>
      <tr v-for="item in list" :key="item.id">
        <td>{{ item.date }}</td>
        <td>{{ item.category }}</td>
        <td>{{ item.type }}</td>
        <td v-if="item.type === '지출'" style="color: #e0115f">
          ₩ {{ formatAmount(item.amount) }}
        </td>
        <td v-else style="color: steelblue">
          ₩ {{ formatAmount(item.amount) }}
        </td>
        <td>{{ item.memo }}</td>
        <td>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="chg_edit(item.id)"
            style="
              margin-left: 60px;
              font-size: 0.9rem;
              padding: 0px 10px 20px;
              width: 35px;
              height: 35px;
            "
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            style="
              margin-left: 5px;
              font-size: 0.9rem;
              padding: 0px 10px 20px;
              width: 35px;
              height: 35px;
            "
            @click="deleteList(item.id)"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTodoListStore } from '@/stores/history.js';
import VueDatePicker from '@vuepic/vue-datepicker';

const listStore = useTodoListStore();
const {
  chg_edit,
  deleteList,
  optionFiltering,
  selectList,
  changeDate,
  selectedValue,
  selectionOption,
  date1,
} = useTodoListStore();

const list = computed(() => listStore.list);
const state_EditComponent = computed(() => listStore.state_EditComponent);
const editDate = computed(() => listStore.editDate);

const formatAmount = (amount) => {
  return new Intl.NumberFormat().format(amount);
};

// const selectionOption = computed(() => listStore.selectionOption);
</script>
