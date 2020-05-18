<template>
    
    <div id="pages-quotes-id" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

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

                        </div>
                    </div>

                </div>

            </form>
            
            <n-link id="backToList" class="btn primary" :to="'/quotes/list/'+back">Retour à la liste</n-link>
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
                back: ''
            }
        },
        mounted() {
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

                    this.pageTitle = 'Demande ' + this.quote.id
                    this.$store.commit('pageTitle/set', this.pageTitle)
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
    }

</script>