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
            <br />
            <div class="form-group">
                <button type="submit">저장</button>
                <button type="button" @click="close">취소</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch, computed } from 'vue';

const props = defineProps({
    selectedDate: String,
    events: Array,
    dayCal: Array,
});

const selectedDate = ref(props.selectedDate);
const incomeDetails = ref('');
const expenseDetails = ref('');

// Computed properties to calculate total income and expense
const totalIncome = computed(() => {
    const incomes = props.dayCal[0][selectedDate.value]?.incomes || [];
    return incomes.reduce((sum, item) => sum + item.amount, 0);
});

const totalExpense = computed(() => {
    const expenses = props.dayCal[0][selectedDate.value]?.expenses || [];
    return expenses.reduce((sum, item) => sum + item.amount, 0);
});

// Populate income and expense details based on selectedDate
const updateDetails = () => {
    const dayData = props.dayCal[0][selectedDate.value] || { incomes: [], expenses: [] };
    incomeDetails.value = dayData.incomes.map((item) => `${item.category}: ${item.amount}`).join('\n');
    expenseDetails.value = dayData.expenses.map((item) => `${item.category}: ${item.amount}`).join('\n');
};

onMounted(() => {
    updateDetails();
});

watch(selectedDate, updateDetails);

const emits = defineEmits(['close', 'save']);

const close = () => {
    emits('close');
};

const submitForm = () => {
    // Parse income and expense details back to array objects
    const parseDetails = (details) => {
        return details.split('\n').map((line) => {
            const [category, amount] = line.split(': ');
            return { category, amount: Number(amount) };
        });
    };

    const transactionData = {
        date: selectedDate.value,
        incomes: parseDetails(incomeDetails.value),
        expenses: parseDetails(expenseDetails.value),
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

textarea {
    width: 100%;
    resize: none;
}
</style>
