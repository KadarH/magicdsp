<template>
    
    <div id="pages-quotes-id" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div id="getQuote">
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

                <div>
                    <label>Calendrier Google</label>
                    <div v-for='calendar in formEditGarage.google_calendar'>
                        <label>Nom</label>
                        <input type="text" v-model="calendar.name">
                        <label>ID</label>
                        <input type="text" v-model="calendar.id">
                    </div>
                    <button type="button" @click="addCalendar">Ajouter un calendrier</button>
                </div>

                <div>
                    <div v-for="(day, index) in formEditGarage.opening">
                        <div>
                            <span>{{moment().day(index).format('dddd')}}</span>
                            <table>
                                <tbody>
                                    <tr v-for="(hour, index) in day">
                                        <td>{{index}}</td>
                                        <td>
                                            <select v-model="hour.status">
                                                <option value="opened">Ouvert</option>
                                                <option value="closed">Fermé</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select v-model="hour.display">
                                                <option value="true">Afficher</option>
                                                <option value="false">Masquer</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
            };
        },
        methods: {
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