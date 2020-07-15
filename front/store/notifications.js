export const state = () => ({
    unread: 0
})

export const mutations = {
    increment (state) {
        state.unread++
    },
    decrement (state) {
        state.unread--
    }
}