<template>
    
    <div id="pages-quotes-index" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div v-if="currentUser.admin" class="status">
            <div v-if="quote.waiting && !quote.price && !quote.duration">
                <h1>Nouveau devis !</h1>
                <p>Nouveau devis en attente d'actions.</p>
            </div>

            <div v-if="quote.waiting && quote.price && quote.duration">
                <h1>Vous avez déjà fait une estimation !</h1>
                <p>Estimation de {{ quote.price }}€ pour une durée de {{ quote.duration }}.</p>
            </div>

            <div v-if="quote.accepted && quote.meeting_date && quote.garage_id">
                <h1>L'utilisateur a accepté le devis et fixé un rendez-vous !</h1>
                <p><span class="title">Rendez-vous :</span> {{ moment(quote.meeting_date).format('DD/MM/YYYY à HH:mm') }}</p>
                <p><span class="title">Montant :</span> {{ quote.price }}€</p>
                <p><span class="title">Durée :</span> {{ quote.duration }}</p>
            </div>

            <div v-if="quote.refused">
                <h1>Vous avez refusé ce devis !</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti aspernatur libero distinctio sapiente! Eius repudiandae quae explicabo sit assumenda neque culpa nam maiores doloremque quibusdam deserunt iure, facilis ipsum soluta.</p>
            </div>
        </div>

        <div v-else class="status">
            <div v-if="quote.waiting && !quote.price && !quote.duration">
                <h1>Votre devis a bien été envoyé !</h1>
                <p>Devis envoyé et en attente de vérification par un admin.</p>
            </div>

            <div v-if="quote.waiting && quote.price && quote.duration">
                <h1>Une estimation a été établie !</h1>
                <p>Une estimation de {{ quote.price }}€ pour une durée de {{ quote.duration }} a été établie.</p>
            </div>

            <div v-if="quote.accepted && quote.meeting_date && quote.garage_id">
                <h1>Informations</h1>
                <p><span class="title">Rendez-vous :</span> {{ moment(quote.meeting_date).format('DD/MM/YYYY à HH:mm') }}</p>
                <p><span class="title">Montant :</span> {{ quote.price }}€</p>
                <p><span class="title">Durée :</span> {{ quote.duration }}</p>
            </div>

            <div v-if="quote.refused">
                <h1>Ce devis a été refusé !</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti aspernatur libero distinctio sapiente! Eius repudiandae quae explicabo sit assumenda neque culpa nam maiores doloremque quibusdam deserunt iure, facilis ipsum soluta.</p>
            </div>
        </div>

        <ul class="actions">
            <li v-if="quote.waiting && currentUser.admin && communications.length == 0"><n-link class="btn default" :to="'/quotes/'+this.$route.params.id+'/communications'">Demander plus d'informations</n-link></li>
            <li v-if="quote.waiting && communications.length > 0"><n-link class="btn default" :to="'/quotes/'+this.$route.params.id+'/communications'">Accéder aux commentaires</n-link></li>
            <li v-if="quote.waiting && !currentUser.admin && communications.length > 0"><n-link class="btn default" :to="'/quotes/'+this.$route.params.id+'/edit'">Modifier</n-link></li>
            <li v-if="quote.waiting && currentUser.admin"><n-link class="btn success" :to="'/quotes/'+this.$route.params.id+'/edit'">Faire une estimation</n-link></li>
            <li v-if="quote.waiting && !currentUser.admin && quote.price && quote.duration"><button class="btn success" @click.prevent='toggle("accept")'>Accepter l'estimation et fixer une date</button></li>
            <li v-if="quote.waiting && currentUser.admin"><button class="btn danger" @click.prevent='toggle("refuse")'>Refuser le devis</button></li>
            <li><n-link id="backToList" class="btn primary" :to="'/quotes/'+this.$route.params.id+'/show'">Voir le devis</n-link></li>
            <li v-if="!currentUser.admin && quote.accepted && !quote.meeting_date"><n-link id="backToList" class="btn primary" :to="'/quotes/'+this.$route.params.id+'/meetings'">Fixer un rendez-vous</n-link></li>
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
                currentUser: this.$cookies.get('user')
            }
        },
        mounted() {
            moment.locale('fr')
            this.pageTitle = 'Devis ' + this.$route.params.id
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
                this.isLoading = true

                this.$axios.patch('api/quotes/'+this.$route.params.id+'/'+status)
                .then(response => {
                    let data = response.data

                    console.log(data)
                    if ( data.success ) {
                        if ( status == 'accept' ) {
                            this.$router.push('/quotes/'+this.$route.params.id+'/meetings')
                        }

                        if ( status == 'refuse' ) {
                            this.quote.waiting = false
                            this.quote.accepted = false
                            this.quote.refused = true
                        }
                        
                        this.isLoading = false
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>