# Vue Accessible Datepicker

⚠️**WARNING: vue-accessible-datepicker is at pre-alpha stage of development so there may be bugs and various changes made.** ⚠️

**Submit issues and feature requests [here](https://github.com/hex-digital/vue-accessible-datepicker/issues)**.

---

## **Table of Contents**
- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Roadmap](#roadmap)
- [Development](#development)
- [License](#license)

---

### **About**
VueAccessibleDatepicker is a fully customisable, AA accessible datepicker built in Vue, for Vue projects.

![Screenshot of datepicker](/docs/img/calendar-bare-bones-screenshot.jpg)

**_WCAG 2.1 AA Accessible_** - **work in progress - currently in pre-alpha stages.**

If you're curious, here's some information on how to meet WCAG 2.1 AA Accessibility:

https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&currentsidebar=%23col_customize&showtechniques=144%2C145&levels=a%2Caaa#hiddensc

To find all of the functionality that a date-picker should have, VueAccessibleDatepicker is based off of [this date picker](https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html) from [W3's website](https://www.w3.org/TR/wai-aria-practices/).

---

### **Installation**

``` bash
npm install vue-accessible-datepicker
```

or if you prefer yarn

``` bash
yarn add vue-accessible-datepicker
```

---

### **Usage**

#### **Global**

You may install the date-picker globally:

``` js
import Vue from 'vue';
import VueAccessibleDatepicker from 'vue-accessible-datepicker';

Vue.use(VueAccessibleDatepicker);
```

This will make **&lt;vue-accessible-datepicker&gt;** available to all components within your Vue app.

#### **Local**

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
---

#### **Props**
| Prop               	| Type   	| Default              	| Description                                                                                	            |
|--------------------	|--------	|----------------------	|---------------------------------------------------------------------------------------------------------|
| calendarIcon       	| String 	| Default Icon         	| Icon for the button to open the date-picker. A default icon appears if none is provided.   	            |
| customClasses      	| Object 	| {}                   	| Provide classes to override the default styles. See [customClasses](#customClasses) for more info.      |
| dateFormat         	| String 	| "MM/DD/YYYY"          | The format of the date to use for the input and calendar. See [dateFormat](#dateFormat) for more info. 	|
| initialValue       	| String 	| null                 	| Provide an initial value to the input if needed.                                           	            |
| inputPlaceholder   	| String 	| null                 	| Placeholder for the input.                                                                 	            |
| label              	| String 	| "Date (mm/dd/yyyy):" 	| "(mm/dd/yyyy)" changes depending on the dateFormat prop.                                   	            |
| minDate            	| Date   	| null                 	| Every date before the minDate is disabled.                                                 	            |
| maxDate            	| Date   	| null                 	| Every date after the maxDate is disabled.                                                  	            |
| navigateMonthIcons 	| Object 	| {}                   	| Provide custom icons for the previous and next navigation arrows. See [navigateMonthIcons](#navigateMonthIcons) for more info |
| required 	          | Boolean | false                 | Boolean for if the input is required for the form it is used in.                          	            |
| name 	              | String 	| null                  | Name for the input field                          	                                                    |

##### `customClasses`
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


**Code example:**
```html
<vue-accessible-datepicker
  :custom-classes="{
    wrapper: 'custom-datepicker-wrapper-class',
    datepickerChangeMonthButton: 'custom-datepicker-change-month-class',
    toggleButtonIcon: 'toggle-me-class',
  }"
/>
```

##### `dateFormat`
The formatting is taken from [MomentJS](https://momentjs.com).

See the docs here https://momentjs.com/docs/#/displaying/format/.

The formats accepted are:
- `MM/DD/YYYY`
- `MM-DD-YYYY`
- `DD/MM/YYYY`
- `DD-MM-YYYY`
- `YYYY/MM/DD`
- `YYYY-MM-DD`

If `dateFormat` is not provided, it defaults to `MM/DD/YYYY`.

If you type a different format of date than the `dateFormat` specified, there will be an error in the console.

**Code example:**
```html
<vue-accessible-datepicker date-format="DD-MM-YYYY" />
```

---

##### `navigateMonthIcons`
Provide src of img or svgs through the `navigateMonthIcons` prop as an object with `next` and `previous` as the keys.

**Code example:**
```html
<vue-accessible-datepicker
  :navigate-month-icons="{
    next: '/img/next-arrow.svg',
    previous: '/img/previous-arrow.svg',
  }"
/>
```

---

### **Example**
```html
<vue-accessible-datepicker
  name="start-date"
  required
  date-format="DD-MM-YYYY"
  :custom-classes="{
    wrapper: 'v-wrapper',
    input: 'v-input'
  }"
/>
```


### **Roadmap**
- Tests



### **Development**
`yarn install`

`yarn dev`


## **License**
This project is licensed under MIT - see [LICENSE.md](https://github.com/hex-digital/vue-accessible-datepicker/blob/master/LICENSE) for details.

---

© 2019 Hex Digital.

[hexdigital.com](https://hexdigital.com/)
