import multiguard from 'vue-router-multiguard'
import Store from '../store'
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

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Main.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Main.vue') }
    ]
  },
  {
    path: '/selfie',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Selfie.vue') }
    ],
    beforeEnter: multiguard([guardActiveFolder])
  },
  {
    path: '/carousel',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Carousel.vue') }
    ],
    beforeEnter: multiguard([guardActiveFolder])
  },
  {
    path: '/simpleRecord',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/simpleRecord.vue') }
    ],
    beforeEnter: multiguard([guardActiveFolder])
  },
  {
    path: '/manage',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Manage.vue') }
    ],
    beforeEnter: multiguard([guardActiveFolder])
  }

]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
