<template>
    <div class="popup">
        <h2>{{ selectedDate }}</h2>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="income">당일 총 수입:</label>
                <input type="number" id="income" :value="dayCal[0][selectedDate]?.totalIncome ?? 0" @input="updateTotalIncome($event.target.value)" />
            </div>
            <div class="form-group">
                <label for="expense">당일 총 지출:</label>
                <input type="number" id="expense" :value="dayCal[0][selectedDate]?.totalExpense ?? 0" @input="updateTotalExpense($event.target.value)" />
            </div>

            <p>당일 수입 내역 : {{ dayCal[0][selectedDate]?.incomes ?? 0 }}</p>
            <p>당일 지출 내역: {{ dayCal[0][selectedDate]?.expenses ?? 0 }}</p>
            <div class="form-group">
                <button type="submit">저장</button>
                <button type="button" @click="close">취소</button>
            </div>
        </form>
    </div>
</template>
<script setup>
import { ref, getCurrentInstance, defineProps, onMounted, computed } from 'vue';
const income = ref(0);
const expense = ref(0);
const props = defineProps({
    selectedDate: Date,
    events: Array,
    dayCal: Array,
});
const selectedDate = ref(props.selectedDate);

onMounted(() => {
    let event = [];
    props.events.map((e) => {
        event.push(e);
    });
    console.log(props.dayCal[0]);
});

// defineEmits를 사용하여 사용 가능한 이벤트를 명시적으로 정의합니다.
const emits = defineEmits(['close', 'save']);

const close = () => {
    emits('close');
};

const submitForm = () => {
    const transactionData = {
        date: selectedDate.value,
        income: income.value,
        expense: expense.value,
    };
    emits('save', transactionData);
    emits('close');
};
</script>
<style scoped>
.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 9999;
}

.form-group {
    margin-bottom: 10px;
}

button {
    margin-right: 10px;
}
</style>
