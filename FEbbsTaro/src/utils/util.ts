import Taro from '@tarojs/taro'

const showAlert = (title: string, message: string | object) => {
  const content = typeof message === 'string' ? message : toString(message)
  Taro.showModal({
    title: title || '',
    content,
    showCancel: false,
  })
}

const toString = (data: any) => JSON.stringify(data)


const  uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export { showAlert, toString, uuid }
