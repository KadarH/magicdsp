<template>
    
    <div id="pages-quotes-id" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <span v-if="currentUser.admin && quote.can_edit" class="can-edit">Vous avez demander à l'utilisateur d'effectuer des modifications !</span>

        <div id="getQuote">
            <form @submit.prevent="newQuote" enctype="multipart/form-data">
                <div class="input">
                    <label>Marque du véhicule</label>
                    <input type="text" v-model="quote.brand" disabled>
                </div>

                <div class="input">
                    <label>Modèle du véhicule</label>
                    <input type="text" v-model="quote.model" disabled>
                </div>

                <div class="input">
                    <label>Nombre de portes</label>
                    <input type="text" v-model="quote.doors" disabled>
                </div>

                <div id="tasks">

                    <div class="task" v-for="(task, index) in quote.tasks">
                        <header>
                            <h2 class="title">Coup #{{ index + 1 }}</h2>
                        </header>
                        
                        <div class="container">
                            <div class="input-file">
                                <div class="preview">
                                    <img :src="task.picture" alt="Photo du coup">
                                </div>
                            </div>

                            <div class="input">
                                <label>Ajouter un commentaire</label>
                                <textarea v-model="task.description" disabled></textarea>
                            </div>

                            <div class="input">
                                <label>Emplacement</label>
                                <select v-model="task.stroke" disabled>
                                    <option :value="stroke.id" v-for="stroke in strokes" :key="stroke.id">{{ stroke.name }}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

            </form>
            
            <ul class="actions">
                <li><n-link id="backToList" class="btn primary" :to="'/quotes/'+this.$route.params.id">Retour</n-link></li>
            </ul>
            
        </div>

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
                quote: {
                    brand: '',
                    model: '',
                    doors: '',
                    tasks: []
                },
                strokes: '',
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
                    this.quote.tasks.map(task => {
                        task.stroke = task.stroke_id
                    })
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

            this.$axios.get('api/strokes')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.strokes = data.data.strokes
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