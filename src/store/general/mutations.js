import vue from 'vue'

export function dropboxCredentials (state, payload) {
    vue.set(state, 'access_token', payload.access_token)
    vue.set(state, 'token_type', payload.token_type)
    vue.set(state, 'uid', payload.uid)
    vue.set(state, 'account_id', payload.account_id)
}

