import gtm from 'src/components/gtm'

export default ({ router, Vue }) => {

  Vue.prototype.$gtm = gtm

  router.afterEach((to, from) => {
    gtm.logPage(to.path)
  })
}
