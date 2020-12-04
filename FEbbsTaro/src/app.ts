import { createApp } from 'vue'
import './app.less'
import store from './store'
import {registeGlobalComponent} from "@/components/index";

const app = createApp({
  onShow(options) {
    console.log('app created')
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
app.use(store)
registeGlobalComponent(app)
export default app
