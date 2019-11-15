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
        <button @click="toggleDatePicker" class="v-datepicker__toggle-button">
          <img src="./assets/calendar.svg" alt="calendar icon" class="v-datepicker__toggle-button-icon">
        </button>
      </div>

      <date-picker
        :is-visible="isDatePickerVisible"
        :selected-date="selectedDate"
        :current-year="currentYear"
        :current-month="currentMonth"
        v-on-clickaway="toggleDatePicker"
        @pick-date="selectDate"
        @go-to-next-month="goToNextMonth"
        @go-to-previous-month="goToPreviousMonth"
      />
  </div>
</template>

<script>
import moment from 'moment';
import { directive as onClickaway } from 'vue-clickaway';
import DatePicker from './components/DatePicker';

export default {
  name: 'app',
  components: {
    DatePicker,
  },
  directives: {
    onClickaway: onClickaway,
  },
  data: () => ({
    isDatePickerVisible: false,
    selectedDate: moment(new Date()),
    currentMonth: moment().get('month'),
    currentYear: moment().get('year'),
    selectedDateInput: '',
  }),
  methods: {
    toggleDatePicker() {
      this.isDatePickerVisible = !this.isDatePickerVisible;
    },
    selectDate({
      date,
      currentYear = this.currentYear,
      currentMonth = this.currentMonth,
      input = false,
    }) {
      if (input && !this.selectedDateInput.length) return;
      const newDate = moment(input ? new Date(this.selectedDateInput) : new Date(currentYear, currentMonth, date));

      this.selectedDate = newDate;
      if (!input) this.selectedDateInput = newDate.format('MM/DD/YYYY');

      if (input) this.updateCurrentDates({ year: newDate.get('year'), month: newDate.get('month') });

      this.isDatePickerVisible = false;
    },
    goToPreviousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear = this.currentYear - 1;
      } else {
        this.currentMonth = this.currentMonth - 1;
      }
    },
    goToNextMonth() {
      const nextMonth = this.currentMonth + 1;
      if (nextMonth > 11) {
        this.currentMonth = 0;
        this.currentYear = this.currentYear + 1;
      } else {
        this.currentMonth = nextMonth;
      }
    },
    updateCurrentDates({ year, month }) {
        this.currentYear = year;
        this.currentMonth = month;
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
