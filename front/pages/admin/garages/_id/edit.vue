<template>
    
    <div id="pages-garage-edit" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div id="garage">
            <form @submit.prevent="editGarage" enctype="multipart/form-data">
                <div class="input">
                    <label>Nom du garage</label>
                    <input type="text" v-model="formEditGarage.name">
                </div>

                <div class="input">
                    <label>Status</label>
                    <select v-model="formEditGarage.status_id">
                        <option v-for="status in status" :value="status.id">{{ status.name }}</option>
                    </select>
                </div>

                <div id="google_calendars">
                    <span class="title">Calendriers Google</span>

                    <div v-for='(calendar, index) in formEditGarage.google_calendar' class="calendar">
                        <div class="input">
                            <label>Nom</label>
                            <input type="text" v-model="calendar.name">
                        </div>
                        <div class="input">
                            <label>ID</label>
                            <input type="text" v-model="calendar.id">
                        </div>

                        <button class="btn-delete-calendar" type="button" @click="deleteCalendar(index)">Supprimer</button>
                    </div>

                    <button class="btn default" type="button" @click="addCalendar">Ajouter un calendrier</button>
                </div>

                <div id="openings">
                    <div v-for="(day, index) in formEditGarage.opening" class="day">
                        <span class="day_name" @click="showDay($event)">{{moment().day(index).format('dddd')}}</span>
                        <table class="hours">
                            <tbody>
                                <tr v-for="(hour, index) in day">
                                    <td class="hour">{{index}}</td>
                                    <td class="status">
                                        <select v-model="hour.status" :class="hour.status">
                                            <option value="opened">Ouvert</option>
                                            <option value="closed">Fermé</option>
                                        </select>
                                    </td>
                                    <td class="display">
                                        <select v-model="hour.display" :class="[hour.display ? 'display' : '']">
                                            <option value="true">Afficher</option>
                                            <option value="false">Masquer</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <ul class="actions">
                    <li><button class="btn success">Modifier</button></li>
                    <li><n-link id="backToList" class="btn danger" :to="'/admin/garages'">Annuler</n-link></li>
                </ul>
            </form>
        </div>

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
                formEditGarage: {
                    name: '',
                    status_id: null,
                    opening: [],
                    google_calendar: []
                },
                status: {}
            }
        },
        mounted() {
            moment.locale('fr')
            this.pageTitle = 'Modifier garage ' + this.$route.params.id
            this.$store.commit('pageTitle/set', this.pageTitle)

            this.$axios.get('api/admin/garages/'+this.$route.params.id)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.formEditGarage = data.data.garage
                    
                    if ( !this.formEditGarage.google_calendar || this.formEditGarage.google_calendar == '' || this.formEditGarage.google_calendar == null ) {
                        this.formEditGarage.google_calendar = []
                    }
                }

                this.isLoading = false
            })
            .catch(error => {
                console.log(error.response)
            })

            this.$axios.get('api/status')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.status = data.data.status
                }
            })
            .catch(error => {
                console.log(error.response)
            })
        },
        head() {
            return {
                title: this.pageTitle
            }
        },
        methods: {
            deleteCalendar(index) {
                this.formEditGarage.google_calendar.splice(index, 1)
            },
            showDay(event) {
                event.srcElement.parentElement.classList.toggle('show')
            },
            editGarage() {
                this.isLoading = true

                this.$axios.patch('api/admin/garages/'+this.$route.params.id, {
                    name: this.formEditGarage.name,
                    status_id: this.formEditGarage.status_id,
                    opening: this.formEditGarage.opening,
                    google_calendar: this.formEditGarage.google_calendar
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.formEditGarage = data.data.garage

                        if ( !this.formEditGarage.google_calendar || this.formEditGarage.google_calendar == '' || this.formEditGarage.google_calendar == null ) {
                            this.formEditGarage.google_calendar = []
                        }
                    }

                    this.isLoading = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            moment(date) {
                return moment(date)
            },
            addCalendar() {
                this.formEditGarage.google_calendar.push({
                    name: '',
                    id: ''
                })
            }
        }
    }

</script>