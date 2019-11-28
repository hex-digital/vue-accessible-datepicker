<template>
  <div
    v-on-clickaway="closeDatepicker"
    class="v-datepicker__picker"
    :class="customClasses.datepickerWrapper || ''"
    aria-modal="true"
  >
    <div
      class="v-datepicker__header"
      :class="customClasses.datepickerHeaderWrapper || ''"
    >
      <a
        href
        role="button"
        :disabled="monthIsSameMinMonth"
        :aria-label="`Previous month, ${previous.monthString} ${previous.year}`"
        class="v-datepicker__change-month-button"
        :class="{
          'v-datepicker__change-month-button--disabled': monthIsSameMaxMonth,
          [customClasses.datepickerChangeMonthButton]: customClasses.datepickerChangeMonthButton
        }"
        data-handler="previous"
        data-event="click"
        @keyup.space.capture="navigateMonth('previous')"
        @click.prevent="navigateMonth('previous')"
      >
        <img
          :src="navigateMonthIcons.previous || defaultBackArrowIcon"
          :class="customClasses.datepickerBackArrow || ''"
          alt="back arrow"
          width="18"
        >
      </a>
      <p
        id="current-month-year-header"
        aria-live="polite"
        :class="customClasses.datepickerHeader || ''"
      >{{ headerText }}</p>
      <a
        href
        role="button"
        :disabled="monthIsSameMaxMonth"
        :class="{
          'v-datepicker__change-month-button--disabled': monthIsSameMaxMonth,
          [customClasses.datepickerChangeMonthButton]: customClasses.datepickerChangeMonthButton
        }"
        :aria-label="`Next month, ${next.monthString} ${next.year}`"
        class="v-datepicker__change-month-button"
        data-handler="next"
        data-event="click"
        @keyup.space.capture="navigateMonth('next')"
        @click.prevent="navigateMonth('next')"
      >
        <img
          :src="navigateMonthIcons.next || defaultNextArrowIcon"
          :class="customClasses.datepickerNextArrow || ''"
          alt="next arrow"
          width="18"
        >
      </a>
    </div>

    <table
      class="v-datepicker__content"
      :class="customClasses.datepickerContent || ''"
      role="grid"
      aria-labelledby="current-month-year-header"
    >
      <thead class="v-datepicker__weekdays-wrapper" :class="customClasses.datepickerWeekdaysWrapper || ''">
        <tr class="v-datepicker__weekdays-row" :class="customClasses.datepickerWeekdaysRowWrapper || ''">
          <th
            scope="col"
            :abbr="dayNames[index]"
            v-for="(day, index) in dayNamesLetters"
            :key="index"
            class="v-datepicker__weekday"
            :class="customClasses.datepickerWeekday || ''"
          ><span :title="dayNames[index]">{{ day }}</span></th>
        </tr>
      </thead>

      <tbody
        class="v-datepicker__weeks"
        :class="customClasses.datepickerWeeks || ''"
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
          :class="customClasses.datepickerWeek || ''"
        >
          <td
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            class="v-datepicker__day"
            :class="customClasses.datepickerDay || ''"
          >
            <button
              v-if="day.date"
              class="v-datepicker__day-button"
              :id="isSelected(day.date) ? 'selectedDateElement' : ''"
              :aria-label="moment([day.year, day.month, day.date]).format('dddd, Do MMMM YYYY')"
              :ref="day.ref"
              :class="{
                'v-datepicker__day-button--selected': isSelected(day.date),
                'v-datepicker__day-button--disabled': isBeforeMinDate(day.date) || isAfterMaxDate(day.date),
                [customClasses.datepickerDayButton]: customClasses.datepickerDayButton
              }"
              :tabindex="day.focusable ? 0 : -1"
              :aria-selected="isSelected(day.date)"
              :aria-disabled="isBeforeMinDate(day.date) || isAfterMaxDate(day.date)"
              :disabled="isBeforeMinDate(day.date) || isAfterMaxDate(day.date)"
              @click="$emit('pick-date', { date: day.date })"
            >{{ day.date }}</button>
            <span
              v-else
              class="v-datepicker__filler-date"
              :class="customClasses.datepickerFillerDate || ''"
            >&nbsp;</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="v-datepicker__footer" :class="customClasses.datepickerFooter || ''">
      <button
        class="v-datepicker__footer-button"
        :class="customClasses.datepickerFooterButton || ''"
        aria-label="Close the calendar"
        @click="$emit('close-datepicker')"
      >Close</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { directive as onClickaway } from 'vue-clickaway';
