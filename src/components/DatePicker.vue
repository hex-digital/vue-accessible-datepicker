<template>
  <div
    class="v-datepicker__picker"
    role="application"
    aria-label="Calendar view date-picker"
  >
    <div class="v-datepicker__header">
      <a
        href
        role="button"
        :disabled="monthIsSameMinMonth"
        :class="{'v-datepicker__change-month-button--disabled': monthIsSameMinMonth}"
        :aria-label="`Previous month, ${previous.monthString} ${previous.year}`"
        class="v-datepicker__change-month-button"
        data-handler="previous"
        data-event="click"
        @keyup.space.capture="navigateMonth('previous')"
        @click.prevent="navigateMonth('previous')"
      >
        <img
          :src="navigateMonthIcons && navigateMonthIcons.previous
            ? navigateMonthIcons.previous : defaultBackArrowIcon"
          alt="back arrow"
          width="18"
        >
      </a>
      <p>{{ headerText }}</p>
      <a
        href
        role="button"
        :disabled="monthIsSameMaxMonth"
        :class="{'v-datepicker__change-month-button--disabled': monthIsSameMaxMonth}"
        :aria-label="`Next month, ${next.monthString} ${next.year}`"
        class="v-datepicker__change-month-button"
        data-handler="next"
        data-event="click"
        @keyup.space.capture="navigateMonth('next')"
        @click.prevent="navigateMonth('next')"
      >
        <img
          :src="navigateMonthIcons && navigateMonthIcons.next
            ? navigateMonthIcons.next : defaultNextArrowIcon"
          alt="next arrow"
          width="18"
        >
      </a>
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

      <tbody
        class="v-datepicker__weeks"
        @keyup.esc="handleEscapeKeyPress"
        @keyup.left="handleLeftKeyPress($event)"
        @keyup.right="handleRightKeyPress($event)"
        @keyup.up="handleUpKeyPress($event)"
        @keyup.down="handleDownKeyPress($event)"
      >
        <tr
          v-for="(week, weekIndex) in calendar.weeks"
          :key="`week-${weekIndex}`"
          class="v-datepicker__week"
        >
          <td
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            class="v-datepicker__day"
            data-handler="selectDay"
            data-event="click"
            :data-day="day.date"
            :data-month="day.month + 1"
            :data-year="day.year"
          >
            <button
              v-if="day.date"
              class="v-datepicker__day-button"
              :id="isSelected(day.date) ? 'selectedDateElement' : ''"
              :aria-label="moment([day.year, day.month, day.date]).format('dddd, Do MMMM YYYY')"
              :ref="day.ref"
              :class="{
                'v-datepicker__day-button--selected': isSelected(day.date),
                'v-datepicker__day-button--disabled': isBeforeMinDate(day.date) || isAfterMaxDate(day.date)
              }"
              :tabindex="day.focusable ? 0 : -1"
              @click="$emit('pick-date', { date: day.date })"
            >{{ day.date }}</button>
            <span v-else class="v-datepicker__filler-date">&nbsp;</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="v-datepicker__footer">
      <button @click="$emit('close-datepicker')" class="v-datepicker__footer-button">Close</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import defaultNextArrowIcon from '../assets/next-arrow.svg'
