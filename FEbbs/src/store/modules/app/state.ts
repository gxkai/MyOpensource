import { IRecord, StateType } from '@types'
import { Module } from 'vuex'

const state = {
  language: 'zhCN',
  theme: 'light',
  version: '0.0.1',
  fullLoading: false,
  loadingText: 'Loading...',
  group: {}
} as {
  language: string
  theme: string
  version: string
  fullLoading: boolean
  loadingText: string
  group: {
    [key: number]: IRecord[]
  }
}
type AppStateType = typeof state

const app: Module<AppStateType, StateType> = { namespaced: true, ...state }

export { AppStateType, state }
export default app
