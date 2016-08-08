<template>
  <h3>勞動部草案一例一休版本</h3>
  <ul>
    <li>週薪：{{regularPay}} 元</li>
    <li>加班時數：{{solution.overtimeHoursTotal}}</li>
    <li v-bind:class="{ 'pro': overtimePayWinner }">
      額外工資：{{solution.overtimePay.toFixed(2)}} 元
    </li>
    <li>總計週薪：{{regularPay + solution.overtimePay}} 元</li>
    <li class="con">國定假日天數：12 天</li>
    <li v-if="solution.extraDayoff > 0" class="info">額外補休時數：{{solution.extraDayoff}} 日</li>
    <li class="warning" v-show="solution.illegal">
      {{{solution.illegalReason}}}
    </li>
  </ul>
  <week-table :timetable="solution.transposed"></week-table>
  <div v-show="expand" class="alert alert-info">
    相關規則：
    <ul>
      <li>
        根據 <a href="http://www.cna.com.tw/news/firstnews/201606290106-1.aspx" target="_blank">報導</a>，休息日工資計算的部分，擬從原本的加倍發給，改為在2小時以內者，按平日工資額另給予每小時1又1/3，再繼續工作者另給予每小時1又2/3。
      </li>
      <li>工作時間計算方式為工作4小時以內，以4小時計算，超過4小時至8小時，以8小時計算，超過8小時至12小時以內者，以12小時計。</li>
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
