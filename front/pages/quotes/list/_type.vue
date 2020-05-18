<template>
    
    <div id="pages-quotes-list" class="container-page">

        <table id="list-quotes">

            <tbody>
                <tr v-for="(quote, index) in quotes">
                    <td><n-link :to="'/quotes/'+quote.id">Quote {{quote.id}}</n-link></td>
                    <td class="date">{{ moment(quote.created_at).format('DD/MM/YYYY') }}</td>
                </tr>
            </tbody>

        </table>

    </div>

</template>

<script>

    import moment from 'moment'

    export default {
        middleware: 'authenticated',
        layout: 'app',
        data() {
            return {
                pageTitle: 'Demandes en attentes',
                quotes: []
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)
            moment.locale('fr')

            this.$axios.get('api/quotes?type=waiting')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.quotes = data.data.quotes
                }
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