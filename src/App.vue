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
        <input type="text" id="datepicker" class="v-datepicker__input" v-model="dateSelected">
        <button @click="toggleDatePicker" class="v-datepicker__toggle-button">
          <img src="./assets/calendar.svg" alt="calendar icon" class="v-datepicker__toggle-button-icon">
        </button>
      </div>
      <date-picker :is-visible="isDatePickerVisible" @date-picked="handleDatePicked" />
  </div>
</template>

<script>
import DatePicker from './components/DatePicker';

export default {
  name: 'app',
  components: {
    DatePicker,
  },
  data: () => ({
    isDatePickerVisible: false,
    dateSelected: null,
  }),
  methods: {
    toggleDatePicker() {
      this.isDatePickerVisible = !this.isDatePickerVisible;
    },
    handleDatePicked(date) {
      this.dateSelected = date.format('MM/DD/YYYY');
      this.isDatePickerVisible = false;
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
