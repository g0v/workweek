<template>
  <p>假設勞工採月薪制，其月薪 {{monthlyPay}} 元，平均時薪 {{hourlyPay}} 元</p>
  <div class="input">
    <label>週一 <input number v-model="workhours[0]"></label>
    <label>週二 <input number v-model="workhours[1]"></label>
    <label>週三 <input number v-model="workhours[2]"></label>
    <label>週四 <input number v-model="workhours[3]"></label>
    <label>週五 <input number v-model="workhours[4]"></label>
    <label>週六 <input number v-model="workhours[5]"></label>
    <label>週日 <input number v-model="workhours[6]"></label>
  </div>
  <h2>勞基法現行版本</h2>
  <ul>
    <template v-if="totalWorkHours <= 48">
      <li>週薪：{{regularPay}} 元</li>
      <li>加班費：{{currentSolution.overtimePay}} 元</li>
      <li>總計週薪：{{regularPay + currentSolution.overtimePay}} 元</li>
      <li>工時：{{totalWorkHours}}</li>
      <li v-if="workhours[6] > 0" class="warning">額外補休時數：1 日</li>
      <li class="warning" v-show="workhours[6] > 0">
        只有在天災、事變或突發事件才可在週日工作。
      </li>
    </template>
    <li class="warning" v-show="totalWorkHours > 48">
      違法：目前總工時為 {{totalWorkHours}} 小時，超過 48 小時
    </li>
  </ul>
  <table class="week">
    <th v-for="name in daynames">
      {{ name }}
    <th>
    <tr v-for="hour in currentSolution.transposed">
      <td v-for="day in hour" track-by="$index">
          <span class="emoji" v-if="day === 1">😃</span>
          <span class="emoji" v-if="day === 2">😨</span>
          <span class="emoji" v-if="day === 3">😱</span>
          <span class="emoji" v-if="day === 4">😡</span>
          <span class="emoji" v-if="day === 0">--</span>
      </td>
    </tr>
  </table>
  潛規則：
  <ul>
    <li>台(87)勞動二字第39675號函：例假日（通常是週日）上班低於八個小時，薪水均為 {{hourlyPay}} x 8</li>
  </ul>
  <h2>勞動部草案一例一休版本</h2>
  <ul>
    <template v-if="totalWorkHours <= 48">
      <li>週薪：{{regularPay}} 元</li>
      <li>加班費：{{oneRestOneOffSolution.overtimePay}} 元</li>
      <li>總計週薪：{{regularPay + oneRestOneOffSolution.overtimePay}} 元</li>
      <li>工時：{{totalWorkHours}}</li>
      <li v-if="workhours[6] > 0" class="warning">額外補休時數：1 日</li>
      <li class="warning" v-show="workhours[6] > 0">
        只有在天災、事變或突發事件才可在週日工作。
      </li>
    </template>
    <li class="warning" v-show="totalWorkHours > 48">
      違法：目前總工時為 {{totalWorkHours}} 小時，超過 48 小時
    </li>
  </ul>
  <table class="week">
    <th v-for="name in daynames">
      {{ name }}
    <th>
    <tr v-for="hour in oneRestOneOffSolution.transposed">
      <td v-for="day in hour" track-by="$index">
          <span class="emoji" v-if="day === 1">😃</span>
          <span class="emoji" v-if="day === 2">😨</span>
          <span class="emoji" v-if="day === 3">😱</span>
          <span class="emoji" v-if="day === 4">😡</span>
          <span class="emoji" v-if="day === 0">--</span>
      </td>
    </tr>
  </table>
</template>

<script>
import * as solutions from '../lib/solutions';

export default {
  data () {
    let workhours = [8, 8, 8, 8, 8, 0, 0];

    return {
      daynames: solutions.DAY_NAMES,
      workhours: workhours,
      regularPay: 150 * 8 * 7,
      hourlyPay: 150,
      monthlyPay: 36000,
      regularHoursPerDay: solutions.REGULAR_HOURS_PER_DAY
    };
  },
  computed: {
    currentSolution: function () {
      return solutions.current(this.workhours, this.hourlyPay);
    },
    oneRestOneOffSolution: function () {
      return solutions.oneRestOneOff(this.workhours, this.hourlyPay);
    },
    totalWorkHours: function () {
      return this.workhours.reduce((a, b) =>
              (parseInt(a) || 0) + (parseInt(b) || 0));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
table.week {
  width: 100%;
}
table.week td {
  text-align: center;
}

td.work {
  background-color: green;
}
td.overtime {
  background-color: red;
}
span.emoji {
  font-size: 30px;
}
.warning {
  color: red;
  font-weight: bold;
}
label {
  display: block;
}
</style>
