import { createStore, createLogger, Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import mutations from './mutations'
import modules from './modules'
import {AppStateType} from "./modules/app/state";
import Taro from '@tarojs/taro'

// vuex模块的类型
type ModuleType = {
  app: AppStateType
}

// 所有的StateType
export type StateType = ModuleType
const store: Store<StateType> = createStore({
  strict: true,
  mutations,
  actions: {},
  modules: { ...modules },
  plugins:
    [
      createPersistedState({
        paths: ['app'],
        storage: {
          getItem: key => Taro.getStorageSync(key),
          setItem: (key, value) => {
            Taro.setStorageSync(key, value);
          },
          removeItem: key => Taro.removeStorageSync(key)
        }
      })
    ]
})

export default store
