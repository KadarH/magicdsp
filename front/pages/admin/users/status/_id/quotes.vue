<template>
    
    <div id="pages-quotes-list" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <table id="list-quotes" v-if="quotes.length">

            <tbody>
                <tr v-for="(quote, index) in quotes">
                    <td><n-link :to="'/quotes/'+quote.id">Quote {{quote.id}}</n-link></td>
                    <td class="date">{{ moment(quote.created_at).format('DD/MM/YYYY') }}</td>
                </tr>
            </tbody>

        </table>

        <div v-else>
            Aucune demande !
        </div>

    </div>

</template>

<script>

    import Loading from '~/components/Loading.vue'
    import moment from 'moment'

    export default {
        middleware: 'authenticated',
        layout: 'app',
        components: {
            Loading
        },
        data() {
            return {
                pageTitle: '',
                quotes: [],
                status: '',
                isLoading: true
            }
        },
        mounted() {
            moment.locale('fr')

            this.$axios.get('api/status/'+this.$route.params.id)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.status = data.data.status

                    this.pageTitle = 'Demandes des "' + this.status.name + '"'
                    this.$store.commit('pageTitle/set', this.pageTitle)
                }
            })
            .catch(error => {
                console.log(error.response)
            })

            this.$axios.get('api/admin/users/status/'+this.$route.params.id+'/quotes')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.quotes = data.data.quotes
                }

                this.isLoading = false
            })
            .catch(error => {
                console.log(error.response)
            })
        },
        methods: {
            moment(date) {
                return moment(date)
            }
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
    }

</script>