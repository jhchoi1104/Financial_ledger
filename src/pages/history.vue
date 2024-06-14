<template>
  <div class="container">
    <div class="row">
      <div class="col-2 p-2"></div>
      <div class="col-8 p-2">
        <div class="d-flex justify-content-left">
          <h3><i class="fa-solid fa-list-ul"></i> 거래 목록</h3>
        </div>
        <br />
        <ListItem />
      </div>
      <div class="col-2 p-2">
        <teleport to="#modal">
          <editItem v-if="state_EditComponent" />
        </teleport>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTodoListStore } from '@/stores/history.js';
import { computed } from 'vue';

import filterItem from '@/components/filter.vue';
import ListItem from '@/components/list.vue';
import editItem from '@/components/edit.vue';

const { fetchList } = useTodoListStore();
const ListStore = useTodoListStore();

const state_EditComponent = computed(() => ListStore.state_EditComponent);

fetchList();
</script>

<style scoped></style>
