import vue from 'vue'

export function setsomething (state, payload) {
    vue.set(state, 'junk', payload.junk)
}

