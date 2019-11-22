<template>
  <div id="app" class="v-datepicker">
      <label
        id="datepickerLabel"
        for="datepicker"
        class="v-datepicker__input-label"
      >Date (mm/dd/yyyy):</label>

      <div class="v-datepicker__input-wrapper">
        <input
          id="datepicker"
          type="text"
          class="v-datepicker__input"
          aria-autocomplete="none"
          v-model="selectedDateInput"
          @blur="selectDate({ input: true })"
        >
        <button
          id="datepicker-toggle-button"
          class="v-datepicker__toggle-button"
          aria-describedby="datepickerLabel"
          :aria-label="buttonAriaLabel"
          @click="toggleDatePicker(!isDatePickerVisible)"
        >
          <img
            :src="calendarIcon || defaultCalendarIcon"
            alt="calendar icon"
            class="v-datepicker__toggle-button-icon"
          >
        </button>
      </div>

      <date-picker
        v-if="isDatePickerVisible"
        :aria-hidden="!isDatePickerVisible"
        :selected-date="selectedDate"
        :current="current"
        :next="nextMonth"
        :previous="previousMonth"
        :min-date="minDate"
        :max-date="maxDate"
        :navigate-month-icons="navigateMonthIcons"
        @pick-date="selectDate"
        @go-to-next-month="goToNextMonth"
        @go-to-previous-month="goToPreviousMonth"
        @change-year="changeYear"
        @close-datepicker="toggleDatePicker(false)"
      />
  </div>
</template>

<script>
import moment from 'moment';
import defaultCalendarIcon from './assets/calendar.svg'
import DatePicker from './components/DatePicker';

export default {
  name: 'app',
  components: { DatePicker },
  data: () => ({
    defaultCalendarIcon,
    isDatePickerVisible: false,
    selectedDate: null,
    current: {
      month: moment().get('month'), // Months are 0 indexed.
      year: moment().get('year'),
      daysInMonth: moment().daysInMonth(),
    },
    previousMonth: {
      monthString: moment().subtract(1, 'month').format('MMMM'),
      year: moment().subtract(1, 'month').get('year'),
    },
    nextMonth: {
      monthString: moment().add(1, 'month').format('MMMM'),
      year: moment().add(1, 'month').get('year'),
    },
    selectedDateInput: '',
  }),
  props: {
    calendarIcon: {
      type: String,
      default: null,
    },
    // Arrow icons to navigate through the months.
    navigateMonthIcons: {
      type: Object,
      default: null,
    },
    // All dates before minDate are disabled.
    minDate: {
      type: Date,
      default: null,
    },
    // All dates after maxDate are disabled.
    maxDate: {
      type: Date,
      default: null,
    }
  },
  computed: {
    buttonAriaLabel() {
      const selectedDate = this.selectedDate
        ? this.selectedDate.format('dddd MMMM Do, YYYY')
        : null;
      return `Choose date${selectedDate ? `, selected date is ${selectedDate}` : ''}`
    },
  },
  methods: {
    toggleDatePicker(isVisible) {
      this.isDatePickerVisible = isVisible;
      if (!this.isDatePickerVisible) {
        const toggleButton = document.getElementById('datepicker-toggle-button');
        if (toggleButton) toggleButton.focus();
      }
    },
    selectDate({ date, input = false }) {
      if (input && !this.selectedDateInput.length) return; // If input is true but there is no value then return.
      const newDate = moment(input
        ? new Date(this.selectedDateInput)
        : new Date(this.current.year, this.current.month, date)
      );

      this.selectedDate = newDate;
      if (input) {
        this.updateCurrentDates({ year: newDate.get('year'), month: newDate.get('month') });
      } else {
        // If date was not selected via the input then set the value.
        this.selectedDateInput = newDate.format('MM/DD/YYYY');
        this.toggleDatePicker(false);
      }
    },
    goToPreviousMonth() {
      if (this.current.month === 0) {
        // Go to previous year if at the first month.
        this.current.month = 11;
        this.current.year = this.current.year - 1;
      } else {
        this.current.month = this.current.month - 1;
      }
      this.updateDaysInMonth();
      this.updateNextAndPreviousMonths({ year: this.current.year, month: this.current.month });
    },
    goToNextMonth() {
      const nextMonth = this.current.month + 1;
      if (nextMonth > 11) {
        // Go to next year if at the last month.
        this.current.month = 0;
        this.current.year = this.current.year + 1;
      } else {
        this.current.month = nextMonth;
      }
      this.updateDaysInMonth();
      this.updateNextAndPreviousMonths({ year: this.current.year, month: this.current.month });
    },
    changeYear(direction) {
      const calculateFunction = (firstValue, secondValue) =>
        direction === 'next' ? firstValue + secondValue : firstValue - secondValue;

      this.current.year = calculateFunction(this.current.year, 1);
      this.updateNextAndPreviousMonths({ year: this.current.year, month: this.current.month });
    },
    updateNextAndPreviousMonths({ year, month }) {
      // Can't save moment([year, month, 1]) to a variable because moment overrides value rather than taking a copy.
      this.previousMonth = {
        monthString: moment([year, month, 1]).subtract(1, 'month').format('MMMM'),
        year: moment([year, month, 1]).subtract(1, 'month').get('year'),
      };
      this.nextMonth = {
        monthString: moment([year, month, 1]).add(1, 'month').format('MMMM'),
        year: moment([year, month, 1]).add(1, 'month').get('year'),
      };
    },
    updateCurrentDates({ year, month }) {
        this.current.year = year;
        this.current.month = month;
    },
    updateDaysInMonth() {
      this.current.daysInMonth = moment().month(this.current.month).daysInMonth();
    }
  }
}
</script>

<style lang="scss">
.v-datepicker {
  font-family: Arial, Helvetica, sans-serif;

  &__input-label {
    display: block;
    margin-bottom: 0.5em;
  }

  &__input-wrapper {
    align-items: center;
    display: flex;
    margin-bottom: 0.5em;
  }

  &__input {
    box-sizing: border-box;
    font-size: 1em;
    padding: 0.5em;
  }

  &__toggle-button {
    background: none;
    border: none;
    cursor: pointer;

    &-icon {
      width: 3em;
    }
  }

}
</style>
