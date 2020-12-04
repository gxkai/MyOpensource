<template>
  <view class="home">
    <view class="times">
      <view class="days">
        <view
          v-for="(day, index) in days"
          :key="'day' + index"
          class="day"
          :class="selectedDate.getDay() === index ? 'day--active' : ''"
        >
          {{ daysMap[day] }}
        </view>
      </view>
      <view class="dates">
        <view
          v-for="(date, index) in currentArr"
          :key="'date' + index"
          class="date"
          :class="selectedDate.getDay() === index ? 'date--active' : ''"
          @tap="clickDate(date)"
        >
          <view v-if="selectedDate.getDay() === index" class="date--around">
            {{ date.getDate() }}
          </view>
          {{ date.getDate() }}
        </view>
      </view>
    </view>
    <view class="list" ref="list">
      <view class="list__item list__item__add" @tap="clickAdd">
        <view>+</view>
      </view>
        <view
          class="list__item"
          :class="showCheckbox ? 'list__item--normal' : ''"
          v-for="item in list"
          :key="item.id"
        >
            <label class="list__item__checkbox checkbox" v-if="item.id && showCheckbox" @tap="changeCheckedItem($event, item)">
              <checkbox  :checked="item.checked"/>
              <view></view>
            </label>
          <view class="list__item__part-1">
            <view class="list__item__clock">
              <g-timepicker v-model="item.timeStart" />
              <view class="list__item__clock__divide">-</view>
              <g-timepicker v-model="item.timeEnd" />
            </view>
            <view class="list__item__check">
              <view class="list__item__direction">
                <label v-for="d in item.direction" :key="d.value" class="checkbox" @tap="
                ($event, d)">
                  <checkbox  :checked="d.checked"/>
                  <view></view>
                  <label>{{d.name}}</label>
                </label>
              </view>
            </view>
          </view>
        </view>
    </view>
    <view class="footer">
      <view class="footer__part-1" v-if="showFooter">
        <view class="footer__part-1__left">
<!--          <g-checkbox v-model="checkedAll" v-if="showCheckbox" />-->
          <label class="checkbox" v-if="showCheckbox" @tap="changeCheckedAll">
            <checkbox  :checked="checkedAll"/>
            <view></view>
          </label>
          <button
            class="button button--normal"
            @tap="showCheckbox = false"
            v-if="showCheckbox"
          >
            取消
          </button>
          <button
            class="button button--normal"
            @tap="showCheckbox = true"
            v-else
          >
            管理
          </button>
        </view>
        <button
          class="button button--delete"
          @tap="clickDeleteAll"
          v-if="list.filter((e) => e.checked).length > 0"
        >
          删除
        </button>
      </view>
      <view class="footer__part-2">
        <textarea
          class="footer__description"
          v-model="description"
          @change="forceUpdateGroup"
        />
      </view>
    </view>
  </view>
  <view class="floating" @tap="showCalendar = true">
    <view>
      更多
    </view>
  </view>
  <g-calendar/>
  <!--  <van-calendar-->
