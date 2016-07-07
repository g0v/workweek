<template>
  <p>假設勞工月薪 {{monthlyPay}} 元，時薪 {{hourlyPay}} 元</p>
  <p>
    <ul>
      <li>週薪：{{normalPay}} 元</li>
      <li>加班費：{{overtimePay}} 元</li>
      <li>總計週薪：{{normalPay+overtimePay}} 元</li>
      <li>額外補休時數：{{workhours[6]}} 小時</li>
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
      <tr v-for="hour in status">
        <td v-for="day in hour.days"
            v-bind:class="day">
            <span v-if="day.work">😃</span>
            <span v-if="day.overtime">😡</span>
            <span v-if="!day.work && !day.overtime">--</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    let daynames = ['一', '二', '三', '四', '五', '六', '日'];
    let workhours = [8, 8, 8, 8, 8, 0, 0];

    return {
      daynames: daynames,
      workhours: workhours,
      hourlyPay: 150,
      monthlyPay: 36000
    };
  },
  computed: {
    status: function () {
      let status = [];
      let workhours = this.workhours.slice();
      let expectedWorkhours = [ 8, 8, 8, 8, 8, 0, 0 ];
      for (let i = 0; i < 12; i++) {
        let hour = {
          days: Array.apply(null, Array(7)).map((val, j) => {
            expectedWorkhours[j]--;
            workhours[j]--;
            return {
              work: workhours[j] >= 0 && expectedWorkhours[j] >= 0,
              overtime: workhours[j] >= 0 && expectedWorkhours[j] < 0
            };
          })
        };
        status.push(hour);
      }
      return status;
    },
    normalPay: function () {
      let pay = 0;
      this.workhours.forEach((workhour, i) => {
        if (workhour > 8) {
          workhour = 8;
        }

        if (i === 6) {
          workhour = 0;
        }

        pay += workhour * 150;
      });
      return pay;
    },
    overtimePay: function () {
      let pay = 0;
      this.workhours.forEach((workhour, i) => {
        let overtimeHour = workhour - 8;
        if (i < 5 && overtimeHour > 0) {
          if (overtimeHour <= 2) {
            pay += overtimeHour * 150 * 4 / 3;
          } else {
            let moreTwo = overtimeHour - 2;
            pay += (moreTwo * 5 / 3 + 2 * 4 / 3) * 150;
          }
        } else if (i === 6) {
          pay += workhour * 2 * 150;
        } else if (i === 5) {
          if (workhour <= 2) {
            pay += workhour * 150 * 4 / 3;
          } else {
            let moreTwo = workhour - 2;
            pay += (moreTwo * 5 / 3 + 2 * 4 / 3) * 150;
          }
        }
      });
      return pay;
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
</style>
