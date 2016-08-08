<template>
  <h3>勞基法現行版本</h3>
  <ul>
    <li>週薪：{{regularPay}} 元</li>
    <li>加班時數：{{solution.overtimeHoursTotal}}</li>
    <li v-bind:class="{ 'pro': overtimePayWinner }">
      額外工資：{{solution.overtimePay.toFixed(2)}} 元
    </li>
    <li>總計週薪：{{regularPay + solution.overtimePay}} 元</li>
    <li class="pro">國定假日天數：19 天</li>
    <li  class="info" v-if="solution.extraDayoff > 0">
      額外補休時數：{{solution.extraDayoff}} 日
    </li>
    <li class="warning" v-show="solution.illegal">
      {{{solution.illegalReason}}}
    </li>
  </ul>
  <week-table :timetable="solution.transposed"></week-table>
  <div v-show="expand" class="alert alert-info">
    相關規定：
    <ul>
      <li>台(87)勞動二字第39675號函：例假日（通常是週日）上班低於八個小時，薪水均為 {{hourlyPay}} x 8</li>
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
