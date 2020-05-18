<template>
    
    <div id="pages-dashboard" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div id="newQuote">
            <form @submit.prevent="newQuote" enctype="multipart/form-data">
                <div class="input">
                    <label>Marque du véhicule</label>
                    <input type="text" v-model="formNewquote.brand">
                </div>

                <div class="input">
                    <label>Modèle du véhicule</label>
                    <input type="text" v-model="formNewquote.model">
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

                    <div class="task" :class='{ deleting: task.deleting, adding: task.adding }' v-for="(task, index) in formNewquote.tasks">
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
                                    <img :src="task.url" alt="Aperçu photo">
                                </div>
                            </div>

                            <div class="input">
                                <label>Ajouter un commentaire</label>
                                <textarea v-model="task.description"></textarea>
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
                formNewquote: {
                    brand: '',
                    model: '',
                    doors: '',
                    tasks: []
                },
                isLoading: false
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)
            this.isLoading = false
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        methods: {
            handleFileUpload(event, index) {
                this.formNewquote.tasks[index].adding = true

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

                        this.formNewquote.tasks[index].picture = data.file
                        this.formNewquote.tasks[index].url = URL.createObjectURL(file)
                    }

                    this.formNewquote.tasks[index].adding = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            newQuote() {
                this.isLoading = true;

                let tasks = []
                this.formNewquote.tasks.map(task => {
                    tasks.push({
                        description: task.description,
                        picture: task.picture
                    })
                })

                this.$axios.post('api/quotes', {
                    brand: this.formNewquote.brand,
                    model: this.formNewquote.model,
                    doors: this.formNewquote.doors,
                    tasks: tasks
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        data = data.data
                    }

                    this.$router.push('/quotes/success')
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            selectDoors(e) {
                this.formNewquote.doors = e.target.value
            },
            addTask() {
                let taskInput = {
                    picture: '',
                    description: '',
                    url: '',
                    deleting: false,
                    adding: false
                }

                this.formNewquote.tasks.push(taskInput)
            },
            removeTask(index) {
                this.formNewquote.tasks[index].deleting = true
                let indexToRemove = index

                this.$axios.post('api/tasks/delete/picture', {
                    file: this.formNewquote.tasks[0].picture,
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        let tmpTasks = []
                        this.formNewquote.tasks.map((task, index) => {
                            if ( index != indexToRemove ) {
                                tmpTasks.push({
                                    description: task.description,
                                    picture: task.picture,
                                    url: task.url
                                })
                            }
                        })

                        this.formNewquote.tasks = tmpTasks
                    }

                    this.formNewquote.tasks[index].deleting = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>