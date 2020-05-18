<template>
    
    <div id="pages-quotes-id" class="container-page">

        Quote ID

    </div>

</template>

<script>

    export default {
        middleware: 'authenticated',
        layout: 'app',
        data() {
            return {
                pageTitle: 'Demande XXX'
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
    }

</script>