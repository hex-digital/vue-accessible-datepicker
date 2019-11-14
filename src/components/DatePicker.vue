<template>
  <div v-if="isVisible" class="v-datepicker">
    <div class="v-datepicker__header">
      <button class="v-datepicker__change-month-button" aria-label="Previous month" @click="goToPreviousMonth">
        <img
          src="../assets/back-arrow.svg"
          alt="back arrow"
          width="15"
        >
      </button>
      <p>{{ headerText }}</p>
      <button class="v-datepicker__change-month-button" aria-label="Next month" @click="goToNextMonth">
        <img
          src="../assets/next-arrow.svg"
          alt="next arrow"
          width="15"
        >
      </button>
    </div>

    <div class="v-datepicker__content">
      <ul class="v-datepicker__weekdays">
        <li v-for="(day, index) in dayNamesLetters" :key="index" class="v-datepicker__weekday">{{ day }}</li>
      </ul>
      <ul class="v-datepicker__month-dates">
        <li v-for="(blank, index) in firstDayInMonth" :key="`blank-${index}`" class="v-datepicker__month-date">&nbsp;</li>
        <a
          href
          v-for="(date, index) in daysInCurrentMonth"
          :key="`date-${index}`"
          :class="{'v-datepicker__month-date--selected': date === selectedDate}"
          class="v-datepicker__month-date"
          @click.prevent="selectDate(date)"
        >
          {{ date }}
        </a>
      </ul>
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
    currentDate: moment().get('date'),
    currentMonth: moment().get('month'),
    currentYear: moment().get('year'),
    selectedDate: moment().get('date'),
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
    }
  },
  computed: {
    headerText() {
      return `${moment().month(this.currentMonth).format('MMMM')} ${this.currentYear}`;
    },
    daysInCurrentMonth() {
      return moment().month(this.currentMonth).daysInMonth();
    },
    firstDayInMonth() {
      return moment().subtract(this.currentDate - 1, 'days').weekday();
    },
  },
  methods: {
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
    selectDate(date) {
      this.selectedDate = date;
    }
  }
}
</script>

<style lang="scss">
$dark-grey: #414141;
$light-grey: #dbdbdb;
$white: #ffffff;

.v-datepicker {
  background-color: $light-grey;
  border-radius: 5px;
  color: $dark-grey;
  font-family: Arial, Helvetica, sans-serif;
  padding: 1em 1.5em 1.5em 1.5em;

  @media only screen and (min-width: 600px) {
    max-width: 20em;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
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
    color: $dark-grey;
    padding: 0.75em;
    text-decoration: none;
    transition-property: background-color, color;
    transition-timing-function: ease;
    transition-duration: 0.3s;

    &:hover {
      background-color: $dark-grey;
      color: $white;
    }

  }

}

.v-datepicker__month-date--selected {
  background-color: $dark-grey;
  color: $white;
}
</style>
