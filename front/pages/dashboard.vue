<template>
    
    <div id="pages-dashboard" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div id="newQuote">
            <form @submit.prevent="newQuote" enctype="multipart/form-data">
                <div class="input" :class="errors.brand !== undefined ? 'error' : ''">
                    <label>Marque du véhicule*</label>
                    <input type="text" v-model="formNewQuote.brand">
                    <span class="error-message" v-if="errors.brand !== undefined">*Ce champ est obligatoire</span>
                </div>

                <div class="input" :class="errors.model !== undefined ? 'error' : ''">
                    <label>Modèle du véhicule*</label>
                    <input type="text" v-model="formNewQuote.model">
                    <span class="error-message" v-if="errors.model !== undefined">*Ce champ est obligatoire</span>
                </div>

                <div class="input" :class="errors.year !== undefined ? 'error' : ''">
                    <label>Année du véhicule*</label>
                    <input type="text" v-model="formNewQuote.year">
                    <span class="error-message" v-if="errors.year !== undefined">*Ce champ est obligatoire</span>
                </div>

                <div class="input" :class="errors.plate_number !== undefined ? 'error' : ''">
                    <label>Immatriculation*</label>
                    <input type="text" v-model="formNewQuote.plate_number">
                    <span class="error-message" v-if="errors.plate_number !== undefined">*Ce champ est obligatoire</span>
                </div>

                <div class="input">
                    <label>Numéro de chassis</label>
                    <input type="text" v-model="formNewQuote.chassis_number">
                </div>

                <div class="input" :class="errors.doors !== undefined ? 'error' : ''">
                    <label>Nombre de portes*</label>
                    <select @change="selectDoors">
                        <option value="null" selected>Sélectionner une option</option>
                        <option value="3 portes">3 portes</option>
                        <option value="5 portes">5 portes</option>
                        <option value="Autres">Autre</option>
                    </select>
                    <span class="error-message" v-if="errors.doors !== undefined">*Ce champ est obligatoire</span>
                </div>

                <div id="tasks">
                    <span class="error-message" v-if="errors.tasks !== undefined">*Vous devez ajouter au moins une photo</span>

                    <div class="task" :class='{ deleting: task.deleting, adding: task.adding }' v-for="(task, index) in formNewQuote.tasks">
                        <header>
                            <h2 class="title">Photo #{{ index + 1 }}</h2>
                            <button class="btnDeleteTask" @click.prevent="removeTask(index)"><i class="fas fa-trash"></i></button>
                        </header>
                        
                        <div class="container">
                            <div class="input-file">
                                <label v-if="!task.url">
                                    <input type="file" accept="image/*" @change="handleFileUpload($event, index)">
                                    <span>Cliquer pour ajouter une photo</span>
                                </label>
                                <div class="preview" v-if="task.url">
                                    <img :src="task.url" alt="Photo">
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

                    <button id="btnAddTask" class="btn" @click.prevent="addTask">Ajouter une photo</button>
                </div>

                <button type="submit" id="btnSubmit" class="btn primary">Envoyer le devis</button> 
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
                pageTitle: 'Nouveau devis',
                formNewQuote: {
                    brand: '',
                    model: '',
                    doors: '',
                    year: '',
                    plate_number: '',
                    chassis_number: '',
                    tasks: []
                },
                strokes: '',
                isLoading: false,
                currentUser: this.$cookies.get('user'),
                errors: []
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
                this.errors = []

                let tasks = []
                this.formNewQuote.tasks.map(task => {
                    tasks.push({
                        description: task.description,
                        picture: task.picture,
                        stroke_id: task.stroke
                    })
                })

                if ( tasks[0].picture == '' ) {
                    this.errors = {
                        tasks: true
                    }

                    this.isLoading = false
                } else {
                    this.$axios.post('api/quotes', {
                        brand: this.formNewQuote.brand,
                        model: this.formNewQuote.model,
                        doors: this.formNewQuote.doors,
                        year: this.formNewQuote.year,
                        plate_number: this.formNewQuote.plate_number,
                        chassis_number: this.formNewQuote.chassis_number,
                        tasks: tasks
                    })
                    .then(response => {
                        let data = response.data

                        if ( data.success ) {
                            this.$router.push('/quotes/'+data.data.quote.id)
                        }
                    })
                    .catch(error => {
                        this.errors = error.response.data.errors
                        this.isLoading = false
                    })
                }
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