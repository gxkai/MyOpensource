<template>
  <view class="calendar">
    <view class="calendar__overlay"></view>
    <view class="calendar__popup">
      <view class="calendar__wrap">
        <view class="calendar__header">
          <view class="calendar__header__title">
            日期选择
          </view>
          <view class="calendar__header__subtitle">
            {{curMonth.getFullYear()}}年{{curMonth.getMonth() + 1}}月
          </view>
          <view class="calendar__header__weekdays">
            <view class="calendar__header__weekday" v-for="(weekday,index) in weekdays" :key="index">
              {{weekday}}
            </view>
          </view>
          <image class="calendar__header__close" src="@/assets/svg/close.svg" alt=""/>
        </view>
        <scroll-view class="calendar__body"  @scroll="scrollFunc" scroll-y="true" :scroll-top="scrollTop">
            <view class="calendar__month" v-for="(month,index) in months" :key="index">
              <view class="calendar__month__title">
                {{month.getFullYear()}}年{{month.getMonth() + 1}}月
              </view>
              <view class="calendar__days">
                <view class="calendar__days__mark">
                  {{month.getMonth() + 1}}
                </view>
                <view v-if="showMonths.includes(`${month.getFullYear()}-${month.getMonth()}`)" class="calendar__day__wrap">
                  <view class="calendar__day" v-for="x in getDays(month)[0].getDay() - 1 < 0 ? 0 : getDays(month)[0].getDay() - 1" :key="x">

                  </view>
                  <view  v-for="(item, index) in getDays(month)" :key="'m' +index" class="calendar__day"
                         :class="`${curDay.getFullYear()}-${curDay.getMonth()}-${curDay.getDate()}` === `${item.getFullYear()}-${item.getMonth()}-${item.getDate()}` ? 'calendar__day--selected' : ''"
                  >
                    {{item.getDate()}}
                  </view>
                </view>
              </view>
            </view>
        </scroll-view>
        <view class="calendar__footer">
          <button class="button button--danger">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
  import Taro from '@tarojs/taro'
  const getMonths = (minDate: Date, maxDate: Date)=> {
    const result: Date[] = [];
    const curr = new Date(minDate.valueOf());
    while(curr.getTime() <= maxDate.getTime()){
      result.push(new Date(curr.valueOf()));
      curr.setMonth(curr.getMonth()+1);
    }
    return result;
  }
  import { defineComponent } from 'vue'
  let UNIT_HEIGHT = 0
  export default defineComponent({
    props: {
      minDate: {
        type: Date,
        default: new Date(2000, 0, 1)
      },
      maxDate: {
        type: Date,
        default: new Date(2100, 0, 1)
      }
    },
    data() {
      return {
        weekdays: ['日','一','二','三','四','五','六'],
        months: [],
        showMonths: [],
        curMonth: null,
        curDay: new Date(2001, 0, 1),
        scrollTop: 0
      }
    },
    created(): void {
      this.curMonth = new Date(this.curDay.getFullYear(), this.curDay.getMonth())
      this.months = getMonths(this.minDate, this.maxDate)
    },
    mounted(): void {
      setTimeout(() => {
        const query = Taro.createSelectorQuery()
        query.select('.calendar__body').boundingClientRect(rec => {
          UNIT_HEIGHT = rec.height
          const diffMon = this.diffMon(this.curDay, this.minDate)
          this.scrollTop = diffMon * UNIT_HEIGHT
          this.showMonths = this.showMonthsFunc()
        }).exec()
      }, 100)
    },
    methods: {
      diffMon(date1:Date, date2:Date) {
        return  Math.abs((date1.getFullYear() - date2.getFullYear()) * 12 + date1.getMonth() - date2.getMonth() )
      },
      scrollFunc(e) {
        const diff = Math.ceil(e.detail.scrollTop / UNIT_HEIGHT)
        const date = new Date(this.minDate.valueOf())
        date.setMonth(date.getMonth() + diff)
        this.curMonth = date
        this.showMonths = this.showMonthsFunc()
      },
      showMonthsFunc() {
        const cD = new Date(this.curMonth.valueOf())
        cD.setMonth(cD.getMonth() -1)
        const sD = new Date(cD.getFullYear(), cD.getMonth(), 1)
        cD.setMonth(cD.getMonth() + 2)
        const eD = new Date(cD.getFullYear(), cD.getMonth(), 0)
        return [cD, sD, eD].map((e) => `${e.getFullYear()}-${e.getMonth()}`)
      },
      getDays(month: Date) {
        const  arr: Date[] = []
        const last = new Date(month.valueOf())
        last.setMonth(last.getMonth() + 1)
        last.setDate(0)
        const num = last.getDate()
        const sD = new Date(month.valueOf())
        for (let i =0;i< num;i++) {
          arr.push(new Date(sD.valueOf()))
          sD.setDate(sD.getDate() + 1)
        }
        return arr
      }
    }
  })
</script>
<style lang="less">
  @import "../../styles/index";
  .calendar {
    &__overlay {
      position: fixed;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      background-color: rgba(0,0,0,.7);
      z-index: 2002;
    }
    &__popup {
      z-index: 2002;
      height: 80%;
      bottom: 0;
      left: 0;
      width: 100%;
      position: fixed;
      background-color: #ffffff;
      overflow-y: auto;
      transition: transform .3s,-webkit-transform .3s;
      border-radius: 10px 10px 0 0;
    }
    &__wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    &__body {
      flex: 1;
      overflow-y: auto;
    }
    &__month {
      height: 100%;
      display: flex;
      flex-direction: column;
      &__title {
        text-align: center;
        height: 60px;
        line-height: 30px;
        font-size: 14px;
        font-weight: 500;
      }
    }
    &__days {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      &__mark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 150px;
        color: #666666;
        opacity: 0.2;
      }
    }
    &__day {
      width: 100% / 6;
      height: 50px;
      text-align: center;
      line-height: 50px;
      &--selected {
        background-color: @error-color;
        color: #ffffff;
        border-radius: 5px;
      }
      &__wrap {
        display: flex;
        flex-wrap: wrap;
        height: calc(100% - 50px);
      }
    }
    &__footer {
      text-align: center;
      height: 50px;
      display: flex;
      align-items: center;
      .button {
        width: 100%;
        margin: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        height: 40px;
        font-size: 16px;
      }
    }
    &__header {
      position: relative;
      box-shadow: 0 0.053333rem 0.266667rem rgba(125,126,128,.16);
      &__title {
        font-size: 16px;
        height: 40px;
        font-weight: 500;
        line-height: 40px;
        text-align: center;
      }
      &__subtitle {
        height: 60px;
        font-weight: 500;
        line-height: 60px;
        text-align: center;
        font-size: 14px;
      }
      &__close {
        width: 15px;
        height: 15px;
        position: absolute;
        right: 15px;
        top: 15px;
      }
      &__weekdays {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 20px;
      }
      &__weebday {
        flex: 1;
        font-size: 12px;
        line-height: 12px;
        text-align: center;
      }
    }
  }
</style>
