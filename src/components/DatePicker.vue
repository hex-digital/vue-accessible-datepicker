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

    <div class="v-datepicker__content">
      <ul class="v-datepicker__weekdays">
        <li
          v-for="(day, index) in dayNamesLetters"
          :key="index"
          class="v-datepicker__weekday"
        >
          {{ day }}
        </li>
      </ul>

      <div class="v-datepicker__month-dates">
        <span
          v-for="(blank, index) in firstDayInMonth"
          :key="`blank-${index}`"
          class="v-datepicker__filler-date v-datepicker__month-date"
        >
            &nbsp;
        </span>
        <a
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
        >{{ date }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { dayNamesLetters } from '../helpers/date-formats';
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
    dayNamesLetters,
    focusedDateRef: null,
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
        if (visible) {
          const selectedElement = document.getElementById('selectedDateElement');
          if (!selectedElement) return;

          selectedElement.focus();
          this.focusedDateRef = `date-${selectedElement.text}`;
        }
      });
    },
  },
  mounted() {
    document.addEventListener('keyup', (event) => this.handleKeyPress(event.keyCode));
  },
  destroyed() {
    document.removeEventListener('keyup', (event) => this.handleKeyPress(event.keyCode));
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
        this.handleVerticalKeyPress(UP);
        break;
      case RIGHT:
        this.handleRightKeyPress();
        break;
      case DOWN:
        this.handleVerticalKeyPress(DOWN);
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
      const focusedElement = this.$refs[this.focusedDateRef][0];
      if (!focusedElement) return;

      const currentFocusedDate = parseInt(focusedElement.text);
      const isAtBeginningOfMonth = currentFocusedDate === this.firstDateOfMonth;
      if (isAtBeginningOfMonth) this.$emit('go-to-previous-month');

      this.$nextTick(() => {
        const previousDateRef = `date-${isAtBeginningOfMonth ? this.daysInCurrentMonth : currentFocusedDate - 1}`;
        const previousElement = this.$refs[previousDateRef][0];
        if (!previousElement) return;

        this.focusedDateRef = previousDateRef;
        previousElement.focus();
      });
    },
    handleRightKeyPress() {
      const focusedElement = this.$refs[this.focusedDateRef][0];
      if (!focusedElement) return;

      const currentFocusedDate = parseInt(focusedElement.text);
      const isAtEndOfMonth = currentFocusedDate === this.daysInCurrentMonth;
      if (isAtEndOfMonth) this.$emit('go-to-next-month');

      this.$nextTick(() => {
        const nextDateRef = `date-${isAtEndOfMonth ? this.firstDateOfMonth : currentFocusedDate + 1}`
        const nextElement = this.$refs[nextDateRef][0];
        if (!nextElement) return;

        this.focusedDateRef = nextDateRef;
        nextElement.focus();
      });
    },
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

  &__weekdays,
  &__month-dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin: 0;
    padding: 0;
  }

  &__weekdays {
    color: black;
    font-weight: bold;
    margin-bottom: 1em;
  }

  &__weekday,
  &__month-date {
    list-style-type: none;
    margin: 0;
    text-align: center;
  }

  &__month-date {
    color: black;
    padding: 0.75em;
    text-decoration: none;
    transition-property: background-color, color;
    transition-timing-function: ease;
    transition-duration: 0.3s;

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
