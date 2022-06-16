<template>
  <div class="op-calendar-pc">
    <div class="op-calendar-pc-box">
      <div class="op-calendar-pc-left">
        <div class="op-calendar-pc-select-box" style="visibility: visible">
          <div class="op-calendar-pc-year-box">
            <Select
              v-model:value="selectYear"
              style="width: 100px"
              @change="handleChange"
            >
              <Option
                v-for="item of yearsOptions"
                :value="item.value"
                :key="item.value"
              >
                {{ item.text }}
              </Option>
            </Select>
          </div>
          <div class="op-calendar-pc-holiday-box">
            <Select
              v-model:value="selectMonth"
              style="width: 100px"
              @change="handleChangeMonth"
            >
              <Option
                v-for="item of monthOptions"
                :value="item.value"
                :key="item.value"
              >
                {{ item.text }}
              </Option>
            </Select>
          </div>
          <div class="op-calendar-pc-holiday-box">
            <Select style="width: 100px" @change="handleChangeDate">
              <Option
                v-for="item of HOLIDAY"
                :value="item.date"
                :key="item.date"
              >
                {{ item.name }}
              </Option>
            </Select>
          </div>
          <span
            class="op-calendar-pc-backtoday OP_LOG_BTN"
            hidefocus="true"
            @click="returnToday"
            >返回今天</span
          >
        </div>
        <div class="op-calendar-pc-table-box">
          <table class="op-calendar-pc-table">
            <tbody>
              <tr style="text-align: center">
                <th>一</th>
                <th>二</th>
                <th>三</th>
                <th>四</th>
                <th>五</th>
                <th class="op-calendar-pc-table-weekend">六</th>
                <th class="op-calendar-pc-table-weekend">日</th>
              </tr>
              <tr v-for="lineDateArray of fullDateArray">
                <td v-for="item of lineDateArray" key="item.date">
                  <div class="op-calendar-pc-relative">
                    <a
                      href="javascript:void(0);"
                      :class="{
                        'op-calendar-pc-table-selected': item.isSelectClass,
                        'op-calendar-pc-table-other-month': item.otherMonth,
                        'op-calendar-pc-table-festival': item.hasTerm,
                        'op-calendar-pc-table-weekend': item.isWeekend,
                        'op-calendar-pc-table-work': item.isWorkDay,
                        'op-calendar-pc-table-rest': item.isRestDay,
                      }"
                      :date="item.date"
                      @click="selectDayAction"
                    >
                      <span
                        class="op-calendar-pc-table-holiday-sign"
                        v-if="item.isWorkDay"
                        >班</span
                      >
                      <span
                        class="op-calendar-pc-table-holiday-sign"
                        v-if="item.isRestDay"
                        >休</span
                      >
                      <span class="op-calendar-pc-daynumber">{{
                        item.day
                      }}</span>
                      <span class="op-calendar-pc-table-almanac">{{
                        item.d_day
                      }}</span>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="op-calendar-pc-right">
        <p class="op-calendar-pc-right-date">{{ selectDayDate }}</p>
        <p class="op-calendar-pc-right-day">{{ dayInfo.cDay }}</p>
        <p class="op-calendar-pc-right-lunar c-gap-top-small">
          <span>{{ dayInfo.monthCn }}{{ dayInfo.dayCn }}</span
          ><span>{{ dayInfo.gzYear }}年 {{ dayInfo.animal }}</span
          ><span>{{ dayInfo.gzMonth }}月 {{ dayInfo.gzDay }}日</span>
        </p>
        <p class="op-calendar-pc-right-holid1" v-if="dayInfo.lunarFestival">
          {{ dayInfo.lunarFestival }}
        </p>
        <p class="op-calendar-pc-right-holid1" v-if="dayInfo.festival">
          {{ dayInfo.festival }}
        </p>
        <div
          :class="{
            'op-calendar-pc-right-almanacbox': true,
            'op-calendar-pc-right-hover': hoverClass,
          }"
        >
          <div
            class="op-calendar-pc-right-almanac"
            @mouseover="isHover"
            @mouseout="isHover"
          >
            <span class="op-calendar-pc-right-suit"
              ><i>宜</i
              >搬家<br />装修<br />开业<br />结婚<br />入宅<br />领证<br />开工<br />动土<br />出行</span
            >
            <span class="op-calendar-pc-right-avoid"
              ><i>忌</i
              >祈福<br />纳畜<br />经络<br />栽种<br />斋醮<br />词讼<br />置产</span
            >
          </div>
          <div class="op-calendar-hover-almanac">
            <span class="op-calendar-hover-suit"
              ><i>宜</i
              >搬家、装修、开业、结婚、入宅、领证、开工、动土、出行、订婚、上梁、开张、旅游、入学、赴任、修造、祭祀、开市、纳财、裁衣、嫁娶、纳采、移徙、盖屋、立券、求医、竖柱、求财</span
            >
            <span class="op-calendar-hover-avoid"
              ><i>忌</i>祈福、纳畜、经络、栽种、斋醮、词讼、置产</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="op-calendar-pc-holidaytip"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, defineEmit, defineProps } from "vue";
