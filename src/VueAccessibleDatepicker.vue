<template>
  <div class="v-datepicker" :class="customClasses.wrapper || ''">
      <div class="v-datepicker__input-container" :class="customClasses.inputContainer || ''">
        <div class="v-datepicker__input-wrapper" :class="customClasses.inputWrapper || ''">
          <label
            id="datepickerLabel"
            for="datepicker"
            class="v-datepicker__input-label"
            :class="customClasses.inputLabel || ''"
          >{{ labelText }}</label>
          <slot class="v-datepicker__input-error" :class="customClasses.inputError || ''" />
          <input
            id="datepicker"
            type="text"
            class="v-datepicker__input"
            :class="customClasses.input || ''"
            :required="required"
            :name="name"
            :aria-required="required"
            :placeholder="inputPlaceholder"
            aria-autocomplete="none"
            v-model="selectedDateInput"
            @blur="handleInputBlur"
            @focus="$emit('input-focus', selectedDate)"
          >
        </div>
        <button
          id="datepicker-toggle-button"
          class="v-datepicker__toggle-button"
          :class="customClasses.toggleButton || ''"
          aria-describedby="datepickerLabel"
          :aria-label="buttonAriaLabel"
          type="button"
          @click.prevent="toggleDatePicker(!isDatePickerVisible)"
        >
          <img
            :src="calendarIcon || defaultCalendarIcon"
            alt="calendar icon"
            class="v-datepicker__toggle-button-icon"
            :class="customClasses.toggleButtonIcon || ''"
          >
        </button>
      </div>

      <date-picker
        v-if="isDatePickerVisible || opened"
        :aria-hidden="!isDatePickerVisible || opened"
        :selected-date="selectedDate"
        :current="current"
        :next="nextMonth"
        :previous="previousMonth"
        :min-date="minDate"
        :max-date="maxDate"
        :navigate-month-icons="navigateMonthIcons"
        :custom-classes="customClasses"
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
import defaultCalendarIcon from '@img/calendar.svg'
import DatePicker from './components/DatePicker';
import { resetFormat } from './helpers/date-formats';

export default {
  name: 'VueAccessibleDatepicker',
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
    customClasses: {
      type: Object,
      default: () => ({}),
    },
    dateFormat: {
      type: String,
      // https://momentjs.com/docs/#/displaying/format/
      default: 'MM/DD/YYYY',
      validator(value) {
        return [
            'MM/DD/YYYY',
            'MM-DD-YYYY',
            'DD/MM/YYYY',
            'DD-MM-YYYY',
            'YYYY/MM/DD',
            'YYYY-MM-DD',
        ].indexOf(value) !== -1;
      },
    },
    initialValue: {
      type: String,
      default: null,
    },
    inputPlaceholder: {
      type: String,
      default: null,
    },
    // Text for the label
    label: {
      type: String,
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
    },
    // Arrow icons to navigate through the months.
    navigateMonthIcons: {
      type: Object,
      default: () => ({}),
    },
    required: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: null,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonAriaLabel() {
      const selectedDate = this.selectedDate
        ? moment(this.selectedDate).format('dddd MMMM Do, YYYY')
        : null;
      return `Choose date${selectedDate ? `, selected date is ${selectedDate}` : ''}`
    },
    labelText() {
      return this.label || `Date (${this.dateFormat.toLocaleLowerCase()}):`;
    }
  },
  beforeMount() {
    if (this.initialValue) {
      this.selectedDateInput = this.initialValue;
    }
  },
  watch: {
    selectedDateInput(oldValue, newValue) {
      if (oldValue !== newValue) this.$emit('input-change', oldValue);
    }
  },
  methods: {
    resetFormat,
    handleInputBlur() {
      this.$emit('input-blur', this.selectedDateInput);
      this.selectDate({ input: true });
    },
    toggleDatePicker(isVisible) {
      this.isDatePickerVisible = isVisible;
      if (!this.isDatePickerVisible) {
        const toggleButton = document.getElementById('datepicker-toggle-button');
        if (toggleButton) toggleButton.focus();
      }
    },
    selectDate({ date = 1, input = false }) {
      const inputDate = input ? resetFormat(this.selectedDateInput, this.dateFormat) : null;

      const newDate = moment(input && inputDate
        ? new Date(inputDate)
        : new Date(this.current.year, this.current.month, date)
      );

      if (input) {
        if (newDate._isValid && this.selectedDateInput.length === 10) {
          this.updateCurrentDates({ year: newDate.get('year'), month: newDate.get('month') });
          this.selectedDate = newDate.format(this.dateFormat);
        } else {
          this.updateCurrentDates({ year: moment().get('year'), month: moment().get('month') });
        }
      } else {
        // If date was not selected via the input then set the value.
        this.selectedDateInput = newDate.format(this.dateFormat);
        this.selectedDate = newDate.format(this.dateFormat);
        this.$emit('date-selected', this.selectedDateInput);
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
  font-family: inherit;

  &__input-label {
    display: block;
    margin-bottom: 0.5em;
  }

  &__input-container {
    align-items: flex-end;
    display: flex;
    margin-bottom: 0.5em;
  }

  &__input {
    box-sizing: border-box;
    font-family: inherit;
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
