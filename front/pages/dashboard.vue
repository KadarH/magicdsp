<template>
    
    <div class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div id="newQuote">
            <h1 class="title">Nouvelle demande</h1>

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

                    <div class="task" v-for="(task, index) in formNewquote.tasks">
                        <h2 class="title">Coup #{{ index + 1 }}</h2>

                        <div class="container">
                            <div class="input-file">
                                <label v-if="!task.url">
                                    <input type="file" accept="image/*" @change="handleFileUpload($event, index)">
                                    <span>Ajouter une photo</span>
                                </label>
                                <div class="preview" v-if="task.url">
                                    <img :src="task.url" alt="Aperçu photo">
                                </div>
                            </div>

                            <div class="input">
                                <label>Commentaire</label>
                                <input type="text" v-model="task.description">
                            </div>

                            <button @click.prevent="removeTask(index)">Supprimer ce coup</button>
                        </div>
                    </div>

                    <button @click.prevent="addTask">Ajouter un coup</button>

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
            this.isLoading = false
        },
        methods: {
            handleFileUpload(event, index) {
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

                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
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
                    url: ''
                }

                this.formNewquote.tasks.push(taskInput)
            },
            removeTask(index) {
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
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>