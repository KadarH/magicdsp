<template>
    
    <div id="pages-users-show" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div class="actions">
            <button @click="deleteUser" class="btn danger" id="btnDeleteUser"><i class="fas fa-trash"></i></button>
        </div>

        <form  @submit.prevent="editUser">
            <div class="input">
                <label>Nom</label>
                <input type="text" v-model="user.lastname">
            </div>

            <div class="input">
                <label>Prénom</label>
                <input type="text" v-model="user.firstname">
            </div>

            <div class="input">
                <label>Email</label>
                <input type="text" v-model="user.email">
            </div>

            <div class="input">
                <label>Numéro de téléphone</label>
                <input type="text" v-model="user.phone_number">
            </div>

            <div class="input">
                <label>Adresse</label>
                <input type="text" v-model="user.address">
            </div>

            <div class="input">
                <label>TVA/Siret</label>
                <input type="text" v-model="user.vat_number">
            </div>

            <button id="btnEditUser" class="btn primary">Modifier</button>
        </form>

        <h2>Liste des demandes effectuées</h2>
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
            },
            deleteUser() {
                this.isLoading = true

                this.$axios.delete('api/admin/users/' + this.$route.params.id)
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.$router.push('/admin/users')
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            editUser() {
                this.isLoading = true

                this.$axios.patch('api/admin/users/' + this.$route.params.id, {
                    firstname: this.user.firstname,
                    lastname: this.user.lastname,
                    address: this.user.address,
                    phone_number: this.user.phone_number,
                    email: this.user.email,
                    vat_number: this.user.vat_number
                })
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
            }
        }
    }

</script>