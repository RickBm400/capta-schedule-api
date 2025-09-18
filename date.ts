import moment, { Moment } from 'moment-timezone';

const weekendDays = [6, 7];

const timeToSeconds = (horaStr: string): number => {
  const [hh, mm, ss] = horaStr.split(':').map(Number);
  return hh * 3600 + mm * 60 + ss;
};

const setToDate = (
  date: Moment,
  params: { hour?: number; minute?: number; second?: number }
): Moment => date.set(params);

const addToDate = (
  date: Moment,
  digit: number = 0,
  type: 'hours' | 'days' | 'minutes' = 'days'
): Moment => date.add(digit, type);

const restWorkingHours = {
  startLunchMs: timeToSeconds('11:59:59'),
  endLunchMs: timeToSeconds('13:00:00'),
  checkoutMs: timeToSeconds('17:00:00'),
  checkinMs: timeToSeconds('08:00:00'),
  midNight: timeToSeconds('23:59:59'),
};

// TESTING BLOCK
console.clear();

console.log('midnight ', restWorkingHours.midNight);
console.log('checkout ', restWorkingHours.checkoutMs);
console.log('checkin ', restWorkingHours.checkinMs);
let counterExample = 0;

function testThisCode(
  _dateTest: Moment,
  hoursCounter: number = 0,
  daysCounter: number = 0
) {
  console.log('EJEMPLO NO: ', (counterExample = counterExample + 1));
  console.log(
    '\nOriginal Date: ',
    _dateTest.format(),
    '\nHours: ',
    hoursCounter,
    '\nDays: ',
    daysCounter,
    '\n'
  );
  let firsRound = true;
  let [dayInWeek, hour, minute, second] = _dateTest
    .format('E:HH:mm:ss')
    .split(':')
    .map(Number);
  const initialHour = hour;
  let _hoursCounter = hoursCounter + daysCounter * 9;
  let _isEqualOneDay = _hoursCounter % 9 == 0;
  let _daysCounter = Math.trunc(_hoursCounter / 9) + 1;
  // console.log('days counter', _daysCounter);

  while (_hoursCounter > 0) {
    // console.log('counter: ', _hoursCounter);
    [dayInWeek, hour, minute, second] = _dateTest
      .format('E:HH:mm:ss')
      .split(':')
      .map(Number);
    const currentTimeMs = timeToSeconds([hour, minute, second].join(':'));

    // Check Weekends
    if (weekendDays.includes(dayInWeek)) {
      let daysToAdd = firsRound ? 5 - dayInWeek : 8 - dayInWeek;
      addToDate(_dateTest, daysToAdd, 'days');
      setToDate(_dateTest, { hour: firsRound ? 17 : 8, minute: 0, second: 0 });
      // console.log('check weekend output: ', _dateTest.format());
      firsRound && (firsRound = false);
      continue;
    }

    // Check Midday Lunch
    if (
      currentTimeMs > restWorkingHours.startLunchMs &&
      currentTimeMs < restWorkingHours.endLunchMs
    ) {
      addToDate(_dateTest, 1, 'hours');
      firsRound && setToDate(_dateTest, { minute: 0, second: 0 });
      // console.log('check midday output: ', _dateTest.format());
      firsRound && (firsRound = false);
      if (_isEqualOneDay) {
        _hoursCounter--;
      }
      continue;
    }

    // Check Leaving hours
    if (
      currentTimeMs >= restWorkingHours.checkoutMs &&
      currentTimeMs <= restWorkingHours.midNight
    ) {
      addToDate(_dateTest, 1, 'days');
      setToDate(_dateTest, {
        hour: firsRound && currentTimeMs > restWorkingHours.checkoutMs ? 17 : 8,
      });
      !firsRound && setToDate(_dateTest, { minute: 0, second: 0 });
      // console.log('check gte chout lte mdn output: ', _dateTest.format());
      firsRound && (firsRound = false);
      if (!(firsRound && currentTimeMs > restWorkingHours.checkoutMs))
        _daysCounter--;
      continue;
    }

    addToDate(_dateTest, 1, 'hours');
    // +1 18 _hoursCounter++ Solo cuando la hora inicial es 8 y las horas contador 9
    if (
      initialHour == 8 &&
      _daysCounter > 0 &&
      _hoursCounter == 1 &&
      _isEqualOneDay
    ) {
      addToDate(_dateTest, 1, 'hours');
      _hoursCounter++;
      _daysCounter--;
      // console.log('borderCase');
      // console.log('daysCounter, ', _daysCounter);
    }
    if (initialHour == 8 && _daysCounter <= 0 && _isEqualOneDay) {
      setToDate(_dateTest, { hour: 8, minute: 0, second: 0 });
      _hoursCounter = 0;
    }
    // console.log('check default case: ', _dateTest.format());
    firsRound && (firsRound = false);
    _hoursCounter--;
  }

  console.log('\ncheck output case: ', _dateTest.format());
  console.log('--------------------------------------------------\n');
}

testThisCode(moment('2025-09-12T17:00:00').tz('America/Bogota'), 1);
testThisCode(moment('2025-09-13T14:00:00').tz('America/Bogota'), 1);
testThisCode(moment('2025-09-16T15:00:00').tz('America/Bogota'), 3, 1);
testThisCode(moment('2025-09-14T18:00:00').tz('America/Bogota'), 0, 1); // 1 día 4
testThisCode(moment('2025-09-15T08:00:00').tz('America/Bogota'), 8); // 8 horas
testThisCode(moment('2025-09-15T08:00:00').tz('America/Bogota'), 0, 1); // 1 día 6
testThisCode(moment('2025-09-15T12:30:00').tz('America/Bogota'), 0, 1); // 7
testThisCode(moment('2025-09-15T11:30:00').tz('America/Bogota'), 3);
