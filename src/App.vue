<template>
  <div id="app" class="v-datepicker">
      <label
        id="datepickerLabel"
        for="datepicker"
        class="v-datepicker__input-label"
      >
        Date (mm/dd/yyyy):
      </label>

      <div class="v-datepicker__input-wrapper">
        <input
          id="datepicker"
          type="text"
          class="v-datepicker__input"
          v-model="selectedDateInput"
          @blur="selectDate({ input: true })"
        >
        <button @click="toggleDatePicker" class="v-datepicker__toggle-button" aria-describedby="datepickerLabel">
          <img
            src="./assets/calendar.svg"
            alt="calendar icon"
            class="v-datepicker__toggle-button-icon"
          >
        </button>
      </div>

      <date-picker
        :is-visible="isDatePickerVisible"
        :selected-date="selectedDate"
        :current="current"
        :next="next"
        :previous="previous"
        :min-date="minDate"
        :max-date="maxDate"
        v-on-clickaway="toggleDatePicker"
        @pick-date="selectDate"
        @go-to-next-month="goToNextMonth"
        @go-to-previous-month="goToPreviousMonth"
        @close-datepicker="isDatePickerVisible = false"
      />
  </div>
</template>

<script>
import moment from 'moment';
import { directive as onClickaway } from 'vue-clickaway';
import DatePicker from './components/DatePicker';

export default {
  name: 'app',
  components: { DatePicker },
  directives: { onClickaway: onClickaway },
  data: () => ({
    isDatePickerVisible: false,
    selectedDate: moment(new Date()),
    current: {
      month: moment().get('month'),
      year: moment().get('year'),
      daysInMonth: moment().daysInMonth(),
    },
    previous: {
      monthString: moment().subtract(1, 'month').format('MMMM'),
      year: moment().subtract(1, 'month').get('year'),
    },
    next: {
      monthString: moment().add(1, 'month').format('MMMM'),
      year: moment().add(1, 'month').get('year'),
    },
    selectedDateInput: '',
  }),
  props: {
    minDate: {
      type: Object,
      default: null,
    },
    maxDate: {
      type: Object,
      default: null,
    }
  },
  methods: {
    toggleDatePicker() {
      this.isDatePickerVisible = !this.isDatePickerVisible;
    },
    selectDate({ date, current, input = false }) {
      if (input && !this.selectedDateInput.length) return;
      const newDate = moment(input ? new Date(this.selectedDateInput) : new Date(current.year, current.month, date));

      this.selectedDate = newDate;
      if (!input) this.selectedDateInput = newDate.format('MM/DD/YYYY');

      if (input) this.updateCurrentDates({ year: newDate.get('year'), month: newDate.get('month') });

      this.isDatePickerVisible = false;
    },
    goToPreviousMonth() {
      if (this.current.month === 0) {
        this.current.month = 11;
        this.current.year = this.current.year - 1;
      } else {
        this.current.month = this.current.month - 1;
      }
      this.updateDaysInMonth();
    },
    goToNextMonth() {
      const nextMonth = this.current.month + 1;
      if (nextMonth > 11) {
        this.current.month = 0;
        this.current.year = this.current.year + 1;
      } else {
        this.current.month = nextMonth;
      }
      this.updateDaysInMonth();
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
