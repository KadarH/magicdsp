<template>
    
    <div id="pages-quotes-index" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <!-- <span v-if="currentUser.admin && quote.can_edit" class="can-edit">Vous avez demander à l'utilisateur d'effectuer des modifications !</span> -->

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
                <h1>Votre demande de rendez-vous a été prise en compte !</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium enim adipisci esse delectus porro neque cumque consequatur fugit, perferendis atque? Neque voluptatibus nostrum, harum odio fuga incidunt aut modi.</p>
            </div>
        </div>

        <ul class="actions">
            <li v-if="currentUser.admin && communications.length == 0"><n-link class="btn default" :to="'/quotes/'+this.$route.params.id+'/communications'">Demander plus d'informations</n-link></li>
            <li v-if="communications.length > 0"><n-link class="btn default" :to="'/quotes/'+this.$route.params.id+'/communications'">Accéder aux commentaires</n-link></li>
            <li v-if="!currentUser.admin && quote.can_edit"><n-link class="btn default" :to="'/quotes/'+this.$route.params.id+'/edit'">Modifier</n-link></li>
            <li v-if="currentUser.admin && !quote.can_edit"><button class="btn default" @click.prevent='toggle("edit")'>Autoriser la modification</button></li>
            <li v-if="currentUser.admin && !quote.can_edit"><button class="btn success" @click.prevent='toggle("accept")'>Accepter</button></li>
            <li v-if="currentUser.admin && !quote.can_edit"><button class="btn danger" @click.prevent='toggle("refuse")'>Refuser</button></li>
            <li><n-link id="backToList" class="btn primary" :to="'/quotes/'+this.$route.params.id+'/show'">Voir la demande</n-link></li>
            <li v-if="quote.accepted"><n-link id="backToList" class="btn primary" :to="'/quotes/'+this.$route.params.id+'/meetings'">Fixer un rendez-vous</n-link></li>
            <li><n-link id="backToList" class="btn primary" :to="'/quotes/list/'+back">Retour à la liste</n-link></li>
        </ul>
    </div>

</template>

<script>

    import Loading from '~/components/Loading.vue'

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
            this.pageTitle = 'Demande ' + this.$route.params.id
            this.$store.commit('pageTitle/set', this.pageTitle)

            this.$axios.get('api/quotes/'+this.$route.params.id)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.quote = data.data.quote

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