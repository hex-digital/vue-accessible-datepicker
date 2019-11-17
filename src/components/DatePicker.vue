<template>
  <div v-if="isVisible" class="v-datepicker__picker">
    <div class="v-datepicker__header">
      <button
        :disabled="monthIsSameMinMonth"
        :class="{'v-datepicker__change-month-button--disabled': monthIsSameMinMonth}"
        class="v-datepicker__change-month-button"
        aria-label="Previous month"
        @click="$emit('go-to-previous-month')"
      >
        <img
          src="../assets/back-arrow.svg"
          alt="back arrow"
          width="18"
        >
      </button>
      <p>{{ headerText }}</p>
      <button
        :disabled="monthIsSameMaxMonth"
        :class="{'v-datepicker__change-month-button--disabled': monthIsSameMaxMonth}"
        class="v-datepicker__change-month-button"
        aria-label="Next month"
        @click="$emit('go-to-next-month')"
      >
        <img
          src="../assets/next-arrow.svg"
          alt="next arrow"
          width="18"
        >
      </button>
    </div>

    <table class="v-datepicker__content">
      <thead class="v-datepicker__weekdays-wrapper">
        <tr class="v-datepicker__weekdays-row">
          <th
            scope="col"
            v-for="(day, index) in dayNamesLetters"
            :key="index"
            class="v-datepicker__weekday"
          ><span :title="dayNames[index]">{{ day }}</span></th>
        </tr>
      </thead>

      <tbody class="v-datepicker__weeks">
        <tr
          v-for="(week, weekIndex) in calendar.weeks"
          :key="`week-${weekIndex}`"
          class="v-datepicker__week"
        >
          <td v-for="(day, dayIndex) in week" :key="dayIndex" class="v-datepicker__day">
            <button
              v-if="day.date"
              class="v-datepicker__day-button"
              :data-day="day.date"
              :data-month="day.month"
              :data-year="day.year"
              :aria-label="moment([day.year, day.month, day.date]).format('dddd, Do MMMM YYYY')"
            >{{ day.date }}
            </button>
            <span v-else class="v-datepicker__filler-date">&nbsp;</span>
          </td>
        </tr>
        <!-- <a
          href
          v-for="(date, index) in daysInCurrentMonth"
          :id="isSelected(date) ? 'selectedDateElement' : ''"
          :key="`date-${index}`"
          :ref="`date-${date}`"
          :class="{
            'v-datepicker__month-date--selected': isSelected(date),
            'v-datepicker__month-date--disabled': isBeforeMinDate(date) || isAfterMaxDate(date)
          }"
          class="v-datepicker__month-date"
          @click.prevent="$emit('pick-date', { date, currentMonth, currentYear })"
        >{{ date }}</a> -->
      </tbody>
    </table>
  </div>
</template>

<script>
/* eslint-disable */
import moment from 'moment';
import { dayNames, dayNamesLetters } from '../helpers/date-formats';
import { getDayInWeek, getFullDate } from '../helpers/dates';
import {
  ESC,
  LEFT,
  UP,
  RIGHT,
  DOWN,
} from '../constants/ascii-keys';

