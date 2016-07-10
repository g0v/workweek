<template>
  <div class="jumbotron">
    <div class="container">
      <h1><span class="glyphicon glyphicon-wrench"></span> 勞基法計算機</h1>
      <p>
        沒人搞的清楚這次修法到底要怎麼修比較好，不如來個計算機自己按一按吧。
      </p>
    </div>
  </div>
  <div class="container">
    <div class="alert alert-info">
      <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
      <span>假設勞工採月薪制，其月薪 {{monthlyPay}} 元，平均時薪 {{hourlyPay}} 元</span>
    </div>
    <h2>每日工時</h2>
    <div class="input">
      <label>週一 <input number v-model="workhours[0]"></label>
      <label>週二 <input number v-model="workhours[1]"></label>
      <label>週三 <input number v-model="workhours[2]"></label>
      <label>週四 <input number v-model="workhours[3]"></label>
      <label>週五 <input number v-model="workhours[4]"></label>
      <label>週六 <input number v-model="workhours[5]"></label>
      <label>週日 <input number v-model="workhours[6]"></label>
    </div>
    <div class="row">
      <div class="col-md-4">
        <h3>勞基法現行版本</h3>
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
      </div>
      <div class="col-md-4">
        <h3>勞動部草案一例一休版本</h3>
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
      </div>
      <div class="col-md-4">
        <h3>一週兩例假日版本</h3>
        <ul>
          <template v-if="totalWorkHours <= 48">
            <li>週薪：{{regularPay}} 元</li>
            <li>加班費：{{twoOffSolution.overtimePay}} 元</li>
            <li>總計週薪：{{regularPay + twoOffSolution.overtimePay}} 元</li>
            <li>工時：{{totalWorkHours}}</li>
            <li v-if="workhours[6] > 0 || workhours[5] > 0" class="warning">
              額外補休時數：{{ (workhours[6] > 0 ? 1 : 0) + (workhours[5] > 0 ? 1 : 0) }} 日
            </li>
            <li class="warning" v-show="workhours[6] > 0 || workhours[5] > 0">
              只有在天災、事變或突發事件才可在例假日（如週六、週日）工作。
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
          <tr v-for="hour in twoOffSolution.transposed">
            <td v-for="day in hour" track-by="$index">
                <span class="emoji" v-if="day === 1">😃</span>
                <span class="emoji" v-if="day === 2">😨</span>
                <span class="emoji" v-if="day === 3">😱</span>
                <span class="emoji" v-if="day === 4">😡</span>
                <span class="emoji" v-if="day === 0">--</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <div class="footer">
    本專案源碼於 <a href="https://github.com/g0v/workweek">g0v/worweek</a> 以 MIT 授權釋出，
    有任何問題請提交至 <a href="https://github.com/g0v/workweek/issues">issue tracker</a>
  </div>
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
    twoOffSolution: function () {
      return solutions.twoOff(this.workhours, this.hourlyPay);
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
table.week {
  width: 100%;
}

table.week td, table.week th {
  text-align: center;
}

.warning {
  color: red;
  font-weight: bold;
}

.footer {
  margin-top: 50px;
  padding: 5px;
  background: #EEE;
  text-align: center;
}
</style>
