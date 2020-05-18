export const state = () => ({
    pageTitle: ''
})

export const mutations = {
    set (state, title) {
        state.pageTitle = title
    }
}