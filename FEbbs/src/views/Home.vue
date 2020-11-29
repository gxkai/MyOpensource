<template>
  <div class="home">
    <div class="times">
      <div class="days">
        <div
          v-for="(day, index) in days"
          :key="'day' + index"
          class="day"
          :class="selectedDate.getDay() === index ? 'day--active' : ''"
        >
          {{ daysMap[day] }}
        </div>
      </div>
      <div class="dates">
        <div
          v-for="(date, index) in currentArr"
          :key="'date' + index"
          class="date"
          :class="selectedDate.getDay() === index ? 'date--active' : ''"
          @click="clickDate(date)"
        >
          <div v-if="selectedDate.getDay() === index" class="date--around">
            {{ date.getDate() }}
          </div>
          {{ date.getDate() }}
        </div>
      </div>
    </div>
    <div class="list">
      <div
        class="list__item"
        :class="showCheckbox ? 'list__item--normal' : ''"
        v-for="item in list"
        :key="item.id"
      >
        <div class="list__item__checkbox" v-if="item.id && showCheckbox">
          <g-checkbox v-model="checkedList" :value="item.id" />
        </div>
        <div class="list__item__part-1">
          <div class="list__item__clock">
            <g-timepicker v-model="item.timeStart" />
          </div>
          <div class="list__item__check">
            <div class="list__item__direction">
              <g-checkbox value="LEFT" label="左" v-model="item.direction" />
              <g-checkbox value="RIGHT" label="右" v-model="item.direction" />
            </div>
          </div>
        </div>
        <div class="list__item__part-2">
          <div class="list__item__clock">
            <g-timepicker v-model="item.timeEnd" />
          </div>
        </div>
        <div class="list__item__part-3">
          <button class="button button--clear" @click="clickClear(item)">
            清空
          </button>
          <button class="button button--add" @click="clickAdd" v-if="!item.id">
            添加
          </button>
          <button
            class="button button--delete"
            @click="clickDelete(item)"
            v-else
          >
            删除
          </button>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer__part-1" v-if="showFooter">
        <div class="footer__part-1__left">
          <g-checkbox v-model="checkedAll" v-if="showCheckbox" />
          <button
            class="button button--normal"
            @click="showCheckbox = false"
            v-if="showCheckbox"
          >
            取消
          </button>
          <button
            class="button button--normal"
            @click="showCheckbox = true"
            v-else
          >
            管理
          </button>
        </div>
        <button
          class="button button--delete"
          @click="clickDeleteAll"
          v-if="this.checkedList.length > 0"
        >
          删除
        </button>
      </div>
      <div class="footer__part-2">
        <textarea
          class="footer__description"
          v-model="description"
          @change="forceUpdateGroup"
        />
      </div>
    </div>
  </div>
  <div class="floating" @click="showCalendar = true">
    <span>
      更多
    </span>
  </div>
  <van-calendar
    v-model:show="showCalendar"
    @confirm="confirmCalendar"
    :min-date="minDate"
    :max-date="maxDate"
  />
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { EDirection, IRecord, StateType } from '../../@types'
import store from '@/store'
import { uuid } from '@/utils/common'
import { setStoreState } from '@/store/utils'
import { Dialog } from 'vant'

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
  } {
    return {
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
        direction: [],
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
          (this as any).checkedList.length > 0 &&
          (this as any).checkedList.length === (this as any).list.length - 1
        )
      },
      set(val) {
        if (val) {
          (this as any).checkedList = (this as any).list
            .filter((e: IRecord) => e.id)
            .map((e: IRecord) => e.id)
        } else {
          (this as any).checkedList = []
        }
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
      this.list.unshift(this.form)
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
      this.list.splice(1, 0, newForm)
      this.form.time = getTime(new Date())
      this.form.direction = []
      this.form.id = ''
    },
    clickDeleteAll() {
      Dialog.confirm({
        title: '删除',
        message: '确认删除'
      }).then(() => {
        this.list = this.list.filter(e => !this.checkedList.includes(e.id))
        this.checkedList = []
      })
    },
    clickClear(record: IRecord) {
      record.description = ''
      record.direction = []
      record.time = getTime(new Date())
    },
    clickDelete(record: IRecord) {
      Dialog.confirm({
        title: '删除',
        message: '确认删除'
      }).then(() => {
        this.list = this.list.filter(e => e.id !== record.id)
        this.checkedList = this.checkedList.filter(e => e !== record.id)
      })
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

<style scoped lang="less">
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.footer {
  padding: 10px 20px;
  box-shadow: @box-shadow-base;
  &__part-1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    &__left {
      display: flex;
    }
  }
  &__description {
    width: 100%;
    min-height: 100px;
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
    & + & {
      margin-top: 10px;
    }
    background-color: #ffffff;
    box-shadow: @box-shadow-base;
    border-radius: 10px;
    padding: 10px 20px 10px 20px;
    position: relative;
    &__checkbox {
      position: absolute;
      left: 0;
      transform: translateX(50%);
      top: 30%;
    }
    &--normal {
      padding-left: 50px;
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
button {
  -webkit-appearance: none;
  outline: none;
  border: none;
}
.button {
  padding: 2px 10px;
  border-radius: 5px;
  &:disabled {
    background-color: @disabled-color;
  }
  & + .button {
    margin-left: 10px;
  }
  &--normal {
    color: #ffffff;
    background-color: @primary-color;
  }
  &--cancel,
  &--delete {
    color: #ffffff;
    background-color: @error-color;
  }
  &--clear {
    background-color: @warning-color;
    color: #ffffff;
  }
  &--ok,
  &--add {
    color: #ffffff;
    background-color: @success-color;
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
    border-radius: 10px;
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
}
</style>
