import multiguard from 'vue-router-multiguard'
import Store from '../store'

import MyLayout from '../layouts/MyLayout.vue'
import Main from '../pages/Main.vue'
import Selfie from '../pages/Selfie.vue'
import Carousel from '../pages/Carousel.vue'
import simpleRecord from '../pages/simpleRecord.vue'
import Manage from '../pages/Manage.vue'
import Error404 from '../pages/Error404.vue'


let store = Store()

const guardActiveFolder = (to, from, next) => {
  // TODO: this invalidates bookmarks.  Allow bookmarks into specific pages of books
  if (store.state.dropbox.activeFolder) {
    next()
  }
  else {
    next('/')
  }
}

const noActiveFolder = (to, from, next) => {
  if (store.state.dropbox.activeFolder) {
    store.commit('setActiveFolder', {
      activeFolder: false
    })
  }
  next()
}

const routes = [
  {
    path: '/',
    component: MyLayout,
    children: [
      { path: '', component: Main }
    ],
    beforeEnter: multiguard([noActiveFolder])
  },
  {
    path: '/auth',
    component: MyLayout,
    children: [
      { path: '', component: Main }
    ]
  },
  {
    path: '/selfie',
    component: MyLayout,
    children: [
      { path: '', component: Selfie }
    ],
    beforeEnter: multiguard([])
  },
  {
    path: '/carousel',
    component: MyLayout,
    children: [
      { path: '', component: Carousel }
    ],
    beforeEnter: multiguard([guardActiveFolder])
  },
  {
    path: '/simpleRecord',
    component: MyLayout,
    children: [
      { path: '', component: simpleRecord }
    ],
    beforeEnter: multiguard([guardActiveFolder])
  },
  {
    path: '/manage',
    component: MyLayout,
    children: [
      { path: '', component: Manage }
    ],
    beforeEnter: multiguard([guardActiveFolder])
  }

]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: Error404
  })
}

export default routes
