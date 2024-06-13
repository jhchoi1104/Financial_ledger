<template>
    <div class="container">
        <div class="d-flex justify-content-between align-items-center" style="height: 100px">
            <div class="b" style="flex: 1; text-align: center; border: 1px solid">
                OOO님의 총자산 : {{}}
                <br />

                {{ thisMonth }} 월 총 지출: {{ totalExpense }}
                <br />

                {{ thisMonth }} 월 총 수입: {{ totalIncome }}<br />
                {{ thisMonth }} 월 수입 및 지출 통계 : {{ asset }}<br />
                <!-- 일자별 수입과 지출 : {{ dayCal }} -->
            </div>
        </div>
    </div>
    <button @click="updateDataToServer(updatedData)">전송</button>
    <div id="calendar">
        <FullCalendar ref="calendar" :options="calendarOptions" :events="events" />
    </div>
    <CalendarPopup v-if="showPopup" @close="closePopup" @save="saveTransaction" :selectedDate="selectedDate" :events="events" :dayCal="dayCal" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarPopup from '@/components/CalendarPopup.vue';
import axios from 'axios';

const asset = ref(0);
const totalIncome = ref(0);
const totalExpense = ref(0);
const showPopup = ref(false);
const selectedDate = ref(null);
const calendar = ref(null);
const events = ref([]);
const dayCal = ref([]);
const thisMonth = ref(0);

const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: function (info) {
        showPopup.value = true;
        // alert("Clicked on: " + info.dateStr);
        selectedDate.value = info.dateStr;
    },
    events: [],
});
const axiosEvents = async () => {
    try {
        const response = await axios.get('http://localhost:3000/budget');
        const data = response.data;
        const eventsArray = [];
        // 일자별로 수입과 지출을 계산하여 이벤트에 추가합니다.
        const dailyCalc = {};
        data.forEach((dailyData) => {
            const date = dailyData.date ? dailyData.date.substring(0, 10) : null; // 날짜 문자열에서 시간 부분을 제외합니다.
            const income = dailyData.income;
            const expense = dailyData.expense;

            if (!dailyCalc[date]) {
                dailyCalc[date] = { incomes: [], expenses: [], totalIncome: 0, totalExpense: 0 };
            }
            dailyCalc[date].incomes.push(income);
            dailyCalc[date].expenses.push(expense);
            dailyCalc[date].totalIncome += income;
            dailyCalc[date].totalExpense += expense;
        });

        // 해당 월의 총 수입과 지출 계산
        const currentMonth = new Date().getMonth() + 1; // 현재 월 가져오기 (1월부터 시작)
        totalIncome.value = 0;
        totalExpense.value = 0;

        thisMonth.value = currentMonth;

        for (const date in dailyCalc) {
            const month = new Date(date).getMonth() + 1;
            if (month === currentMonth) {
                totalIncome.value += dailyCalc[date].totalIncome;
                totalExpense.value += dailyCalc[date].totalExpense;
            }
        }

        // 이번 달 총 수입과 지출을 반영
        asset.value = totalIncome.value - totalExpense.value;

        // 일자별로 계산된 수입과 지출을 이벤트에 추가합니다.
        for (const date in dailyCalc) {
            const incomeDetails = dailyCalc[date].incomes.join(', ');
            const expenseDetails = dailyCalc[date].expenses.join(', ');
            eventsArray.push({
                dateAmount: `${date}: 총 수입 - ${dailyCalc[date].totalIncome}, 총 지출 - ${dailyCalc[date].totalExpense} (수입 내역: ${incomeDetails}, 지출 내역: ${expenseDetails})`,
                date: date,
            });
        }

        dayCal.value.push(dailyCalc);
        // 캘린더에 표시할 이벤트 데이터 설정
        events.value = eventsArray;
    } catch (error) {
        console.error('Error fetching events:', error);
    }

    const d = dayCal.value[0];

    for (const date in d) {
        console.log(dayCal.value[0]);
        calendarOptions.value.events.push({ title: `수입: ${dayCal.value[0][date].totalIncome} 지출: ${dayCal.value[0][date].totalExpense}`, start: date, end: date });
    }
    // console.log(calendarOptions.value.events);
};

onMounted(axiosEvents);

const updatedData = {
    id: 8888,
    date: '2020-01-01T02:56:00.574Z',
    expense: 100000,
};

const updateDataToServer = async (updatedData) => {
    try {
        const response = await axios.put(`http://localhost:3000/budget/${updatedData.id}`, updatedData);
        console.log('Data updated successfully:', response.data);
    } catch (error) {
        console.error('Error updating data:', error);
    }
};

function closePopup() {
    showPopup.value = false;
}

function saveTransaction(transactionData) {
    console.log('Saving transaction:', transactionData);
}
</script>

<style scoped>
.container {
    background-color: violet;
    margin-top: 100px;
}
</style>
