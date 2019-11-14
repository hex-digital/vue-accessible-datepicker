<template>
  <div v-if="isVisible" class="v-datepicker">
    <div class="v-datepicker__header">
      <button aria-label="Previous month" @click="goToPreviousMonth">
        <img
          src="../assets/back-arrow.svg"
          alt="back arrow"
          width="15"
        >
      </button>
      <p>{{ headerText }}</p>
      <button aria-label="Next month" @click="goToNextMonth">
        <img
          src="../assets/next-arrow.svg"
          alt="next arrow"
          width="15"
        >
      </button>
    </div>

    <div class="v-datepicker__content"></div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'DatePicker',
  data: () => ({
    currentMonth: moment().month(),
    currentYear: moment().get('year'),
    // daysInCurrentMonth: this.currentMonth.daysInMonth(),
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
    }
  }
}
</script>
