const REGULAR_HOURS_PER_DAY = 8;
const TOTAL_WEEK_PER_YEAR = 52;
const DAY_NAMES = ['一', '二', '三', '四', '五', '六', '日'];
const STATE = {
  OFF: 0,
  REGULAR_WORK: 1,
  OVERTIME_WORK: 2,
  OVER_TWO_HOURS_WORK: 3,
  DAYOFF_WORK: 4,
  DAYOFF_ILLEGAL_WORK: 5
};

function current (workhours, hourlyPay, reason) {
  let workingMatrix = [];
  let total = 0;
  let overtimeHours = 0;
  let overtimeHoursTotal = 0;
  let pay = 0;
  let holiday = 19;

  workhours.forEach((workhour, dayOfWeek) => {
    let workday = Array.apply(null, Array(12)).map((val, i) => {
      let currentState = STATE.OFF;

      if (workhour > i) {
        total++;
      }

      if (workhour <= i) {
        currentState = STATE.OFF;
      } else if (dayOfWeek === 6) {
        currentState = reason === 'disaster' ? STATE.DAYOFF_WORK : STATE.DAYOFF_ILLEGAL_WORK;
      } else if (total - overtimeHours > 40 && i - REGULAR_HOURS_PER_DAY >= 2) {
        currentState = STATE.OVER_TWO_HOURS_WORK;
        overtimeHours++;
      } else if (total - overtimeHours > 40 && i - REGULAR_HOURS_PER_DAY < 2) {
        currentState = STATE.OVERTIME_WORK;
        overtimeHours++;
      } else if (total - overtimeHours > 42) {
        currentState = STATE.OVER_TWO_HOURS_WORK;
        overtimeHours++;
      } else if (total - overtimeHours > 40) {
        currentState = STATE.OVERTIME_WORK;
        overtimeHours++;
      } else if (i < REGULAR_HOURS_PER_DAY) {
        currentState = STATE.REGULAR_WORK;
      } else if (i - REGULAR_HOURS_PER_DAY >= 2) {
        currentState = STATE.OVER_TWO_HOURS_WORK;
        overtimeHours++;
      } else if (i - REGULAR_HOURS_PER_DAY < 2) {
        currentState = STATE.OVERTIME_WORK;
        overtimeHours++;
      } else {
        currentState = STATE.OFF;
      }

      return currentState;
    });
    workingMatrix.push(workday);

    if (dayOfWeek < 5) {
      let overtimeHours = workhour - 8;
      if (overtimeHours > 0 && overtimeHours <= 2) {
        pay += hourlyPay * 4 / 3 * overtimeHours;
      } else if (overtimeHours > 2) {
        pay += hourlyPay * 4 / 3 * 2 + hourlyPay * 5 / 3 * (overtimeHours - 2);
      }
    }

    if (dayOfWeek < 5 || (dayOfWeek === 6 && reason !== 'disaster')) {
      overtimeHoursTotal += workhour - 8 > 0 ? workhour - 8 : 0;
    } else if (dayOfWeek === 5) {
      overtimeHoursTotal += workhour;
    }
  });
  var transposed = workingMatrix[0].map(function (col, i) {
    return workingMatrix.map(function (row) {
      return row[i];
    });
  });

  // 週六工作的薪資規則
  // 前兩個小時，時薪為 1/3
  // 2 ~ 8 小時，時薪為 2/3
  // 超過第八個小時，時薪為 1 + 2/3
  // 如果是 7 7 7 7 7 5 0 的狀況，則週六不該為加班日
  if (workhours[5] > 0) {
    let sum = workhours.slice(0, 5).reduce((a, b) => parseFloat(a) + parseFloat(b));
    let hours = workhours[5];
    if (sum <= 40) {
      let diff = 40 - sum;
      hours = hours - diff;
    }

    if (hours < 0) {
      // do nothing
    } else if (hours <= 2) {
      pay += hours * hourlyPay * 1 / 3;
    } else if (hours <= 8) {
      pay += 2 * hourlyPay * 1 / 3 + (hours - 2) * hourlyPay * 2 / 3;
    } else if (hours > 8) {
      pay += 2 * hourlyPay * 1 / 3 + 6 * hourlyPay * 2 / 3 +
             (hours - 8) * hourlyPay * 5 / 3;
    }
  }

  // 週日工作的薪資規則，為什麼搞得這麼複雜？
  // 例假日工作八個小時以內，薪水皆以 hourlyPay * 8 計算
  // 超過八個小時合法的狀況薪水應為兩倍
  if (workhours[6] > 0 && workhours[6] <= 8) {
    pay += hourlyPay * 8;
  } else if (workhours[6] > 8) {
    if (reason === 'disaster') {
      pay += (workhours[6] - 8) * hourlyPay * 2 + hourlyPay * 8;
    } else if (workhours[6] <= 10) {
      pay += (workhours[6] - 8) * hourlyPay * 4 / 3 + hourlyPay * 8;
    } else if (workhours[6] > 10) {
      pay += (workhours[6] - 10) * hourlyPay * 5 / 3 + 2 * hourlyPay * 4 / 3 + hourlyPay * 8;
    }
  }

  let dayoff = 7;
  workhours.slice(0, 6).forEach(d => {
    if (d > 0) {
      dayoff--;
    }
  });

  return {
    holiday: holiday,
    workingMatrix: workingMatrix,
    transposed: transposed,
    overtimePay: parseFloat(pay),
    overtimeHoursTotal: overtimeHoursTotal,
    totalWorkdays: 365 - holiday - dayoff * TOTAL_WEEK_PER_YEAR
  };
}

