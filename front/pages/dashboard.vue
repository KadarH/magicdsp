<template>
    
    <div id="pages-dashboard" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div id="newQuote">
            <form @submit.prevent="newQuote" enctype="multipart/form-data">
                <div class="input">
                    <label>Marque du véhicule</label>
                    <input type="text" v-model="formNewQuote.brand">
                </div>

                <div class="input">
                    <label>Modèle du véhicule</label>
                    <input type="text" v-model="formNewQuote.model">
                </div>

                <div class="input">
                    <label>Année du véhicule</label>
                    <input type="text" v-model="formNewQuote.year">
                </div>

                <div class="input">
                    <label>Immatriculation</label>
                    <input type="text" v-model="formNewQuote.plate_number">
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

                    <div class="task" :class='{ deleting: task.deleting, adding: task.adding }' v-for="(task, index) in formNewQuote.tasks">
                        <header>
                            <h2 class="title">Coup #{{ index + 1 }}</h2>
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
                                    <option value="null" selected>Sélectionner un emplacement</option>
                                    <option v-for="stroke in strokes" :value="stroke.id">{{ stroke.name }}</option>
                                </select>
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

                <button type="submit" id="btnSubmit" class="btn primary">Envoyer la demande</button> 
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
                pageTitle: 'Nouvelle demande',
                formNewQuote: {
                    brand: '',
                    model: '',
                    doors: '',
                    year: '',
                    plate_number: '',
                    tasks: []
                },
                strokes: '',
                isLoading: false,
                currentUser: JSON.parse(localStorage.getItem('user'))
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)

            this.formNewQuote.tasks.push({
                description: '',
                picture: '',
                url: '',
                stroke: null
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

            let currentUserId = this.currentUser.id
            OneSignal.push(function() {
                OneSignal.setExternalUserId(currentUserId)
            })
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        methods: {
            handleFileUpload(event, index) {
                this.formNewQuote.tasks[index].adding = true

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

                        this.formNewQuote.tasks[index].picture = data.file
                        this.formNewQuote.tasks[index].url = URL.createObjectURL(file)
                    }

                    this.formNewQuote.tasks[index].adding = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            newQuote() {
                this.isLoading = true;

                let tasks = []
                this.formNewQuote.tasks.map(task => {
                    tasks.push({
                        description: task.description,
                        picture: task.picture,
                        stroke_id: task.stroke
                    })
                })

                this.$axios.post('api/quotes', {
                    brand: this.formNewQuote.brand,
                    model: this.formNewQuote.model,
                    doors: this.formNewQuote.doors,
                    year: this.formNewQuote.year,
                    plate_number: this.formNewQuote.plate_number,
                    tasks: tasks
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.$router.push('/quotes/'+data.data.quote.id)
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            selectDoors(e) {
                this.formNewQuote.doors = e.target.value
            },
            addTask() {
                let taskInput = {
                    picture: '',
                    description: '',
                    stroke: null,
                    url: '',
                    deleting: false,
                    adding: false
                }

                this.formNewQuote.tasks.push(taskInput)
            },
            removeTask(index) {
                this.formNewQuote.tasks[index].deleting = true
                let indexToRemove = index

                this.$axios.post('api/tasks/delete/picture', {
                    file: this.formNewQuote.tasks[index].picture,
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        let tmpTasks = []
                        this.formNewQuote.tasks.map((task, index) => {
                            if ( index != indexToRemove ) {
                                tmpTasks.push({
                                    description: task.description,
                                    picture: task.picture,
                                    url: task.url,
                                    stroke: task.stroke
                                })
                            }
                        })

                        this.formNewQuote.tasks = tmpTasks
                    }

                    this.formNewQuote.tasks[index].deleting = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>