import { defineStore } from 'pinia';
import axios from 'axios';

export const useDateStore = defineStore('date', {
  state: () => ({
    budget: [],
  }),
  actions: {
    async addBudgetItem(item) {
      this.budget.push(item);
      try {
        const response = await axios.post('http://localhost:3000/budget', item);
        console.log('Budget item saved:', response.data);
      } catch (error) {
        console.error('Error saving budget item:', error);
      }
    },
  },
});