import defaultBackArrowIcon from '../assets/back-arrow.svg'
import { dayNames, dayNamesLetters } from '../helpers/date-formats';
import { getFullDate } from '../helpers/dates';
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
    defaultNextArrowIcon,
    defaultBackArrowIcon,
    dayNames,
    dayNamesLetters,
    ESC,
    LEFT,
    UP,
    RIGHT,
    DOWN,
    firstDateOfMonth: 1,
    currentFocusedRef: null,
  }),
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    navigateMonthIcons: {
      type: Object,
      default: null,
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
      default: null,
    },
    current: {
      type: Object,
      required: true,
    },
    previous: {
      type: Object,
      required: true,
    },
    next: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      const selectedElement = document.getElementById('selectedDateElement');
      const firstOfMonthRef = this.getRefString(this.firstDateOfMonth);
      const firstDateOfMonthElement = this.$refs[firstOfMonthRef];
      document.addEventListener('keydown', (event) => this.handleKeyPress(event));
      if (selectedElement || firstDateOfMonthElement) {
        this.currentFocusedRef = selectedElement ? this.getRefString(selectedElement.innerText) : firstOfMonthRef;
        selectedElement ? selectedElement.focus() : firstDateOfMonthElement[0].focus();
      }
    });
  },
  destroyed() {
    document.removeEventListener('keydown', (event) => this.handleKeyPress(event));
  },
  computed: {
    headerText() {
      return `${moment().month(this.current.month).format('MMMM')} ${this.current.year}`;
    },
    firstDayInMonth() {
      return moment([this.current.year, this.current.month, 1]).weekday();
    },
    monthIsSameMinMonth() {
      if (!this.minDate) return false;
      const dateToCheck = moment(new Date(this.current.year, this.current.month));
      return moment(dateToCheck).isSame(this.minDate, 'month');
    },
    monthIsSameMaxMonth() {
      if (!this.maxDate) return false;
      const dateToCheck = moment(new Date(this.current.year, this.current.month));
      return moment(dateToCheck).isSame(this.maxDate, 'month');
    },
    calendar() {
      const weeks = [[], [], [], [], []];
      let week = 1;
      const daysInWeek = 7;

      for (let date = this.firstDateOfMonth; date <= (this.current.daysInMonth + this.firstDayInMonth); date += 1) {
        if (date <= (week * daysInWeek)) {
          const isBlankDate = date <= this.firstDayInMonth; // Start the month at the correct day in the week.
          const correctDate = date - this.firstDayInMonth;
          const fullDate = getFullDate({ year: this.current.year, month: this.current.month, date: correctDate });

          if (!weeks[week - 1]) return {weeks};
          weeks[week - 1].push({
            date: isBlankDate ? null : correctDate,
            ref: this.getRefString(correctDate),
            day: isBlankDate ? null : fullDate.format('dddd'),
            month: isBlankDate ? null : this.current.month,
            year: isBlankDate ? null : this.current.year,
            focusable: (correctDate) === this.firstDateOfMonth,
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
      return moment(new Date(this.current.year, this.current.month, date)).isSame(this.selectedDate, 'day');
    },
    isBeforeMinDate(date) {
      if (!this.minDate) return false;
      const dateToCheck = moment(new Date(this.current.year, this.current.month, date));
      return moment(dateToCheck).isBefore(this.minDate, 'day');
    },
    isAfterMaxDate(date) {
      if (!this.maxDate) return false;
      const dateToCheck = moment(new Date(this.current.year, this.current.month, date));
      return moment(dateToCheck).isAfter(this.maxDate, 'day');
    },
    isToday(date) {
      return moment().isSame(date, 'day')
    },
    handleEscapeKeyPress() {
      this.$emit('close-datepicker');
      const dateInput = document.getElementById('datepicker');
      if (dateInput) dateInput.focus();
    },
    handleLeftKeyPress(event) {
      const currentFocusedDate = parseInt(event.target.innerText);
      const isAtBeginningOfMonth = currentFocusedDate === this.firstDateOfMonth;
      if (isAtBeginningOfMonth) this.$emit('go-to-previous-month');

      this.$nextTick(() => {
        const previousDate = isAtBeginningOfMonth ? this.current.daysInMonth : (currentFocusedDate - 1);
        const previousDateRef = this.getRefString(previousDate);
        const previousElement = this.$refs[previousDateRef];
        if (!previousElement || !previousElement.length) return;
        this.updateTabIndex(currentFocusedDate, previousDateRef);
        this.currentFocusedRef = this.getRefString(previousDateRef);
        previousElement[0].focus();
      });
    },
    handleRightKeyPress(event) {
      const currentFocusedDate = parseInt(event.target.innerText);
      const isAtEndOfMonth = currentFocusedDate === this.current.daysInMonth;
      if (isAtEndOfMonth) this.$emit('go-to-next-month');

      this.$nextTick(() => {
        const nextDate = isAtEndOfMonth ? this.firstDateOfMonth : (currentFocusedDate + 1);
        const nextDateRef = this.getRefString(nextDate);
        const nextElement = this.$refs[nextDateRef];
        if (!nextElement || !nextElement.length) return;
        this.updateTabIndex(currentFocusedDate, nextDateRef);
        this.currentFocusedRef = this.getRefString(nextDateRef);
        nextElement[0].focus();
      });
    },
    handleUpKeyPress(event) {
      const currentFocusedDate = parseInt(event.target.innerText);
      const isAtBeginningOfMonth = (currentFocusedDate - 7) < this.firstDateOfMonth;
      const previousWeekDate = getFullDate({ year: this.current.year, month: this.current.month, date: currentFocusedDate })
        .subtract(1, 'week').date();
      if (isAtBeginningOfMonth) this.$emit('go-to-previous-month');

      this.$nextTick(() => {
        const previousDateRef = this.getRefString(previousWeekDate);
        const previousElement = this.$refs[previousDateRef];
        if (!previousElement || !previousElement.length) return;
        this.updateTabIndex(currentFocusedDate, previousDateRef);
        this.currentFocusedRef = this.getRefString(previousDateRef);
        previousElement[0].focus();
      });
    },
    handleDownKeyPress(event) {
      const currentFocusedDate = parseInt(event.target.innerText);
      const isAtEndOfMonth = (currentFocusedDate + 7) > this.current.daysInMonth;
      const nextWeekDate = getFullDate({ year: this.current.year, month: this.current.month, date: currentFocusedDate })
        .add(1, 'week').date();
      if (isAtEndOfMonth) this.$emit('go-to-next-month');

      this.$nextTick(() => {
        const nextDateRef = this.getRefString(nextWeekDate);
        const nextElement = this.$refs[nextDateRef];
        if (!nextElement || !nextElement.length) return;
        this.updateTabIndex(currentFocusedDate, nextDateRef);
        this.currentFocusedRef = this.getRefString(nextDateRef);
        nextElement[0].focus();
      });
    },
    updateTabIndex(currentFocusedDate, newDateRef) {
      this.$refs[this.getRefString(currentFocusedDate)][0].setAttribute('tabindex', -1);
      this.$refs[newDateRef][0].setAttribute('tabindex', 0);
    },
    getRefString(number) {
      return `date-${number}`;
    },
    getDateFromRef(ref) {
      return ref.split('-')[1];
    },
    handleKeyPress(event) {
      if (event.keyCode !== 9) return; // Don't do anything if it is not a tab key press.

      // Create a focus trap when the datepicker is open.
      const focusableElements = document.querySelectorAll(
        '.v-datepicker__change-month-button:not([disabled]), .v-datepicker__day-button:not([tabindex="-1"]), .v-datepicker__footer-button',
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) { // If shift key is pressed, go backwards.
        if (event.target === firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        }
      } else { // Otherwise go forwards.
        if (event.target === lastFocusableElement) {
          event.preventDefault();
          firstFocusableElement.focus();
        }
      }
    },
    navigateMonth(direction) {
      this.$emit(`go-to-${direction}-month`);

      this.$nextTick(() => {
        const firstRefOfMonth = this.getRefString(this.firstDateOfMonth);
        const firstElementInMonth = this.$refs[firstRefOfMonth];

        this.removeFocusFromButtons();

        if (firstElementInMonth && firstElementInMonth.length) {
          firstElementInMonth[0].setAttribute('tabindex', 0);
          this.currentFocusedRef = firstRefOfMonth;
          firstElementInMonth[0].focus();
        }
      })
    },
    removeFocusFromButtons() {
      const focusableButtons = document.querySelectorAll('.v-datepicker__day-button:not([tabindex="-1"');
      if (focusableButtons && focusableButtons.length) {
        focusableButtons.forEach((button) => {
          if (button.innerText !== "1") button.setAttribute('tabindex', -1);
        })
      }
    }
  },
}
</script>

<style lang="scss">
$light-grey: #dbdbdb;

.v-datepicker {
  &__picker {
    background-color: white;
    border: 1px solid $light-grey;
    font-family: Arial, Helvetica, sans-serif;

    @media only screen and (min-width: 40em) {
      max-width: 23em;
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
    border-spacing: 0;
    padding: 0.5em 0.5em 0 0.5em;
    width: 100%;
  }

  &__weekday {
    padding-bottom: 0.5em;
  }

  &__change-month-button {
    display: flex;
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
    font-size: initial;
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

  &__footer {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    padding: 0.5em;

    &-button {
      background: none;
      border: 1px solid $light-grey;
      cursor: pointer;
      font-size: initial;
      height: 2em;
      transition: opacity 0.3s ease;
      width: 4em;

      &:hover {
        opacity: 0.5;
      }
    }
  }

}
</style>
