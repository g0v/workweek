<template>
  <table class="week">
    <th v-for="name in DAY_NAMES">
      {{ name }}
    <th>
    <tr v-for="hour in timetable">
      <td v-for="day in hour" track-by="$index">
        <span v-if="day !== STATE.OFF" class="emoji" v-bind:class="{
          'regular': day === STATE.REGULAR_WORK,
          'overtime': day === STATE.OVERTIME_WORK,
          'overtime-two-hours': day === STATE.OVER_TWO_HOURS_WORK,
          'work-on-dayoff': day === STATE.DAYOFF_WORK || day === STATE.DAYOFF_ILLEGAL_WORK,
          'off': day === STATE.OFF
        }"></span>
        <span class="emoji" v-if="day === STATE.OFF">--</span>
      </td>
    </tr>
  </table>
</template>

<script>
import * as solutions from '../lib/solutions';

export default {
  props: ['timetable'],
  data () {
    return {
      DAY_NAMES: solutions.DAY_NAMES,
      STATE: solutions.STATE
    };
  }
};
</script>

<style>
table.week {
  width: 100%;
}

table.week td, table.week th {
  text-align: center;
}

.emoji {
  width: 25px;
  height: 25px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: block;
  margin: auto;
}

.emoji.regular {
  background-image: url('../assets/regular.png');
}

.emoji.overtime {
  background-image: url('../assets/overtime.png');
}

.emoji.overtime-two-hours {
  background-image: url('../assets/overtime-two-hours.png');
}

.emoji.work-on-dayoff {
  background-image: url('../assets/dayoff.png');
}
</style>