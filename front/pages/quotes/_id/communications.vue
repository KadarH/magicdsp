<template>
    
    <div>com</div>

</template>

<script>

    export default {
        middleware: 'authenticated',
        layout: 'app',
        data() {
            return {
                pageTitle: ''
            }
        },
        mounted() {
            this.pageTitle = 'Communications Demande ' + this.$route.params.id
            this.$store.commit('pageTitle/set', this.pageTitle)
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        methods: {
        }
    }

</script>