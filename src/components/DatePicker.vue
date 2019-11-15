<template>
  <div v-if="isVisible" class="v-datepicker__picker">
    <div class="v-datepicker__header">
      <button
        class="v-datepicker__change-month-button"
        aria-label="Previous month"
        @click="$emit('go-to-previous-month')"
      >
        <img
          src="../assets/back-arrow.svg"
          alt="back arrow"
          width="16"
        >
      </button>
      <p>{{ headerText }}</p>
      <button
        class="v-datepicker__change-month-button"
        aria-label="Next month"
        @click="$emit('go-to-next-month')"
      >
        <img
          src="../assets/next-arrow.svg"
          alt="next arrow"
          width="16"
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
          :key="`date-${index}`"
          :class="{'v-datepicker__month-date--selected': isSelected(date)}"
          class="v-datepicker__month-date"
          @click.prevent="$emit('pick-date', { date, currentMonth, currentYear })"
        >
          {{ date }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { dayNamesLetters } from '../helpers/date-formats';

export default {
  name: 'DatePicker',
  data: () => ({
    dayNamesLetters,
  }),
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    minDate: {
      type: String,
      default: null,
    },
    maxDate: {
      type: String,
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
  },
  computed: {
    headerText() {
      return `${moment().month(this.currentMonth).format('MMMM')} ${this.currentYear}`;
    },
    daysInCurrentMonth() {
      return moment().month(this.currentMonth).daysInMonth();
    },
    firstDayInMonth() {
      return moment([this.currentYear, this.currentMonth, 1]).weekday();
    },
  },
  methods: {
    moment,
    isSelected(date) {
      return moment(new Date(this.currentYear, this.currentMonth, date, )).isSame(this.selectedDate, 'day');
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

    @media only screen and (min-width: 50em) {
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
      opacity: 0.5;
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

  }

}
</style>
