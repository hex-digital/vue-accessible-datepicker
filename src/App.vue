<template>
  <div id="app">
      <label id="datepickerLabel" for="datepicker">Date (mm/dd/yyyy):</label>
      <div class="v-datepicker__input-wrapper">
        <input type="text" id="datepicker">
        <button @click="showDatePicker">
          <img src="https://dequeuniversity.com/assets/images/calendar.png" alt="calendar icon">
        </button>
      </div>
      <date-picker :is-visible="isDatePickerVisible"/>
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
  }),
  methods: {
    showDatePicker() {
      this.isDatePickerVisible = true;
    }
  }
}
</script>