import defaultNextArrowIcon from '@img/next-arrow.svg'
import defaultBackArrowIcon from '@img/back-arrow.svg'
import { dayNames, dayNamesLetters } from '../helpers/date-formats';
import { getFullDate } from '../helpers/dates';

export default {
  name: 'DatePicker',
  directives: { onClickaway: onClickaway },
  data: () => ({
    defaultNextArrowIcon,
    defaultBackArrowIcon,
    dayNames,
    dayNamesLetters,
    firstDateOfMonth: 1,
    currentFocusedRef: null,
  }),
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    // Arrow icons to navigate through the months.
    navigateMonthIcons: {
      type: Object,
      default: () => ({}),
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
    },
    customClasses: {
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
      // Get the first element to focus on when mounted. Either the selected date, or first available focusable date.
      const selectedElement = document.getElementById('selectedDateElement');
      const avaliableFocusableDates = document.querySelectorAll('.v-datepicker__day-button:not([tabindex="-1"])');

      if (avaliableFocusableDates && avaliableFocusableDates.length) {
        avaliableFocusableDates.forEach((date, index) => {
          if (index === 0) {
            this.currentFocusedRef = selectedElement ? this.getRefString(selectedElement.innerText) : this.getRefString(date.innerText);
            selectedElement ? selectedElement.focus() : date.focus();
          } else {
            date.setAttribute('tabindex', -1);
          }
        });
      }

      document.addEventListener('keydown', (event) => this.handleKeyPress(event));
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
    /**
     * @returns {boolean} true if the current (visible) month is the same as the minDate month
     */
    monthIsSameMinMonth() {
      if (!this.minDate) return false;
      const dateToCheck = moment(new Date(this.current.year, this.current.month));
      return moment(dateToCheck).isSame(this.minDate, 'month');
    },
    /**
     * @returns {boolean} true if the current (visible) month is the same as the maxDate month
     */
    monthIsSameMaxMonth() {
      if (!this.maxDate) return false;
      const dateToCheck = moment(new Date(this.current.year, this.current.month));
      return moment(dateToCheck).isSame(this.maxDate, 'month');
    },
    /**
     * Set up the calendar dates.
     * @returns {{ weeks: Array }}
     */
    calendar() {
      const weeks = [[], [], [], [], []];
      let week = 1;
      const daysInWeek = 7;
      /**
       * To layout day 1 on the correct weekday in the calendar,
       * get the first weekday in the month and add to the number of days in the month.
       */
      const offsetTotalDates = this.current.daysInMonth + this.firstDayInMonth;

      for (let date = this.firstDateOfMonth; date <= offsetTotalDates; date += 1) {
        if (date <= (week * daysInWeek)) {
          const isBlankDate = date <= this.firstDayInMonth; // Start the month at the correct day in the week.
          const correctDate = date - this.firstDayInMonth; // Remove the offset added at the start.
          const fullDate = this.getFullDate(correctDate);

          if (!weeks[week - 1]) return {weeks};
          weeks[week - 1].push({ // Add the date to the correct week in the weeks array.
            date: isBlankDate ? null : correctDate,
            ref: this.getRefString(correctDate),
            day: isBlankDate ? null : fullDate.format('dddd'),
            month: isBlankDate ? null : this.current.month,
            year: isBlankDate ? null : this.current.year,
            focusable: !(this.isBeforeMinDate(correctDate) || this.isAfterMaxDate(correctDate)),
          })
        }

        if (date === (week * daysInWeek)) week += 1; // If at end of week go to next week.
      }
      return {weeks};
    },
  },
  methods: {
    moment,
    closeDatepicker() {
      this.$emit('close-datepicker');
    },
    /**
     * @param {Number} date
     * @returns {Boolean} true if the selectedDate is the same as the date passed in.
     */
    isSelected(date) {
      return moment(new Date(this.current.year, this.current.month, date)).isSame(this.selectedDate, 'day');
    },
    /**
     * Used to disable all dates before the minDate.
     * @param {Number} date
     * @returns {Boolean} true if the date passed in is before the minDate prop.
     */
    isBeforeMinDate(date) {
      if (!this.minDate) return false;
      const dateToCheck = moment(new Date(this.current.year, this.current.month, date));
      return moment(dateToCheck).isBefore(moment(this.minDate), 'day');
    },
    /**
     * Used to disable all dates after the maxDate.
     * @param {Number} date
     * @returns {Boolean} true if the date passed in is after the maxDate prop.
     */
    isAfterMaxDate(date) {
      if (!this.maxDate) return false;
      const dateToCheck = moment(new Date(this.current.year, this.current.month, date));
      return moment(dateToCheck).isAfter(moment(this.maxDate), 'day');
    },
    /**
     * @param {Number} date
     * @returns {Boolean} true if the date passed is today.
     */
    isToday(date) {
      return moment().isSame(date, 'day');
    },
    /**
     * @param {String} direction "next" or "previous"
     */
    navigateMonth(direction) {
      if (direction !== 'next' && direction !== 'previous') throw new Error('"direction" param needs to be "next" or "previous"');
      this.$emit(`go-to-${direction}-month`);

      this.$nextTick(() => {
        // Once the month has been changed, focus on the first date of the month.
        const firstRefOfMonth = this.getRefString(this.firstDateOfMonth);
        const firstElementInMonth = this.$refs[firstRefOfMonth];

        // We only want one date to be tabbable, remove the focus from any other dates.
        this.removeFocusFromButtons();

        if (firstElementInMonth && firstElementInMonth.length) {
          firstElementInMonth[0].setAttribute('tabindex', 0);
          this.currentFocusedRef = firstRefOfMonth;
          firstElementInMonth[0].focus();
        }
      })
    },
    removeFocusFromButtons() {
      const focusableButtons = document.querySelectorAll('.v-datepicker__day-button:not([tabindex="-1"])');
      if (focusableButtons && focusableButtons.length) {
        focusableButtons.forEach((button) => {
          // Remove the focus from any button that does not have the date "1".
          if (button.innerText !== "1") button.setAttribute('tabindex', -1);
        })
      }
    },
    /**
     * When using keyboard to navigate through the dates we only want the focused date to be tabbable.
     */
    updateTabIndex(currentFocusedDate, newDateRef) {
      this.$refs[this.getRefString(currentFocusedDate)][0].setAttribute('tabindex', -1);
      this.$refs[newDateRef][0].setAttribute('tabindex', 0);
    },
    /**
     * @param {Number} number
     * @returns {String}
     */
    getRefString(number) {
      return `date-${number}`;
    },
    /**
     * @param {Number} date
     * @returns {String}
     */
    getFullDate(date) {
      return getFullDate({ year: this.current.year, month: this.current.month, date });
    },
    /**
     * Pressing the escape key closes the datepicker and moves focus to the input field.
     */
    handleEscapeKeyPress() {
      this.closeDatepicker();
    },
    /**
     * Pressing the left arrow key navigates the focus to the previous date.
     * If focus is on 1st of the month, change to the previous month
     * and focus on the last date of the month.
     */
    handleLeftKeyPress(event) {
      // Get the date from the event target to find the current focused date.
      const currentFocusedDate = parseInt(event.target.innerText);
      const isAtBeginningOfMonth = currentFocusedDate === this.firstDateOfMonth;
      this.$refs[this.getRefString(currentFocusedDate)][0].setAttribute('tabindex', -1);
      if (isAtBeginningOfMonth) this.$emit('go-to-previous-month');

      this.$nextTick(() => {
        const previousDate = isAtBeginningOfMonth ? this.current.daysInMonth : (currentFocusedDate - 1);
        const previousDateRef = this.getRefString(previousDate);
        const previousElement = this.$refs[previousDateRef];
        if (!previousElement || !previousElement.length) return;

        previousElement[0].setAttribute('tabindex', 0);
        this.currentFocusedRef = this.getRefString(previousDateRef);
        previousElement[0].focus();
      });
    },
    /**
     * Pressing the right arrow key navigates the focus to the next date.
     * If focus is on the last date of the month, change to the next month
     * and focus on the 1st of the month.
     */
    handleRightKeyPress(event) {
      // Get the date from the event target to find the current focused date.
      const currentFocusedDate = parseInt(event.target.innerText);
      const isAtEndOfMonth = currentFocusedDate === this.current.daysInMonth;
      this.$refs[this.getRefString(currentFocusedDate)][0].setAttribute('tabindex', -1);
      if (isAtEndOfMonth) this.$emit('go-to-next-month');

      this.$nextTick(() => {
        const nextDate = isAtEndOfMonth ? this.firstDateOfMonth : (currentFocusedDate + 1);
        const nextDateRef = this.getRefString(nextDate);
        const nextElement = this.$refs[nextDateRef];
        if (!nextElement || !nextElement.length) return;

        nextElement[0].setAttribute('tabindex', 0);
        this.currentFocusedRef = this.getRefString(nextDateRef);
        nextElement[0].focus();
      });
    },
    /**
     * Pressing the up arrow key navigates the focus to the previous weekday.
     * If in the first week of the month, go to the previous month
     * and focus on the last day of the previous month with the same weekday.
     * For example: Friday 1st November 2019 -> Go to previous month, and the last Friday of October is the 25th.
     */
    handleUpKeyPress(event) {
      // Get the date from the event target to find the current focused date.
      const currentFocusedDate = parseInt(event.target.innerText);
      const isAtBeginningOfMonth = (currentFocusedDate - 7) < this.firstDateOfMonth;
      const previousWeekDate = this.getFullDate(currentFocusedDate)
        .subtract(1, 'week').date();
      if (isAtBeginningOfMonth) this.$emit('go-to-previous-month');

      this.$nextTick(() => {
        const previousDateRef = this.getRefString(previousWeekDate);
        const previousElement = this.$refs[previousDateRef];
        if (!previousElement || !previousElement.length) return;

        previousElement[0].setAttribute('tabindex', 0);
        this.currentFocusedRef = this.getRefString(previousDateRef);
        previousElement[0].focus();
      });
    },
    /**
     * Pressing the down arrow key navigates the focus to the next weekday.
     * If in the last week of the month, go to the next month
     * and focus on the first day of the next month with the same weekday.
     * For example: Friday 29th November 2019 -> Go to next month, and the first Friday of December is the 6th.
     */
    handleDownKeyPress(event) {
      // Get the date from the event target to find the current focused date.
      const currentFocusedDate = parseInt(event.target.innerText);
      const isAtEndOfMonth = (currentFocusedDate + 7) > this.current.daysInMonth;
      const nextWeekDate = this.getFullDate(currentFocusedDate)
        .add(1, 'week').date();
      if (isAtEndOfMonth) this.$emit('go-to-next-month');

      this.$nextTick(() => {
        const nextDateRef = this.getRefString(nextWeekDate);
        const nextElement = this.$refs[nextDateRef];
        if (!nextElement || !nextElement.length) return;

        nextElement[0].setAttribute('tabindex', 0);
        this.currentFocusedRef = this.getRefString(nextDateRef);
        nextElement[0].focus();
      });
    },
    handleKeyPress(event) {
      switch (event.keyCode) {
      case 9: // TAB
        this.handleTabKeyPress();
        break;
      case 33: // PAGE UP
        this.handlePageKeyPress(event, 'previous');
        break;
      case 34: // PAGE DOWN
        this.handlePageKeyPress(event, 'next');
        break;
      case 35: // END
        this.handleHomeEndKeyPress(event);
        break;
      case 36: // HOME
        this.handleHomeEndKeyPress(event);
        break;
      default:
        break;
      }
    },
    handleTabKeyPress() {
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
    /**
     * **Page Up key press:**
     * - Changes the grid of dates to the previous month.
     * - Sets focus on the same day of the same week. If that day does not exist,
     * then moves focus to the same day of the previous or next week.
     *
     * **Shift + Page Up key press:**
     * - Changes the grid of dates to the previous Year.
     * - Sets focus on the same day of the same week. If that day does not exist,
     * then moves focus to the same day of the previous or next week.
     *
     * **Page Down key press:**
     * - Changes the grid of dates to the next month.
     * - Sets focus on the same day of the same week. If that day does not exist,
     * then moves focus to the same day of the previous or next week.
     *
     * **Shift + Page Down key press:**
     * - Changes the grid of dates to the next Year.
     * - Sets focus on the same day of the same week. If that day does not exist,
     * then moves focus to the same day of the previous or next week.
     */
    handlePageKeyPress(event, direction) {
      const currentFocusedDate = parseInt(event.target.innerText);
      this.$refs[this.getRefString(currentFocusedDate)][0].setAttribute('tabindex', -1);
      event.shiftKey ? this.$emit('change-year', direction) : this.navigateMonth(direction);

      this.$nextTick(() => {
        const newElementRef = this.getRefString(currentFocusedDate);
        const newElementToSelect = this.$refs[newElementRef];

        if (newElementToSelect && newElementToSelect.length) {
          // If that date is available, focus on that.
          newElementToSelect[0].setAttribute('tabindex', 0);
          this.currentFocusedRef = this.getRefString(newElementRef);
          newElementToSelect[0].focus();
        } else {
          // Othewise focus on the next available date.
          const alternativeElementRef = this.getRefString(direction === 'next' ? currentFocusedDate + 7 : currentFocusedDate - 7);
          const alternativeElementToSelect = this.$refs[alternativeElementRef];
          if (!alternativeElementToSelect) return;

          alternativeElementToSelect[0].setAttribute('tabindex', 0);
          this.currentFocusedRef = alternativeElementRef;
          alternativeElementToSelect[0].focus();
        }
      });
    },
    /**
     * **Home key press:**
     * - Moves focus to the first day (e.g Sunday) of the current week.
     *
     * **End key press:**
     * - Moves focus to the last day (e.g. Saturday) of the current week.
     */
    handleHomeEndKeyPress(event) {
      const actions = {
        perimeterFunction: event.keyCode === 35 ? 'endOf' : 'startOf',
        direction: event.keyCode === 35 ? 'next' : 'previous',
      };
      const currentFocusedDate = parseInt(event.target.innerText);
      this.$refs[this.getRefString(currentFocusedDate)][0].setAttribute('tabindex', -1);
      const fullDate = this.getFullDate(currentFocusedDate);
      const nextDate = this.getFullDate(currentFocusedDate)[actions.perimeterFunction]('week');

      if (!fullDate.isSame(nextDate, 'month')) this.navigateMonth(actions.direction);

      this.$nextTick(() => {
        const nextRef = this.getRefString(nextDate.get('date'));
        const nextElement = this.$refs[nextRef];
        if (!nextElement) return;

        nextElement[0].setAttribute('tabindex', 0);
        this.currentFocusedRef = nextRef;
        nextElement[0].focus();
      });
    },
  },
}
</script>

<style lang="scss">
$light-grey: #dbdbdb;

.v-datepicker {
  &__picker {
    background-color: white;
    border: 1px solid $light-grey;
    font-family: inherit;
    width: fit-content;
  }

  &__header {
    align-items: center;
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
