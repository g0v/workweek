<template>
  <h3>一週兩例假日版本</h3>
  <ul>
    <li>週薪：{{regularPay}} 元</li>
    <li>加班時數：{{solution.overtimeHoursTotal}}</li>
    <li v-bind:class="{ 'pro': overtimePayWinner }">
      額外工資：{{solution.overtimePay.toFixed(2)}} 元
    </li>
    <li>總計週薪：{{regularPay + solution.overtimePay}} 元</li>
    <li class="pro">國定假日天數：19 天</li>
    <li v-if="solution.extraDayoff > 0" class="info">
      額外補休時數：{{ solution.extraDayoff }} 日
    </li>
    <li class="warning" v-show="solution.illegal">
      {{{solution.illegalReason}}}
    </li>
  </ul>
  <week-table :timetable="solution.transposed"></week-table>
  <div v-show="expand" class="alert alert-info">
    相關規則：
    <ul>
      <li>國民黨版在立法說明提到比照公務員，兩例有可能實質變兩休，但目前草案並沒有這個效果，還要觀察是否有後續動作</li>
    </ul>
  </div>
</template>

<script>
import WeekTable from './WeekTable';

export default {
  components: { WeekTable },
  props: ['solution', 'regularPay', 'overtimePayWinner', 'expand']
};
</script>
