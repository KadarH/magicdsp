<template>
    
    <div id="pages-quotes-id" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div id="getQuote">
            <form @submit.prevent="editQuote" enctype="multipart/form-data">
                <div class="input">
                    <label>Marque du véhicule</label>
                    <input type="text" v-model="formEditQuote.brand">
                </div>

                <div class="input">
                    <label>Modèle du véhicule</label>
                    <input type="text" v-model="formEditQuote.model">
                </div>

                <div class="input">
                    <label>Nombre de portes</label>
                    <select @change="selectDoors">
                        <option value="null" selected>Sélectionner une option</option>
                        <option value="3 portes">3 portes</option>
                        <option value="5 portes">5 portes</option>
                        <option value="Autres">Autre</option>
                    </select>
                </div>

                <div id="tasks">

                    <div class="task" v-for="(task, index) in formEditQuote.tasks">
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
                                <textarea v-model="task.description"></textarea>
                            </div>

                        </div>
                    </div>

                </div>

                <ul class="actions">
                    <li><button class="btn success">Valider</button></li>
                    <li><n-link id="backToList" class="btn danger" :to="'/quotes/'+this.$route.params.id">Annuler</n-link></li>
                </ul>
            </form>
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
                formEditQuote: {
                    brand: '',
                    model: '',
                    doors: '',
                    tasks: []
                },
                currentUser: JSON.parse(localStorage.getItem('user'))
            }
        },
        mounted() {
            this.pageTitle = 'Modifier Demande ' + this.$route.params.id
            this.$store.commit('pageTitle/set', this.pageTitle)

            this.$axios.get('api/quotes/'+this.$route.params.id)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.formEditQuote = data.data.quote
                    
                    if ( !this.formEditQuote.can_edit ) {
                        this.$router.push('/quotes/'+this.$route.params.id)
                    }
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
            selectDoors(e) {
                this.formEditQuote.doors = e.target.value
            },
            editQuote() {
                this.isLoading = true

                this.$axios.patch('api/quotes/'+this.$route.params.id, {
                    brand: this.formEditQuote.brand,
                    model: this.formEditQuote.model,
                    doors: this.formEditQuote.doors,
                    tasks: tasks
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.$router.push('/quotes/'+this.$route.params.id+'/result?status=edit')
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>