function oneRestOneOff (workhours, hourlyPay, reason) {
  let workingMatrix = [];
  let total = 0;
  let overtimeHours = 0;
  let overtimeHoursTotal = 0;
  let pay = 0;
  let holiday = 12;

  workhours.forEach((workhour, dayOfWeek) => {
    let workday = Array.apply(null, Array(12)).map((val, i) => {
      let currentState = STATE.OFF;

      if (workhour > i) {
        total++;
      }

      if (workhour <= i) {
        currentState = STATE.OFF;
      } else if (dayOfWeek === 6) {
        currentState = reason === 'disaster' ? STATE.DAYOFF_WORK : STATE.DAYOFF_ILLEGAL_WORK;
      } else if (total - overtimeHours > 40 && i - REGULAR_HOURS_PER_DAY >= 2) {
        currentState = STATE.OVER_TWO_HOURS_WORK;
        overtimeHours++;
      } else if (total - overtimeHours > 40 && i - REGULAR_HOURS_PER_DAY < 2) {
        currentState = STATE.OVERTIME_WORK;
        overtimeHours++;
      } else if (total - overtimeHours > 42) {
        currentState = STATE.OVER_TWO_HOURS_WORK;
        overtimeHours++;
      } else if (total - overtimeHours > 40) {
        currentState = STATE.OVERTIME_WORK;
        overtimeHours++;
      } else if (i < REGULAR_HOURS_PER_DAY) {
        currentState = STATE.REGULAR_WORK;
      } else if (i - REGULAR_HOURS_PER_DAY >= 2) {
        currentState = STATE.OVER_TWO_HOURS_WORK;
        overtimeHours++;
      } else if (i - REGULAR_HOURS_PER_DAY < 2) {
        currentState = STATE.OVERTIME_WORK;
        overtimeHours++;
      } else {
        currentState = STATE.OFF;
      }

      return currentState;
    });
    workingMatrix.push(workday);

    if (dayOfWeek < 5) {
      let overtimeHours = workhour - 8;
      if (overtimeHours > 0 && overtimeHours <= 2) {
        pay += hourlyPay * 4 / 3 * overtimeHours;
      } else if (overtimeHours > 2) {
        pay += hourlyPay * 4 / 3 * 2 + hourlyPay * 5 / 3 * (overtimeHours - 2);
      }
    }

    if (dayOfWeek < 5 || (dayOfWeek === 6 && reason !== 'disaster')) {
      overtimeHoursTotal += workhour - 8 > 0 ? workhour - 8 : 0;
    } else if (dayOfWeek === 5) {
      if (workhour > 0 && workhour <= 4) {
        overtimeHoursTotal += 4;
      } else if (workhour > 0 && workhour <= 8) {
        overtimeHoursTotal += 8;
      } else if (workhour > 0 && workhour <= 12) {
        overtimeHoursTotal += 12;
      } else {
        overtimeHoursTotal += workhour;
      }
    }
  });
  var transposed = workingMatrix[0].map(function (col, i) {
    return workingMatrix.map(function (row) {
      return row[i];
    });
  });

  // http://www.cna.com.tw/news/firstnews/201606290106-1.aspx
  // 根據勞動部資料，休息日工資計算的部分，擬從原本的加倍發給，改為在2小時以內者，按平日工資
  // 額另給予每小時1又1/3，再繼續工作者另給予每小時1又2/3。工作時間計算方式為工作4小時以內
  // ，以4小時計算，超過4小時至8小時，以8小時計算，超過8小時至12小時以內者，以12小時計。

  if (workhours[5] > 0) {
    if (workhours[5] <= 4) {
      pay += hourlyPay * 2 * 4 / 3 + hourlyPay * 2 * 5 / 3;
    } else if (workhours[5] <= 8) {
      pay += hourlyPay * 2 * 4 / 3 + hourlyPay * 6 * 5 / 3;
    } else {
      pay += hourlyPay * 2 * 4 / 3 + hourlyPay * 10 * 5 / 3;
    }
  }

  // 週日工作的薪資規則，為什麼搞得這麼複雜？
  // 例假日工作八個小時以內，薪水皆以 hourlyPay * 8 計算
  // 超過八個小時合法的狀況薪水應為兩倍
  if (workhours[6] > 0 && workhours[6] <= 8) {
    pay += hourlyPay * 8;
  } else if (workhours[6] > 8) {
    if (reason === 'disaster') {
      pay += (workhours[6] - 8) * hourlyPay * 2 + hourlyPay * 8;
    } else if (workhours[6] <= 10) {
      pay += (workhours[6] - 8) * hourlyPay * 4 / 3 + hourlyPay * 8;
    } else if (workhours[6] > 10) {
      pay += (workhours[6] - 10) * hourlyPay * 5 / 3 + 2 * hourlyPay * 4 / 3 + hourlyPay * 8;
    }
  }

  let dayoff = 7;
  workhours.slice(0, 6).forEach(d => {
    if (d > 0) {
      dayoff--;
    }
  });

  return {
    holiday: holiday,
    workingMatrix: workingMatrix,
    transposed: transposed,
    overtimePay: parseFloat(pay),
    overtimeHoursTotal: overtimeHoursTotal,
    totalWorkdays: 365 - holiday - dayoff * TOTAL_WEEK_PER_YEAR
  };
}