export default {
  name: 'DatePicker',
  data: () => ({
    dayNames,
    dayNamesLetters,
    currentFocusedDate: null,
    currentFocusedFullDate: null,
    currentFocusedDateRef: null,
    currentFocusedDayInWeek: null,
    firstDateOfMonth: 1,
  }),
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    minDate: {
      type: Object,
      default: null,
    },
    maxDate: {
      type: Object,
      default: null,
    },
    selectedDate: {
      type: Object,
      required: true,
    },
    currentMonth: {
      type: Number,
      required: true,
    },
    currentYear: {
      type: Number,
      required: true,
    },
    daysInCurrentMonth: {
      type: Number,
      required: true,
    }
  },
  watch: {
    isVisible(visible) {
      this.$nextTick(() => {
        if (!visible) return;
        document.addEventListener('keyup', (event) => this.handleKeyPress(event.keyCode));
        const selectedElement = document.getElementById('selectedDateElement');
        if (!selectedElement) return;
        selectedElement.focus();
      });
    },
  },
  mounted() {
    if (!this.selectedDate) return;
    this.updateCurrentFocusedValues({ newDate: this.selectedDate.date(), newDateRef: `date-${this.selectedDate.date()}` })
  },
  destroyed() {
    if (this.isVisible) document.removeEventListener('keyup', (event) => this.handleKeyPress(event.keyCode));
  },
  computed: {
    headerText() {
      return `${moment().month(this.currentMonth).format('MMMM')} ${this.currentYear}`;
    },
    firstDayInMonth() {
      return moment([this.currentYear, this.currentMonth, 1]).weekday();
    },
    monthIsSameMinMonth() {
      if (!this.minDate) return false;
      const dateToCheck = moment(new Date(this.currentYear, this.currentMonth));
      return moment(dateToCheck).isSame(this.minDate, 'month');
    },
    monthIsSameMaxMonth() {
      if (!this.maxDate) return false;
      const dateToCheck = moment(new Date(this.currentYear, this.currentMonth));
      return moment(dateToCheck).isSame(this.maxDate, 'month');
    },
    calendar() {
      const weeks = [[], [], [], [], []];
      let week = 1;
      const daysInWeek = 7;

      for (let date = this.firstDateOfMonth; date <= (this.daysInCurrentMonth + this.firstDayInMonth); date += 1) {
        if (date <= (week * daysInWeek)) {
          const isBlankDate = date <= this.firstDayInMonth; // Start the month at the correct day in the week.
          weeks[week - 1].push({
            date: isBlankDate ? null : date - this.firstDayInMonth,
            day: isBlankDate ? null : getFullDate({ year: this.currentYear, month: this.currentMonth, date: date - this.firstDayInMonth }).format('dddd'),
            month: isBlankDate ? null : this.currentMonth,
            year: isBlankDate ? null : this.currentYear,
          })
        }

        if (date === (week * daysInWeek)) week += 1; // If at end of week go to next week.
      }
      return {weeks};
    },
  },
  methods: {
    moment,
    isSelected(date) {
      return moment(new Date(this.currentYear, this.currentMonth, date)).isSame(this.selectedDate, 'day');
    },
    isBeforeMinDate(date) {
      if (!this.minDate) return false;
      const dateToCheck = moment(new Date(this.currentYear, this.currentMonth, date));
      return moment(dateToCheck).isBefore(this.minDate, 'day');
    },
    isAfterMaxDate(date) {
      if (!this.maxDate) return false;
      const dateToCheck = moment(new Date(this.currentYear, this.currentMonth, date));
      return moment(dateToCheck).isAfter(this.maxDate, 'day');
    },
    handleKeyPress(keyCode) {
      switch (keyCode) {
      case ESC:
        this.handleEscapeKeyPress();
        break;
      case LEFT:
        this.handleLeftKeyPress();
        break;
      case UP:
        this.handleUpKeyPress();
        break;
      case RIGHT:
        this.handleRightKeyPress();
        break;
      case DOWN:
        this.handleDownKeyPress();
        break;
      default:
        break;
      }
    },
    handleEscapeKeyPress() {
      if (!this.isVisible) return;
      this.$emit('close-datepicker');
      const dateInput = document.getElementById('datepicker');
      if (dateInput) dateInput.focus();
    },
    handleLeftKeyPress() {
      if (!this.currentFocusedDate) return;

      const isAtBeginningOfMonth = this.currentFocusedDate === this.firstDateOfMonth;
      if (isAtBeginningOfMonth) this.$emit('go-to-previous-month');

      this.$nextTick(() => {
        const previousDate = isAtBeginningOfMonth ? this.daysInCurrentMonth : this.currentFocusedDate - 1;
        const previousDateRef = `date-${previousDate}`;
        const previousElement = this.$refs[previousDateRef][0];
        if (!previousElement) return;

        this.updateCurrentFocusedValues({ newDate: previousDate, newDateRef: previousDateRef });
        previousElement.focus();
      });
    },
    handleRightKeyPress() {
      if (!this.currentFocusedDate) return;

      const isAtEndOfMonth = this.currentFocusedDate === this.daysInCurrentMonth;
      if (isAtEndOfMonth) this.$emit('go-to-next-month');

      this.$nextTick(() => {
        const nextDate = isAtEndOfMonth ? this.firstDateOfMonth : this.currentFocusedDate + 1;
        const nextDateRef = `date-${nextDate}`
        const nextElement = this.$refs[nextDateRef][0];
        if (!nextElement) return;

        this.updateCurrentFocusedValues({ newDate: nextDate, newDateRef: nextDateRef });
        nextElement.focus();
      });
    },
    handleUpKeyPress() {
      if (!this.currentFocusedDate) return;

      const isAtBeginningOfMonth = (this.currentFocusedDate - 7) < this.firstDateOfMonth;
      if (isAtBeginningOfMonth) this.$emit('go-to-previous-month');

      this.$nextTick(() => {
        const previousWeekDate = moment(this.currentFocusedFullDate).subtract(1, 'week').date();
        const previousDateRef = `date-${previousWeekDate}`;
        const previousElement = this.$refs[previousDateRef][0];
        if (!previousElement) return;

        this.updateCurrentFocusedValues({ newDate: previousWeekDate, newDateRef: previousDateRef });
        previousElement.focus();
      });
    },
    handleDownKeyPress() {
      if (!this.currentFocusedDate) return;

      const isAtEndOfMonth = (this.currentFocusedDate + 7) > this.daysInCurrentMonth;
      if (isAtEndOfMonth) this.$emit('go-to-next-month');

      this.$nextTick(() => {
        const nextWeekDate = moment(this.currentFocusedFullDate).add(1, 'week').date();
        const nextDateRef = `date-${nextWeekDate}`;
        const nextElement = this.$refs[nextDateRef][0];
        if (!nextElement) return;

        this.updateCurrentFocusedValues({ newDate: nextWeekDate, newDateRef: nextDateRef });
        nextElement.focus();
      });
    },
    updateCurrentFocusedValues({ newDate, newDateRef }) {
      this.currentFocusedDate = newDate;
      this.currentFocusedFullDate = getFullDate({ year: this.currentYear, month: this.currentMonth, date: this.currentFocusedDate });
      this.currentFocusedDateRef = newDateRef;
      this.currentFocusedDayInWeek = getDayInWeek({ year: this.currentYear, month: this.currentMonth, date: this.currentFocusedDate });
    }
  }
}
</script>

<style lang="scss">
$light-grey: #dbdbdb;

.v-datepicker {
  &__picker {
    background-color: white;
    border: 1px solid $light-grey;
    color: black;
    font-family: Arial, Helvetica, sans-serif;

    @media only screen and (min-width: 40em) {
      max-width: 20em;
    }

  }

  &__header {
    border-bottom: 1px solid $light-grey;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
    padding: 0.5em 1em;
  }

  &__content {
    padding: 0.5em 0.5em;
    width: 100%;
  }

  &__change-month-button {
    background: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.4;
    }

    &--disabled {
      opacity: 0.4;
      pointer-events: none;
    }

  }

  &__day-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.75em;
    text-decoration: none;
    transition-property: background-color, color;
    transition-timing-function: ease;
    transition-duration: 0.3s;
    width: 100%;

    &:hover:not(.v-datepicker__filler-date) {
      background-color: $light-grey;
    }

    &--selected {
      background-color: black;
      color: white;
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    };

  }

}
</style>
