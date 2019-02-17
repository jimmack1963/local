import multiguard from 'vue-router-multiguard'
import Store from '../store'

import MyLayout from '../layouts/MyLayout.vue'
import Main from '../pages/Main.vue'
import Selfie from '../pages/Selfie.vue'
import Carousel from '../pages/Carousel.vue'
import Illustrate from '../pages/Illustrate.vue'
import Narrate from '../pages/Narrate.vue'
import Manage from '../pages/Manage.vue'
import Error404 from '../pages/Error404.vue'
import newBook from '../pages/newBook'

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
    path: '/book/new/step/:step',
    component: MyLayout,
    name: 'newbook',
    children: [
      { path: '', component: newBook }
    ],
    beforeEnter: multiguard([noActiveFolder])
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
    path: '/Illustrate',
    component: MyLayout,
    children: [
      { path: '', component: Illustrate }
    ],
    beforeEnter: multiguard([guardActiveFolder])
  },
  {
    path: '/Narrate',
    component: MyLayout,
    children: [
      { path: '', component: Narrate }
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
