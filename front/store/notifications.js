export const state = () => ({
    unread: 0
})

export const mutations = {
    increment(state) {
        state.unread++
    },
    decrement(state) {
        if ( state.unread <= 0 ) {
            state.unread = 0
        } else {
            state.unread--
        }
    },
    reset(state) {
        state.unread = 0
    }
}