import mGetDate from "./utils/mGetDate.js";
import solarLunar from "./utils/solarLunar.js";
// import { Select } from "ant-design-vue";
import Select from "ant-design-vue/es/select/index.js";
import "ant-design-vue/es/select/style/index.css";
import nextDay from "./utils/nextDay.js";
import lastDay from "./utils/lastDay.js";
import {
  LUNAR_FESTIVAL,
  FESTIVAL,
  ARRANGE_HOLIDAY,
  WORKING_DAYS,
  HOLIDAY,
} from "./utils/lunarFestival.js";
const { Option } = Select;
// import solarLunar from "solarlunar-es";

// 选中的日期
const selectDayDate = ref("");
const fullDateArray = ref([]);
const emit = defineEmit(["change"]);

const props = defineProps({
  date: String,
  range: {
    type: Array,
    default: [2010, 2030],
  },
});

// 选中的日
const selectDay = ref("");
// 选中的月
const selectMonth = ref("");
// 选中的年
const selectYear = ref("2021");
const yearsOptions = [];
let dayInfo = ref({});
let time = new Date();
dayInfo.value = solarLunar.solar2lunar(
  time.getFullYear(),
  time.getMonth() + 1,
  time.getDate()
);
for (let i = props.range[0]; i < props.range[1]; i++) {
  yearsOptions.push({
    value: i,
    text: i + "年",
  });
}
const monthOptions = [];
for (let i = 1; i <= 12; i++) {
  monthOptions.push({
    value: i,
    text: i + "月",
  });
}
const handleChange = (value) => {
  selectYear.value = value;
  selectDayDate.value = [
    value,
    selectDayDate.value.split("-")[1],
    selectDayDate.value.split("-")[2],
  ].join("-");
  nextTick(generate);
};
const handleChangeMonth = (value) => {
  selectMonth.value = value;
  selectDayDate.value = [
    selectDayDate.value.split("-")[0],
    value,
    selectDayDate.value.split("-")[2],
  ].join("-");
  nextTick(generate);
};

