<template>
    
    <div id="pages-users-show" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <form>
            <div class="input">
                <label>Nom</label>
                <input type="text" v-model="user.lastname" disabled>
            </div>

            <div class="input">
                <label>Prénom</label>
                <input type="text" v-model="user.firstname" disabled>
            </div>

            <div class="input">
                <label>Email</label>
                <input type="text" v-model="user.email" disabled>
            </div>

            <div class="input">
                <label>Numéro de téléphone</label>
                <input type="text" v-model="user.phone_number" disabled>
            </div>

            <div class="input">
                <label>Adresse</label>
                <input type="text" v-model="user.address" disabled>
            </div>
        </form>

        <table id="list-quotes">
            <tbody>
                <tr v-for="quote in user.quotes">
                    <td><n-link :to="'/quotes/'+quote.id">Quote {{quote.id}}</n-link></td>
                    <td class="date">{{ moment(quote.created_at).format('DD/MM/YYYY') }}</td>
                </tr>
            </tbody>
        </table>
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
                pageTitle: 'Utilisateurs',
                user: [],
                isLoading: true
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)
            moment.locale('fr')

            this.$axios.get('api/admin/users/' + this.$route.params.id)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.user = data.data.user
                }

                this.isLoading = false
            })
            .catch(error => {
                console.log(error.response)
            })
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        methods: {
            moment(date) {
                return moment(date)
            }
        }
    }

</script>