function twoOff (workhours, hourlyPay, reason) {
  let workingMatrix = [];
  let total = 0;
  let overtimeHours = 0;
  let overtimeHoursTotal = 0;
  let pay = 0;
  let holiday = 19;

  workhours.forEach((workhour, dayOfWeek) => {
    let workday = Array.apply(null, Array(12)).map((val, i) => {
      let currentState = STATE.OFF;

      if (workhour > i) {
        total++;
      }

      if (workhour <= i) {
        currentState = STATE.OFF;
      } else if (dayOfWeek === 5 || dayOfWeek === 6) {
        currentState = reason === 'disaster' ? STATE.DAYOFF_WORK : STATE.DAYOFF_ILLEGAL_WORK;
      } else if (total - overtimeHours > 40 && i - REGULAR_HOURS_PER_DAY >= 2) {
        currentState = STATE.OVER_TWO_HOURS_WORK;
        overtimeHours++;
      } else if (total - overtimeHours > 40 && i - REGULAR_HOURS_PER_DAY < 2) {
        currentState = STATE.OVERTIME_WORK;
        overtimeHours++;
      } else if (total - overtimeHours > 42) {
        currentState = STATE.OVER_TWO_HOURS_WORK;
        overtimeHours++;
      } else if (total - overtimeHours > 40) {
        currentState = STATE.OVERTIME_WORK;
        overtimeHours++;
      } else if (i < REGULAR_HOURS_PER_DAY) {
        currentState = STATE.REGULAR_WORK;
      } else if (i - REGULAR_HOURS_PER_DAY >= 2) {
        currentState = STATE.OVER_TWO_HOURS_WORK;
        overtimeHours++;
      } else if (i - REGULAR_HOURS_PER_DAY < 2) {
        currentState = STATE.OVERTIME_WORK;
        overtimeHours++;
      } else {
        currentState = STATE.OFF;
      }

      return currentState;
    });
    workingMatrix.push(workday);

    if (dayOfWeek < 5) {
      let overtimeHours = workhour - 8;
      if (overtimeHours > 0 && overtimeHours <= 2) {
        pay += hourlyPay * 4 / 3 * overtimeHours;
      } else if (overtimeHours > 2) {
        pay += hourlyPay * 4 / 3 * 2 + hourlyPay * 5 / 3 * (overtimeHours - 2);
      }
    }

    if (dayOfWeek < 5 || ((dayOfWeek === 6 || dayOfWeek === 5) && reason !== 'disaster')) {
      overtimeHoursTotal += workhour - 8 > 0 ? workhour - 8 : 0;
    }
  });
  var transposed = workingMatrix[0].map(function (col, i) {
    return workingMatrix.map(function (row) {
      return row[i];
    });
  });

  // 週六與週日工作的薪資規則
  // 例假日工作八個小時以內，薪水皆以 hourlyPay * 8 計算
  // 超過八個小時薪水加倍發給
  [5, 6].forEach(day => {
    if (workhours[day] > 0 && workhours[day] <= 8) {
      pay += hourlyPay * 8;
    } else if (workhours[day] > 8) {
      if (reason === 'disaster') {
        pay += (workhours[day] - 8) * hourlyPay * 2 + hourlyPay * 8;
      } else if (workhours[day] <= 10) {
        pay += (workhours[day] - 8) * hourlyPay * 4 / 3 + hourlyPay * 8;
      } else if (workhours[day] > 10) {
        pay += (workhours[day] - 10) * hourlyPay * 5 / 3 + 2 * hourlyPay * 4 / 3 + hourlyPay * 8;
      }
    }
  });

  let dayoff = 7;
  workhours.slice(0, 5).forEach(d => {
    if (d > 0) {
      dayoff--;
    }
  });

  return {
    holiday: holiday,
    workingMatrix: workingMatrix,
    transposed: transposed,
    overtimePay: parseFloat(pay),
    overtimeHoursTotal: overtimeHoursTotal,
    totalWorkdays: 365 - holiday - dayoff * TOTAL_WEEK_PER_YEAR
  };
}

export {
  REGULAR_HOURS_PER_DAY,
  DAY_NAMES,
  STATE,
  current,
  oneRestOneOff,
  twoOff
};