// calendar.solar2lunar(1987,11,01);
const init = () => {
  getDateToday();
  if (props.date) {
    selectDayDate.value = props.date;
  }
  generate();
  //   0-6 7-12
};
//获取今天
const getDateToday = () => {
  let today = new Date();
  let fullYear = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  selectDay.value = today;
  selectYear.value = fullYear;
  selectMonth.value = month;
  selectDayDate.value = [fullYear, month, day].join("-");
};
const generate = () => {
  let year = selectYear.value;
  let month = selectMonth.value;
  let day = 1;
  let dayArr = [];
  const DAY_LENTH = 42;
  let startDay = new Date([year, month, day].join("-"));
  let itemDay = [year, month, day].join("-");
  let week = startDay.getDay();
  week = week == 0 ? 7 : week;
  // 开始push
  for (let i = 1; i < week; i++) {
    itemDay = lastDay(new Date(itemDay));
    let { term, dayCn, monthCn, cDay, cMonth, cYear } = solarLunar.solar2lunar(
      ...itemDay.split("-")
    );
    if (FESTIVAL[cMonth] && FESTIVAL[cMonth][cDay]) {
      term = FESTIVAL[cMonth][cDay];
    }

    if (LUNAR_FESTIVAL[monthCn] && LUNAR_FESTIVAL[monthCn][dayCn]) {
      term = LUNAR_FESTIVAL[monthCn][dayCn];
    }
    let isWorkDay, isRestDay;
    if (
      WORKING_DAYS[cYear] &&
      WORKING_DAYS[cYear][cMonth] &&
      WORKING_DAYS[cYear][cMonth][cDay]
    ) {
      isWorkDay = true;
    }

    if (ARRANGE_HOLIDAY[cYear] && ARRANGE_HOLIDAY[cYear][cMonth]) {
      let range = ARRANGE_HOLIDAY[cYear][cMonth];
      if (cDay >= range[0] && cDay <= range[1]) isRestDay = true;
    }

    dayArr.push({
      day: itemDay.split("-")[2],
      date: itemDay,
      d_day: term ? term : dayCn,
      isSelectClass: selectDayDate.value == itemDay,
      otherMonth: true,
      hasTerm: term,
      isWeekend:
        (new Date(itemDay).getDay() == 6 || new Date(itemDay).getDay() == 0) &&
        !isWorkDay,
      isWorkDay: isWorkDay,
      isRestDay: isRestDay,
    });
  }
  itemDay = [year, month, day].join("-");
  dayArr = dayArr.reverse();
  for (let i = 0; i <= DAY_LENTH - week; i++) {
    let { term, dayCn, monthCn, cMonth, cDay, cYear } = solarLunar.solar2lunar(
      ...itemDay.split("-")
    );
    if (FESTIVAL[cMonth] && FESTIVAL[cMonth][cDay]) {
      term = FESTIVAL[cMonth][cDay];
    }
    if (LUNAR_FESTIVAL[monthCn] && LUNAR_FESTIVAL[monthCn][dayCn]) {
      term = LUNAR_FESTIVAL[monthCn][dayCn];
    }
    let isWorkDay, isRestDay;
    if (
      WORKING_DAYS[cYear] &&
      WORKING_DAYS[cYear][cMonth] &&
      WORKING_DAYS[cYear][cMonth][cDay]
    ) {
      isWorkDay = true;
    }

    if (ARRANGE_HOLIDAY[cYear] && ARRANGE_HOLIDAY[cYear][cMonth]) {
      let range = ARRANGE_HOLIDAY[cYear][cMonth];
      if (cDay >= range[0] && cDay <= range[1]) isRestDay = true;
    }
    dayArr.push({
      date: itemDay,
      day: itemDay.split("-")[2],
      d_day: term ? term : dayCn,
      isSelectClass: selectDayDate.value == itemDay,
      otherMonth: itemDay.split("-")[1] != month,
      hasTerm: term,
      isWeekend:
        (new Date(itemDay).getDay() == 6 || new Date(itemDay).getDay() == 0) &&
        !isWorkDay,
      isWorkDay: isWorkDay,
      isRestDay: isRestDay,
    });
    itemDay = nextDay(new Date(itemDay));
  }
  //   清空原来的数据
  fullDateArray.value = [];
  for (let i = 0; i <= 5; i++) {
    fullDateArray.value.push(dayArr.splice(0, 7));
  }
};
//初始化
onMounted(init);
//监听selectDayDate选中日期
watch(selectDayDate, (newValue) => {
  selectYear.value = newValue.split("-")[0];
  selectMonth.value = newValue.split("-")[1];
  let info = solarLunar.solar2lunar(...newValue.split("-"));
  dayInfo.value = {
    lunarFestival: LUNAR_FESTIVAL[info.monthCn]
      ? LUNAR_FESTIVAL[info.monthCn][info.dayCn]
      : undefined,
    festival: FESTIVAL[info.cMonth]
      ? FESTIVAL[info.cMonth][info.cDay]
      : undefined,
    ...info,
  };
  //触发事件
  emit("change", { date: newValue, ...dayInfo.value });
  nextTick(generate);
});
const selectDayAction = (e) => {
  const date = e.target.parentNode.getAttribute("date")
    ? e.target.parentNode.getAttribute("date")
    : e.target.getAttribute("date");
  selectDayDate.value = date;
};
const returnToday = () => {
  getDateToday();
};
const hoverClass = ref(false);
const isHover = () => {
  hoverClass.value = !hoverClass.value;
};
const handleChangeDate = (value) => {
  selectDayDate.value = value;
};
</script>