<!--    v-model:show="showCalendar"-->
<!--    @confirm="confirmCalendar"-->
<!--    :min-date="minDate"-->
<!--    :max-date="maxDate"-->
<!--  />-->
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import {IRecord} from "../../../@types";
  import store from "@/store/index";
  import {setStoreState} from "@/store/utils";
  import GCalendar from "@/components/global/GCalendar.vue";
  const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  const getTime = (date: Date) => {
    const h = date.getHours()
    const m = date.getMinutes()
    function f(x: number) {
      return x < 10 ? `0${x}` : x
    }
    return `${f(h)}:${f(m)}`
  }
  const getYMD = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
  }
  const getYMDDesc = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}-desc`
  }
  const getDate = (date: Date, n: number) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + n)
    return newDate
  }
  const Home = defineComponent({
    components: {
      GCalendar
    },
    data(): {
      days: number[]
      selectedDate: Date
      currentArr: Date[]
      preArr: Date[]
      nextArr: Date[]
      daysMap: {
        [key: number]: string
      }
      form: IRecord
      list: IRecord[]
      description: string
      checkedList: string[]
      showCheckbox: boolean
      showCalendar: boolean
      minDate: Date
      maxDate: Date
      showDeleteModel: boolean
    } {
      return {
        showDeleteModel: false,
        days: [0, 1, 2, 3, 4, 5, 6],
        selectedDate: new Date(),
        currentArr: [],
        preArr: [],
        nextArr: [],
        daysMap: {
          0: '日',
          1: '一',
          2: '二',
          3: '三',
          4: '四',
          5: '五',
          6: '六'
        },
        form: {
          id: '',
          time: getTime(new Date()),
          timeStart: getTime(new Date()),
          timeEnd: getTime(new Date()),
          direction: [{
            value: 'LEFT',
            name: '左',
            checked: false,
          }, {
            value: 'RIGHT',
            name: '右',
            checked: false,
          }],
          description: '',
          checked: false
        },
        list: [],
        description: '',
        checkedList: [],
        showCheckbox: false,
        showCalendar: false,
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2100, 0, 1)
      }
    },
    computed: {
      showFooter() {
        return (this as any).list.filter((e: IRecord) => e.id).length > 0
      },
      checkedAll: {
        get() {
          return (
            (this as any).list.length > 0 &&
            (this as any).list.every((e) => e.checked)
          )
        },
        set(val) {
          (this as any).list.forEach((e) => {
            e.checked = val;
          })
        }
      }
    },
    watch: {
      list: {
        deep: true,
        handler() {
          this.forceUpdateGroup()
        }
      }
    },
    created() {
      this.getDateGroup()
      this.getList()
    },
    methods: {
      cancelDeleteModel() {
        this.showDeleteModel = false
      },
      confirmDeleteModel() {
          this.list = this.list.filter(e => !e.checked)
          this.showDeleteModel = false
      },
      changeCheckedAll() {
        this.checkedAll = !this.checkedAll
      },
      changeCheckedItem(e, item) {
        item.checked = !item.checked
      },
      changeChecked(e, item) {
        const values = e.detail.value
        const items = item
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
          for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
            if (items[i].value === values[j]) {
              items[i].checked = true
              break
            }
          }
        }
      },
      forceUpdateGroup() {
        const list = (this as any).list.filter((e: IRecord) => e.id)
        const newGroup = JSON.parse(JSON.stringify(store.state.app.group))
        newGroup[getYMD(this.selectedDate)] = list
        newGroup[getYMDDesc(this.selectedDate)] = this.description
        setStoreState('app', 'group', JSON.parse(JSON.stringify(newGroup)))
      },
      getList() {
        const newList =
          JSON.parse(JSON.stringify(store.state.app.group))[
            getYMD(this.selectedDate)
            ] ?? []
        this.description =
          JSON.parse(JSON.stringify(store.state.app.group))[
            getYMDDesc(this.selectedDate)
            ] ?? ''
        newList.forEach((e: IRecord) => {
          e.timeStart = e.timeStart ?? ''
          e.timeEnd = e.timeEnd ?? ''
        })
        this.list = newList
        this.form.time = getTime(new Date())
        this.form.timeStart = getTime(new Date())
        this.form.timeEnd = getTime(new Date())
        // this.list.unshift(this.form)
      },
      getDateGroup() {
        // 上一个周日日期
        const preSun = getDate(this.selectedDate, -this.selectedDate.getDay())
        this.currentArr = this.days.map(n => getDate(preSun, n))
        this.preArr = this.days.map(n => getDate(preSun, n - 7))
        this.nextArr = this.days.map(n => getDate(preSun, n + 7))
      },
      clickDate(date: Date) {
        this.selectedDate = date
        this.getList()
      },
      clickAdd() {
        const newForm = JSON.parse(JSON.stringify(this.form))
        newForm.id = uuid()
        newForm.time = getTime(new Date())
        newForm.timeStart = getTime(new Date())
        newForm.timeEnd = getTime(new Date())
        newForm.direction = [{
          value: 'LEFT',
          name: '左',
          checked: false,
        }, {
          value: 'RIGHT',
          name: '右',
          checked: false,
        }]
        this.list.push(newForm)
      },
      clickDeleteAll() {
        this.showDeleteModel = true
        // Dialog.confirm({
        //   title: '删除',
        //   message: '确认删除'
        // }).then(() => {
        //   this.list = this.list.filter(e => !this.checkedList.includes(e.id))
        //   this.checkedList = []
        // })
      },
      clickClear(record: IRecord) {
        record.description = ''
        record.direction = []
        record.time = getTime(new Date())
      },
      clickDelete(record: IRecord) {
        // Dialog.confirm({
        //   title: '删除',
        //   message: '确认删除'
        // }).then(() => {
        //   this.list = this.list.filter(e => e.id !== record.id)
        //   this.checkedList = this.checkedList.filter(e => e !== record.id)
        // })
      },
      confirmCalendar(date: Date) {
        this.showCalendar = false
        this.selectedDate = date
        this.getDateGroup()
        this.getList()
      }
    }
  })

  export default Home
</script>

<style lang="less">
  @import "../../styles/index";
  .home {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .footer {
    box-shadow: @box-shadow-base;
    &__part-1 {
      padding: 10px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &__left {
        display: flex;
        align-items: center;
        .checkbox {
          margin-right: 10px;
        }
      }
    }
    &__description {
      width: 100%;
      min-height: 100px;
      padding: 0 10px;
      &:focus {
        outline: none;
        border: none;
      }
    }
  }
  .days {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    margin-top: 20px;
    .day {
      font-size: 18px;
      color: #666666;
      &--active {
        color: #0058a3;
      }
    }
  }
  .dates {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-top: 20px;
    .date {
      font-size: 18px;
      color: #666666;
      &--active {
        position: relative;
      }
      &--around {
        position: absolute;
        border-radius: 50%;
        background-color: #0058a3;
        color: #ffffff;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        top: -10px;
        left: -10px;
      }
    }
  }
  .add {
    width: 40px;
    height: 40px;
    position: fixed;
    bottom: 0;
    right: 0;
  }
  .list {
    flex: 1;
    margin-top: 20px;
    background-color: white;
    overflow-y: auto;
    &__item {
      margin-top: 10px;
      background-color: #ffffff;
      box-shadow: @box-shadow-base;
      border-radius: 10px;
      padding: 10px 20px 10px 20px;
      position: relative;
      &__add {
        display: grid;
        place-items: center;
        padding: 0;
        height: 40px;
        &>view {
          font-size: 20px;
          padding: 0;
          margin: 0;
          color: #0058a3;
        }
      }
      &__checkbox {
        position: absolute;
        left: 0;
        transform: translateX(50%) translateY(-50%);
        top: 50%;
      }
      &--normal {
        padding-left: 50px;
      }
      &__clock {
        display: flex;
        align-items: center;
        &__divide {
          margin: 0 2px;
        }
      }
      &__part-1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      &__part-2 {
        margin-top: 10px;
      }
      &__part-3 {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
      }
      &__direction {
        display: flex;
        align-items: center;
        label {
          &:first-child {
            margin-right: 10px;
          }
          &:last-child {
            margin-left: 10px;
          }
        }
      }
      &__check {
        display: flex;
        align-items: center;
      }
    }
  }

  .switch-box {
    /* Switch开关样式 */
    /* 必须是input为 checkbox class 添加 switch 才能实现以下效果 */
    input[type='checkbox'].switch {
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      position: relative;
      width: 40px;
      height: 20px;
      background: #ccc;
      border-radius: 20px;
      transition: border-color 0.3s, background-color 0.3s;
    }

    input[type='checkbox'].switch::after {
      content: '';
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 2px #999;
      transition: 0.4s;
      top: 0;
      position: absolute;
      left: 0;
    }

    input[type='checkbox'].switch:checked {
      background: rgb(19, 206, 102);
    }
    /* 当input[type=checkbox]被选中时：伪元素显示下面样式 位置发生变化 */
    input[type='checkbox'].switch:checked::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
    }
  }
  .floating {
    position: fixed;
    right: 20px;
    bottom: 180px;
    display: grid;
    place-items: center;
    box-shadow: @box-shadow-base;
    background-color: #0058a3;
    color: #ffffff;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    view {
      font-size: 16px;
    }
  }
  .checkbox {
    display: flex;
    align-items: center;
    label {
      margin-left: 10px;
      font-size: 16px;
    }
    checkbox {
      display: none;
    }
    checkbox + view {
      width: 20px;
      height: 20px;
      border: 1px solid #000000;
      display: inline-block;
      border-radius: 50%;
    }
    checkbox[checked] + view {
      background-color: #0058a3;
    }
  }
</style>
