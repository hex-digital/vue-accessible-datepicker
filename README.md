# Vue Accessible Datepicker

**WARNING: vue-accessible-datepicker is at pre-alpha stage of development and may undergo significant changes.**

**Submit issues and feature requests [here](https://github.com/hex-digital/vue-accessible-datepicker/issues)**.

## **Table of Contents**
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [License](#license)

## **Installation**

``` bash
npm install vue-accessible-datepicker
```

or if you prefer yarn

``` bash
yarn add vue-accessible-datepicker
```

## **Usage**

### **Global**

You may install Vue Carousel globally:

``` js
import Vue from 'vue';
import VueAccessibleDatepicker from 'vue-accessible-datepicker';

Vue.use(VueAccessibleDatepicker);
```
This will make **&lt;vue-accessible-datepicker&gt;** available to all components within your Vue app.

### **Local**

Include the datepicker directly into your component using import:

``` js
import VueAccessibleDatepicker from 'vue-accessible-datepicker';

export default {
  ...
  components: {
    VueAccessibleDatepicker,
  }
  ...
};
```

### **Props**
| Prop               	| Type   	| Default              	| Description                                                                                	|
|--------------------	|--------	|----------------------	|--------------------------------------------------------------------------------------------	|
| calendarIcon       	| String 	| Default Icon         	| Icon for the button to open the date-picker. A default icon appears if none is provided.   	|
| customClasses      	| Object 	| {}                   	| Provide classes to override the default styles. See [customClasses](#customClasses) for more info.        	|
| dateFormat         	| String 	| "MM/DD/YYYY"          | The format of the date to use for the input and calendar. See [dateFormat](#dateFormat) for more info. 	|
| initialValue       	| String 	| null                 	| Provide an initial value to the input if needed.                                           	|
| inputPlaceholder   	| String 	| null                 	| Placeholder for the input.                                                                 	|
| label              	| String 	| "Date (mm/dd/yyyy):" 	| "(mm/dd/yyyy)" changes depending on the dateFormat prop.                                   	|
| minDate            	| Date   	| null                 	| Every date before the minDate is disabled.                                                 	|
| maxDate            	| Date   	| null                 	| Every date after the maxDate is disabled.                                                  	|
| navigateMonthIcons 	| Object 	| {}                   	| Provide custom icons for the previous and next navigation arrows.                          	|

#### `customClasses`
Provide custom classes in an object via the prop `customClasses`.

The aim of this prop is to make the calendar as customisable as possible.

Available classes:
- Classes for the wrapper container with input and button:
  - `wrapper`
  - `inputLabel`
  - `inputWrapper`
  - `input`
  - `toggleButton`
  - `toggleButtonIcon`
- Classes for the datepicker:
  - `datepickerWrapper`
  - `datepickerHeaderWrapper`
  - `datepickerChangeMonthButton` - for both next and previous buttons.
  - `datepickerBackArrow` - for the icon itself.
  - `datepickerHeader`
  - `datepickerNextArrow` - for the icon itself.
  - `datepickerContent` - the wrapper for the table element itself. Houses the calendar.
  - `datepickerWeekdaysWrapper` - On the `<thead>` element. Wraps the header part with the list of weekdays.
  - `datepickerWeekdaysRowWrapper` - On the `<tr>` element. Wraps the list of weekdays.
  - `datepickerWeekday` - On each `<th>` element (each weekday).
  - `datepickerWeeks` - On the `<tbody>` element.
  - `datepickerWeek` - On the `<tr>` element, wraps each week.
  - `datepickerDay` - On the `<td>` element, wraps each day button.
  - `datepickerDayButton` - On the `<button>` in each `td`.
  - `datepickerFillerDate` - On each blank `<td>` to make each month start on the correct day of the week.
  - `datepickerFooter` - Footer wrapper with the close button.
  - `datepickerFooterButton`

#### `dateFormat`


## **Development**
To begin development, run:

``` bash
yarn install
yarn dev
```

then navigate to `http://localhost:8080`

## **License**
TODO
