function generateDatesFromTimestamp(startTimestamp, endTimestamp) {
  let dates = [];
  let startDate = moment(startTimestamp); // Initialize moment with the start date timestamp
  let endDay = moment(endTimestamp); // End of the next month from start date

  // Loop from the start date to the end of the next month, skipping weekends
  for (let date = startDate; date.isSameOrBefore(endDay); date.add(1, 'days')) {
    if (date.day() !== 0 && date.day() !== 6) { // Skip Saturdays (6) and Sundays (0)
      dates.push({
        display: date.format('ddd Do MMM'), // Format like "Mon 13th May"
        value: date.valueOf() // Timestamp of the date
      });
    }
  }

  return dates;
}

// Initial timestamps
let startTimestamp = 1709251200000;
let endTimestamp = moment(startTimestamp).add(1, 'months').endOf('month').valueOf();
// Use the user model to load in the correct dates
if (subTab === '-NxmKMR2J7ht8AXFr3c1') {
  // Daily schedule date set use
  startTimestamp = $getUser('dailyScheduleStartDate');
  endTimestamp = $getUser('dailyScheduleEndDate');
  if (!startTimestamp) {
    startTimestamp = moment().valueOf();
    $setUser('dailyScheduleStartDate', startTimestamp);
  }
  if (!endTimestamp) {
    endTimestamp = moment(startTimestamp).add(1, 'months').endOf('month').valueOf();
    $setUser('dailyScheduleEndDate', endTimestamp);
  }
} else if (subTab === '-Nxmd7bkSVRmTeaCF7q4') {
  // Vertical daily scheduled date set use
  startTimestamp = $getUser('verticalDailyScheduleStartDate');
  endTimestamp = $getUser('verticalDailyScheduleEndDate');
  if (!startTimestamp) {
    startTimestamp = moment().valueOf();
    $setUser('verticalDailyScheduleStartDate', startTimestamp);
  }
  if (!endTimestamp) {
    endTimestamp = moment(startTimestamp).add(1, 'months').endOf('month').valueOf();
    $setUser('verticalDailyScheduleEndDate', endTimestamp);
  }

  console.log(startTimestamp, endTimestamp)
}

// Generate the dates
let dates = generateDatesFromTimestamp(startTimestamp, endTimestamp);

// Prepend a blank option if needed
dates.unshift({ display: '_BLANK', value: '' });

console.log(dates)
console.log('genrating headers')
return dates;
