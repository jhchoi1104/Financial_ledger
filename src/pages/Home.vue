<template>
  <div class="container" data-aos="fade-left">
    <div
      class="d-flex justify-content-between align-items-center"
      style="height: 100px"
    >
      <div class="b" style="flex: 1; text-align: center; border: 1px solid">
        님의 총자산 : {{ asset }}
        <br />
        {{ thisMonth }} 월 총 지출: {{ totalExpense }}
        <br />
        {{ thisMonth }} 월 총 수입: {{ totalIncome }}<br />
        {{ thisMonth }} 월 수입 및 지출 통계 : {{ asset }}<br />
      </div>
    </div>
  </div>
  <div id="calendar" data-aos="fade-left">
    <FullCalendar ref="calendar" :options="calendarOptions" :events="events" />
  </div>
  <CalendarPopup
    v-if="showPopup"
    @close="closePopup"
    @save="saveTransaction"
    :selectedDate="selectedDate"
    :events="events"
    :dayCal="dayCal"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
    selectedDate.value = info.dateStr;
  },
  events: [],
});

const axiosEvents = async () => {
  try {
    const response = await axios.get('http://localhost:3000/budget');
    const data = response.data;

    const eventsArray = [];
    const dailyCalc = {};
    data.forEach((dailyData) => {
      const date = dailyData.date ? dailyData.date.substring(0, 10) : null;
      const income = dailyData.income;
      const expense = dailyData.expense;

      if (!dailyCalc[date]) {
        dailyCalc[date] = {
          incomes: [],
          expenses: [],
          totalIncome: 0,
          totalExpense: 0,
        };
      }
      dailyCalc[date].incomes.push(income);
      dailyCalc[date].expenses.push(expense);
      dailyCalc[date].totalIncome += income;
      dailyCalc[date].totalExpense += expense;
    });

    const currentMonth = new Date().getMonth() + 1;
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

    asset.value = totalIncome.value - totalExpense.value;

    for (const date in dailyCalc) {
      const incomeDetails = dailyCalc[date].incomes.join(', ');
      const expenseDetails = dailyCalc[date].expenses.join(', ');
      eventsArray.push({
        dateAmount: `${date}: 총 수입 - ${dailyCalc[date].totalIncome}, 총 지출 - ${dailyCalc[date].totalExpense} (수입 내역: ${incomeDetails}, 지출 내역: ${expenseDetails})`,
        date: date,
      });
    }

    dayCal.value.push(dailyCalc);
    events.value = eventsArray;
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  const d = dayCal.value[0];

  for (const date in d) {
    calendarOptions.value.events.push({
      title: `수입: ${dayCal.value[0][date].totalIncome} 지출: ${dayCal.value[0][date].totalExpense}`,
      start: date,
      end: date,
    });
  }
};

onMounted(axiosEvents);

function closePopup() {
  showPopup.value = false;
}

function saveTransaction(transactionData) {
  console.log('Saving transaction:', transactionData);
}
</script>

<style scoped>
.b {
  background-color: seagreen;
  font-size: 2rem;
}

.container {
  margin-top: 100px;
}
</style>
