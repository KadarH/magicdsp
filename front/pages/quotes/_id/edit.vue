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

                    <div class="task" :class='{ deleting: task.deleting, adding: task.adding }' v-for="(task, index) in formEditQuote.tasks">
                        <header>
                            <h2 class="title">Coup #{{ index + 1 }}</h2>
                            <div v-if="task.deleting">aaaaaa</div>
                            <button class="btnDeleteTask" @click.prevent="removeTask(index)"><i class="fas fa-trash"></i></button>
                        </header>
                        
                        <div class="container">
                            <div class="input-file">
                                <label v-if="!task.url">
                                    <input type="file" accept="image/*" @change="handleFileUpload($event, index)">
                                    <span>Cliquer pour ajouter une photo</span>
                                </label>
                                <div class="preview" v-if="task.url">
                                    <img :src="task.url" alt="Photo du coup">
                                </div>
                            </div>

                            <div class="input">
                                <label>Ajouter un commentaire</label>
                                <textarea v-model="task.description"></textarea>
                            </div>

                            <div class="input">
                                <label>Emplacement</label>
                                <select v-model="task.stroke">
                                    <option :value="stroke.id" v-for="stroke in strokes" :key="stroke.id">{{ stroke.name }}</option>
                                </select>
                            </div>

                            <div v-if="currentUser.admin" class="price-time">
                                <div class="input">
                                    <label>Prix (€)</label>
                                    <input type="text" v-model="task.price">
                                </div>
                                <div class="input">
                                    <label>Temps (min.)</label>
                                    <input type="text" v-model="task.duration">
                                </div>
                            </div>

                        </div>

                        <div class="deleting">
                            Suppression en cours ...
                        </div>
                        <div class="adding">
                            Ajout en cours ...
                        </div>
                    </div>

                    <button id="btnAddTask" class="btn" @click.prevent="addTask">Ajouter un coup</button>

                </div>

                <ul class="actions" v-if="currentUser.admin">
                    <li><button class="btn success">Envoyer l'estimation</button></li>
                    <li><n-link id="backToList" class="btn danger" :to="'/quotes/'+this.$route.params.id">Annuler</n-link></li>
                </ul>
                <ul class="actions" v-else>
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
                strokes: '',
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
                    let tasks = this.formEditQuote.tasks
                    this.formEditQuote.tasks = []

                    if ( !this.formEditQuote.can_edit && !this.currentUser.admin ) {
                        this.$router.push('/quotes/'+this.$route.params.id)
                    }

                    tasks.map(task => {
                        this.formEditQuote.tasks.push({
                            picture: task.picture,
                            description: task.description,
                            price: task.price,
                            duration: task.duration,
                            url: task.picture,
                            id: task.id,
                            stroke: task.stroke_id,
                            deleting: false,
                            adding: false
                        })
                    })
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
            handleFileUpload(event, index) {
                this.formEditQuote.tasks[index].adding = true

                let formData = new FormData()
                const file = event.target.files[0]
                formData.append('file', file);

                this.$axios.post('api/tasks/upload/picture',
                    formData,
                    {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                )
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        data = data.data

                        this.formEditQuote.tasks[index].picture = data.file
                        this.formEditQuote.tasks[index].url = URL.createObjectURL(file)
                    }

                    this.formEditQuote.tasks[index].adding = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            selectDoors(e) {
                this.formEditQuote.doors = e.target.value
            },
            addTask() {
                let taskInput = {
                    picture: '',
                    description: '',
                    duration: '',
                    price: '',
                    url: '',
                    id: '',
                    deleting: false,
                    adding: false
                }

                this.formEditQuote.tasks.push(taskInput)
            },
            removeTask(index) {
                this.formEditQuote.tasks[index].deleting = true
                let indexToRemove = index
                let axiosAction = ''

                if ( this.formEditQuote.tasks[index].id ) {
                    axiosAction = this.$axios.delete('api/tasks/'+this.formEditQuote.tasks[index].id)
                } else {
                    axiosAction = this.$axios.post('api/tasks/delete/picture', {
                        file: this.formEditQuote.tasks[index].picture,
                    })
                }

                axiosAction
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        let tmpTasks = []
                        this.formEditQuote.tasks.map((task, index) => {
                            if ( index != indexToRemove ) {
                                tmpTasks.push({
                                    description: task.description,
                                    picture: task.picture,
                                    id: task.id,
                                    url: task.url,
                                    stroke: task.stroke,
                                    duration: task.duration,
                                    price: task.price,
                                })
                            }
                        })

                        this.formEditQuote.tasks = tmpTasks
                    }

                    this.formEditQuote.tasks[index].deleting = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            editQuote() {
                this.isLoading = true

                let tasks = []
                this.formEditQuote.tasks.map(task => {
                    tasks.push({
                        description: task.description,
                        picture: task.picture,
                        id: task.id,
                        duration: task.duration,
                        stroke_id: task.stroke,
                        price: task.price
                    })
                })

                this.$axios.patch('api/quotes/'+this.$route.params.id, {
                    brand: this.formEditQuote.brand,
                    model: this.formEditQuote.model,
                    doors: this.formEditQuote.doors,
                    tasks: tasks
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.$router.push('/quotes/'+this.$route.params.id)
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>