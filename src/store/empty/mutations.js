import vue from 'vue'

export function setsomething (state, payload) {
    vue.set(state, 'access_token', payload.access_token)
}

