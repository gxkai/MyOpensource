import { Calendar, Dialog } from 'vant'

export default function loadComponent(app: any) {
  app.use(Dialog).use(Calendar)
}
