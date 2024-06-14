import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import moment from 'moment';

export const useTodoListStore = defineStore('deal_list', () => {
  const BASEURI = '/api/budget';
  const state = reactive({
    list: [],
    state_EditComponent: false,
    editDate: '',
    type: '지출',
    category: '',
    amount: 0,
    memo: '',
    id: '',
    modal_state: false,
  });

  const sortDate = (list) => {
    const sorted_list = list
      .sort(function (a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .reverse();
    return sorted_list;
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.list = response.data;
      state.list = sortDate(state.list);
    } catch (error) {
      alert('에러발생 : ' + error);
    }
  };

  const deleteList = async (id) => {
    try {
      const response = await axios.delete(BASEURI + `/${id}`);
      let index = state.list.findIndex((deal) => deal.id === id);
      state.list.splice(index, 1);
    } catch (error) {
      alert('에러발생 :', error);
    }
  };

  const extractTotalList = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.list = response.data;
    } catch (error) {
      alert('에러발생 : ' + error);
    }
  };

  const extractSpendLIst = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.list = response.data;
      state.list = state.list.filter((item) => item.type === '지출');
    } catch (error) {
      alert('에러발생 : ' + error);
    }
  };

  const extractIncomeList = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.list = response.data;
      state.list = state.list.filter((item) => item.type === '수입');
    } catch (error) {
      alert('에러발생 : ' + error);
    }
  };

  const today_origin = new Date();
  const today = today_origin.toISOString().split('T')[0];

  console.log(today);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const twoWeeksString = twoWeeksAgo;
  const todayString = today;

  const startDate = ref(twoWeeksString);
  const finishDate = ref(todayString);

  const startDate_change = (sDate) => {
    startDate.value = sDate;
    console.log(sDate);
  };

  const finishDate_change = (fDate) => {
    finishDate.value = fDate;
  };

  const changeDate = async (date) => {
    try {
      const response = await axios.get(BASEURI);
      state.list = response.data;
      state.list = sortDate(state.list);

      state.list = state.list.filter((item) =>
        moment(item.date).isSame(date, 'day')
      );
    } catch (error) {
      alert('에러발생 : ' + error);
    }
  };

  const resetDate = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.list = response.data;
      state.list = sortDate(state.list);

      const startDate_m = moment(twoWeeksString);
      const finishDate_m = moment(todayString);

      state.list = state.list.filter((item) => {
        const itemDate = moment(item.date);
        console.log(itemDate.isBetween(startDate_m, finishDate_m));
        return itemDate.isBetween(startDate_m, finishDate_m);
      });
    } catch (error) {
      alert('에러발생 : ' + error);
    }
  };

  const selectedValue = ref('');
  const optionFiltering = async (selectedValue) => {
    try {
      const response = await axios.get(BASEURI);
      state.list = response.data;
      state.list = sortDate(state.list);
      state.list = state.list.filter((item) => {
        return item.category === selectedValue;
      });
    } catch (error) {
      alert('에러발생 :') + error;
    }
  };

  const updateList = async ({ id, date, type, category, amount, memo }) => {
    try {
      const payload = {
        id,
        date,
        type,
        category,
        amount,
        memo,
      };
      const response = await axios.put(BASEURI + `/${id}`, payload);
      let index = state.list.findIndex((deal) => deal.id === id);
      state.list[index] = payload;
    } catch (error) {
      alert('에러발생 : ' + error);
    }
  };

  const chg_edit = async (id) => {
    const response = await axios.get(BASEURI + `/${id}`);
    state.editDate = response.data.date;
    state.type = response.data.type;
    state.category = response.data.category;
    state.amount = response.data.amount;
    state.id = response.data.id;
    state.memo = response.data.memo;
    state.state_EditComponent = !state.state_EditComponent;
  };

  const apply_edit = async (editDate, type, category, amount, memo) => {
    try {
      const id = state.id;
      const payload = { id, date: editDate, type, category, amount, memo };
      const response = await axios.put(BASEURI + `/${id}`, payload);
      let index = state.list.findIndex((deal) => deal.id === id);
      state.list[index] = payload;
    } catch (error) {
      alert('에러발생 : ' + error);
      console.log(error);
    }
    state.state_EditComponent = !state.state_EditComponent;
  };

  const selectionOption = ref('total');

  const selectList = (selectOption) => {
    if (selectOption === 'total') {
      extractTotalList();
    } else if (selectOption === 'spend') {
      extractSpendLIst();
    } else {
      extractIncomeList();
    }
  };

  const cancel = () => {
    state.state_EditComponent = !state.state_EditComponent;
  };

  const list = computed(() => state.list);
  const state_EditComponent = computed(() => state.state_EditComponent);
  const editDate = computed(() => state.editDate);
  const type = computed(() => state.type);
  const category = computed(() => state.category);
  const amount = computed(() => state.amount);
  const memo = computed(() => state.memo);
  const id = computed(() => state.id);
  const date1 = ref(today);

  return {
    list,
    startDate,
    finishDate,
    selectedValue,
    state_EditComponent,
    editDate,
    type,
    category,
    amount,
    memo,
    id,
    selectionOption,
    date1,
    startDate_change,
    finishDate_change,
    fetchList,
    updateList,
    deleteList,
    extractIncomeList,
    extractSpendLIst,
    extractTotalList,
    changeDate,
    resetDate,
    optionFiltering,
    chg_edit,
    apply_edit,
    selectList,
    cancel,
  };
});
