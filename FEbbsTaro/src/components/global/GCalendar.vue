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
        <view class="calendar__body">
            <view class="calendar__month" v-for="(month,index) in months" :key="index">
              <view class="calendar__month__title">
                {{month.y}}年{{month.m}}月
              </view>
              <view class="calendar__days">
                <view class="calendar__days__mark">
                  {{month.m}}
                </view>
                <view v-if="showDays(month)" class="calendar__day__wrap">
                  <view class="calendar__day" v-for="x in getDays(month)[0].wd - 1" :key="x">

                  </view>
                  <view  v-for="(item, index) in getDays(month)" :key="'m' +index" class="calendar__day"
                         :class="`${curDay.getFullYear()}-${curDay.getMonth() + 1}-${curDay.getDate()}` === `${item.t.getFullYear()}-${item.t.getMonth() + 1}-${item.t.getDate()}` ? 'calendar__day--selected' : ''"
                  >
                    {{item.d}}
                  </view>
                </view>
              </view>
            </view>
        </view>
        <view class="calendar__footer">
          <button class="button button--danger">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
  Date.prototype.clone=function(){
    return new Date(this.valueOf());
  }
  interface IMon {y: number, m: number}
  const getMonths = (minDate: Date, maxDate: Date)=> {
    const result: IMon[] = [];
    const curr = minDate;
    while(curr.getTime() <= maxDate.getTime()){
      let month = curr.getMonth();
      result.push({
        y: curr.getFullYear(),
        m: month + 1,
      });
      curr.setMonth(month+1);
    }
    return result;
  }
  import { defineComponent } from 'vue'
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
        curMonth: new Date(2000, 1),
        curDay: new Date(2000, 0, 1),
      }
    },
    created(): void {
      this.months = getMonths(this.minDate, this.maxDate)
    },
    methods: {
      showDays(month: IMon) {
        const nD = new Date(month.y, month.m - 1)
        const cD = this.curMonth.clone()
        cD.setMonth(cD.getMonth() -1)
        const sD = new Date(cD.getFullYear(), cD.getMonth(), 1)
        cD.setMonth(cD.getMonth() + 2)
        const eD = new Date(cD.getFullYear(), cD.getMonth(), 1)
        return nD.getTime() >=  sD.getTime() && nD.getTime() <= eD.getTime()
      },
      getDays(month: IMon) {
        const  arr: {
          wd: number
          d: number
          t: Date
        }[] = []
        const  sD = new  Date()
        sD.setFullYear(month.y, month.m - 1, 1)

        const  eD = new  Date()
        eD.setFullYear(month.y, month.m, 1)

        while (sD < eD) {
          arr.push({
            wd: sD.getDay(),
            d: sD.getDate(),
            t: new Date(sD.valueOf())
          })
          sD.setDate(sD.getDate() + 1)
        }
        arr.forEach((e) => {
          console.log(`${e.t.getFullYear()}-${e.t.getMonth() + 1}-${e.t.getDate()}`)
        })
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
