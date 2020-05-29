<template>
    
    <div id="pages-quotes-index" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <!-- <span v-if="currentUser.admin && quote.can_edit" class="can-edit">Vous avez demander à l'utilisateur d'effectuer des modifications !</span> -->

        <span v-if="quote.price && quote.duration">Une estimation de {{ quote.price }}€ pour une durée de {{ quote.duration }} a été établie !</span>

        <div id="pages-quotes-success" class="container-page">
            <div v-if="status == 'create'">
                <h1>Votre demande a bien été envoyée !</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium enim adipisci esse delectus porro neque cumque consequatur fugit, perferendis atque? Neque voluptatibus nostrum, harum odio fuga incidunt aut modi.</p>
            </div>
            
            <div v-if="status == 'edit'">
                <h1>Vos modifications ont bien été enregistrées !</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium enim adipisci esse delectus porro neque cumque consequatur fugit, perferendis atque? Neque voluptatibus nostrum, harum odio fuga incidunt aut modi.</p>
            </div>

            <div v-if="status == 'meeting'">
                <h1>Votre demande de rendez-vous pour le {{ moment(quote.meeting_date).format('dddd d MMMM YYYY à HH:mm') }} a été acceptée !</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium enim adipisci esse delectus porro neque cumque consequatur fugit, perferendis atque? Neque voluptatibus nostrum, harum odio fuga incidunt aut modi.</p>
            </div>
        </div>

        <ul class="actions">
            <li v-if="currentUser.admin && communications.length == 0"><n-link class="btn default" :to="'/quotes/'+this.$route.params.id+'/communications'">Demander plus d'informations</n-link></li>
            <li v-if="communications.length > 0"><n-link class="btn default" :to="'/quotes/'+this.$route.params.id+'/communications'">Accéder aux commentaires</n-link></li>
            <li v-if="!currentUser.admin && communications.length > 0"><n-link class="btn default" :to="'/quotes/'+this.$route.params.id+'/edit'">Modifier</n-link></li>
            <li v-if="currentUser.admin"><n-link class="btn success" :to="'/quotes/'+this.$route.params.id+'/edit'">Faire une estimation</n-link></li>
            <li v-if="quote.price && quote.duration"><button class="btn success" @click.prevent='toggle("accept")'>Accepter l'estimation</button></li>
            <!-- <li v-if="currentUser.admin"><button class="btn danger" @click.prevent='toggle("refuse")'>Refuser la demande</button></li> -->
            <li><n-link id="backToList" class="btn primary" :to="'/quotes/'+this.$route.params.id+'/show'">Voir la demande</n-link></li>
            <li v-if="quote.accepted && !quote.meeting_date"><n-link id="backToList" class="btn primary" :to="'/quotes/'+this.$route.params.id+'/meetings'">Fixer un rendez-vous</n-link></li>
            <li><n-link id="backToList" class="btn primary" :to="'/quotes/list/'+back">Retour à la liste</n-link></li>
        </ul>
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
                isLoading: true,
                status: this.$route.query.status,
                quote: {
                    brand: '',
                    model: '',
                    doors: '',
                    tasks: []
                },
                back: '',
                communications: [],
                currentUser: JSON.parse(localStorage.getItem('user'))
            }
        },
        mounted() {
            moment.locale('fr')
            this.pageTitle = 'Demande ' + this.$route.params.id
            this.$store.commit('pageTitle/set', this.pageTitle)

            this.$axios.get('api/quotes/'+this.$route.params.id)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.quote = data.data.quote

                    if ( this.quote.duration ) {
                        let totalMinutes = this.quote.duration
                        let hours = Math.floor(totalMinutes / 60)
                        let minutes = totalMinutes % 60

                        this.quote.duration = hours + 'h' + minutes
                    }

                    if ( this.quote.waiting ) {
                        this.back = 'waiting'
                    }
                    if ( this.quote.accepted ) {
                        this.back = 'accepted'
                    }
                    if ( this.quote.waiting ) {
                        this.back = 'waiting'
                    }
                }

                this.isLoading = false
            })
            .catch(error => {
                console.log(error.response)
            })

            this.$axios.get('api/communications/'+this.$route.params.id)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.communications = data.data.communications
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
            toggle(status) {
                this.$axios.patch('api/admin/quotes/'+this.$route.params.id+'/'+status)
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>