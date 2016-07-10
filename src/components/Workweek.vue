<template>
  <p>假設勞工採月薪制，其月薪 {{monthlyPay}} 元，平均時薪 {{hourlyPay}} 元</p>
  <p>
    <ul>
      <template v-if="totalWorkHours <= 48">
        <li>週薪：{{regularPay}} 元</li>
        <li>加班費：{{overtimePay}} 元</li>
        <li>總計週薪：{{totalPay}} 元</li>
        <li>額外補休時數：{{workhours[6]}} 小時</li>
        <li class="warning" v-show="workhours[6] > 0">
          只有在天災、事變或突發事件才可在週日工作。
        </li>
      </template>
      <li class="warning" v-show="totalWorkHours > 48">
        違法：目前總工時為 {{totalWorkHours}} 小時，超過 48 小時
      </li>
    </ul>
  </p>
  <div class="input">
    <label>週一 <input v-model="workhours[0]"></label>
    <label>週二 <input v-model="workhours[1]"></label>
    <label>週三 <input v-model="workhours[2]"></label>
    <label>週四 <input v-model="workhours[3]"></label>
    <label>週五 <input v-model="workhours[4]"></label>
    <label>週六 <input v-model="workhours[5]"></label>
    <label>週日 <input v-model="workhours[6]"></label>

    <table class="week">
      <th v-for="name in daynames">
        {{ name }}
      <th>
      <tr v-for="hour in workingMatrix">
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
</template>

<script>
const state = {
  OFF: 0,
  REGULAR_WORK: 1,
  OVER_TWO_HOURS_WORK: 2,
  OVER_THREE_HOURS_WORK: 3,
  DAYOFF_WORK: 4
};

export default {
  data () {
    let daynames = ['一', '二', '三', '四', '五', '六', '日'];
    let workhours = [8, 8, 8, 8, 8, 0, 0];

    return {
      daynames: daynames,
      workhours: workhours,
      regularPay: 150 * 8 * 7,
      hourlyPay: 150,
      monthlyPay: 36000,
      regularHoursPerDay: 8
    };
  },
  computed: {
    workingMatrix: function () {
      let workingMatrix = [];
      let total = 0;
      this.workhours.forEach((workhour, dayOfWeek) => {
        let workday = Array.apply(null, Array(12)).map((val, i) => {
          let currentState = state.OFF;

          if (workhour > i) {
            total++;
          }

          if (workhour <= i) {
            currentState = state.OFF;
          } else if (dayOfWeek === 6) {
            currentState = state.DAYOFF_WORK;
          } else if (total > 42) {
            currentState = state.OVER_THREE_HOURS_WORK;
          } else if (total > 40) {
            currentState = state.OVER_TWO_HOURS_WORK;
          } else if (i < this.regularHoursPerDay) {
            currentState = state.REGULAR_WORK;
          } else if (i - this.regularHoursPerDay >= 2) {
            currentState = state.OVER_THREE_HOURS_WORK;
          } else if (i - this.regularHoursPerDay < 2) {
            currentState = state.OVER_TWO_HOURS_WORK;
          } else {
            currentState = state.OFF;
          }

          return currentState;
        });
        workingMatrix.push(workday);
      });
      var transposed = workingMatrix[0].map(function (col, i) {
        return workingMatrix.map(function (row) {
          return row[i];
        });
      });
      return transposed;
    },
    overtimePay: function () {
      let pay = 0;
      this.workingMatrix.forEach(day => {
        day.forEach(hour => {
          if (hour === 2) {
            pay += this.hourlyPay * 4 / 3;
          } else if (hour === 3) {
            pay += this.hourlyPay * 5 / 3;
          } else if (hour === 4) {
            pay += this.hourlyPay * 2;
          }
        });
      });
      return pay;
    },
    totalPay: function () {
      return this.overtimePay + this.regularPay;
    },
    totalWorkHours: function () {
      return this.workhours.reduce((a, b) =>
              parseInt(a) || 0 + parseInt(b) || 0);
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
</style>
