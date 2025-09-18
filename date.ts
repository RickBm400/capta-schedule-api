import moment, { Moment } from 'moment-timezone';

const weekendDayNumbers = [6, 7];

const timeToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const setToDate = (
  date: Moment,
  params: { hour?: number; minute?: number; second?: number }
): Moment => date.set(params);

const addToDate = (
  date: Moment,
  amount: number = 0,
  unit: 'hours' | 'days' | 'minutes' = 'days'
): Moment => date.add(amount, unit);

const workingHoursInSeconds = {
  startLunchMs: timeToSeconds('11:59:59'),
  endLunchMs: timeToSeconds('13:00:00'),
  checkoutMs: timeToSeconds('17:00:00'),
  checkinMs: timeToSeconds('08:00:00'),
  midNight: timeToSeconds('23:59:59'),
};

// TESTING BLOCK
console.clear();
console.log('midnight ', workingHoursInSeconds.midNight);
console.log('checkout ', workingHoursInSeconds.checkoutMs);
console.log('checkin ', workingHoursInSeconds.checkinMs);

let testExampleCounter = 0;

function getFormattedDate(
  inputDate: Moment,
  hoursToAdd: number = 0,
  daysToAdd: number = 0
) {
  console.log('EJEMPLO NO: ', (testExampleCounter = testExampleCounter + 1));
  console.log(
    '\nOriginal Date: ',
    inputDate.format(),
    '\nHours: ',
    hoursToAdd,
    '\nDays: ',
    daysToAdd,
    '\n'
  );

  let isFirstIteration = true;
  let [currentDayOfWeek, currentHour, currentMinute, currentSecond] = inputDate
    .format('E:HH:mm:ss')
    .split(':')
    .map(Number);

  const startingHour = currentHour;
  const startingDayOfWeek = currentDayOfWeek;
  let totalHoursToProcess = hoursToAdd + daysToAdd * 9;
  let isExactlyOneDayWorthOfHours = totalHoursToProcess % 9 == 0;
  let calculatedDaysCounter = Math.trunc(totalHoursToProcess / 9) + 1;

  while (totalHoursToProcess > 0) {
    console.log('counter: ', totalHoursToProcess);
    [currentDayOfWeek, currentHour, currentMinute, currentSecond] = inputDate
      .format('E:HH:mm:ss')
      .split(':')
      .map(Number);

    const currentTimeInSeconds = timeToSeconds(
      [currentHour, currentMinute, currentSecond].join(':')
    );

    // Check Weekends
    if (weekendDayNumbers.includes(currentDayOfWeek)) {
      let daysToSkipToWorkday = isFirstIteration
        ? 5 - currentDayOfWeek
        : 8 - currentDayOfWeek;
      addToDate(inputDate, daysToSkipToWorkday, 'days');
      setToDate(inputDate, {
        hour: isFirstIteration ? 17 : 8,
        minute: 0,
        second: 0,
      });
      console.log('check weekend output: ', inputDate.format());
      isFirstIteration && (isFirstIteration = false);
      continue;
    }

    // Check Midday Lunch
    if (
      currentTimeInSeconds > workingHoursInSeconds.startLunchMs &&
      currentTimeInSeconds < workingHoursInSeconds.endLunchMs
    ) {
      addToDate(inputDate, 1, 'hours');
      isFirstIteration && setToDate(inputDate, { minute: 0, second: 0 });
      console.log('check midday output: ', inputDate.format());
      isFirstIteration && (isFirstIteration = false);
      if (isExactlyOneDayWorthOfHours) {
        totalHoursToProcess--;
      }
      continue;
    }

    // Check Leaving hours
    if (
      (currentTimeInSeconds >= workingHoursInSeconds.checkoutMs &&
        currentTimeInSeconds <= workingHoursInSeconds.midNight) ||
      (currentTimeInSeconds > workingHoursInSeconds.midNight &&
        currentTimeInSeconds < workingHoursInSeconds.checkinMs)
    ) {
      addToDate(inputDate, 1, 'days');
      setToDate(inputDate, {
        hour:
          isFirstIteration &&
          currentTimeInSeconds > workingHoursInSeconds.checkoutMs
            ? 17
            : 8,
      });
      !isFirstIteration && setToDate(inputDate, { minute: 0, second: 0 });
      console.log('check gte chout lte mdn output: ', inputDate.format());
      isFirstIteration && (isFirstIteration = false);
      if (
        !(
          isFirstIteration &&
          currentTimeInSeconds > workingHoursInSeconds.checkoutMs
        )
      )
        calculatedDaysCounter--;
      continue;
    }

    addToDate(inputDate, 1, 'hours');

    // Border case: +1 hour when initial hour is 8 and ounter is 9
    if (
      startingHour == 8 &&
      !weekendDayNumbers.includes(startingDayOfWeek) &&
      calculatedDaysCounter >= 1 &&
      totalHoursToProcess == 1 &&
      isExactlyOneDayWorthOfHours
    ) {
      addToDate(inputDate, 1, 'hours');
      totalHoursToProcess++;
      calculatedDaysCounter--;
      console.log('borderCase');
      console.log('daysCounter, ', calculatedDaysCounter);
    }

    if (
      startingHour == 8 &&
      !weekendDayNumbers.includes(startingDayOfWeek) &&
      calculatedDaysCounter <= 0 &&
      isExactlyOneDayWorthOfHours
    ) {
      setToDate(inputDate, { hour: 8, minute: 0, second: 0 });
      totalHoursToProcess = 0;
    }

    console.log('check default case: ', inputDate.format());
    isFirstIteration && (isFirstIteration = false);
    totalHoursToProcess--;
    console.log('counter end ->', totalHoursToProcess);
  }

  console.log('\ncheck output case: ', inputDate.format());
  console.log('--------------------------------------------------\n');
}

// getFormattedDate(moment('2025-09-12T17:00:00').tz('America/Bogota'), 1);
// getFormattedDate(moment('2025-09-13T14:00:00').tz('America/Bogota'), 1);
// getFormattedDate(moment('2025-09-16T15:00:00').tz('America/Bogota'), 3, 1);
// getFormattedDate(moment('2025-09-14T18:00:00').tz('America/Bogota'), 0, 1); // 1 día 4
// getFormattedDate(moment('2025-09-15T08:00:00').tz('America/Bogota'), 8); // 8 horas
getFormattedDate(moment('2025-09-15T08:00:00').tz('America/Bogota'), 0, 1); // 1 día 6
// getFormattedDate(moment('2025-09-15T12:30:00').tz('America/Bogota'), 0, 1); // 7
// getFormattedDate(moment('2025-09-15T11:30:00').tz('America/Bogota'), 3);
