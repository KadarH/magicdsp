<template>
    
    <div id="pages-quotes-meeting" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div id="container-garages">
            <select v-model="garageSelected" @change="selectGarage">
                <option value="null" selected>Sélectionner un garage</option>
                <option v-for="garage in garages" :value="garage.id">{{ garage.name }}</option>
            </select>
        </div>

        <select @change="selectMonth" v-model="monthSelected">
            <option v-for='(month, index) in months' :value="index">{{ month }}</option>
        </select>

        <table id="calendar" v-if="garageSelected">
            <thead>
                <tr>
                    <th>Lun.</th>
                    <th>Mar.</th>
                    <th>Mer.</th>
                    <th>Jeu.</th>
                    <th>Ven.</th>
                    <th>Sam.</th>
                    <th>Dim.</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in Math.ceil(dates.length / 7)">
                    <td v-for="date in dates.slice((i - 1) * 7, i * 7)">
                        <div v-if="date">
                            <button v-if="moment(date).isAfter(moment())" @click="selectDate($event, date)" class="btn-select-date" :class="{ 'current': moment(date).format('DD') == moment().date() }">{{ moment(date).format('DD') }}</button>
                            <span class="before" v-else>{{ moment(date).format('DD') }}</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div id="container-availabilities" v-if="dateSelected">
            <ul class="availabilities">
                <li class="availability" v-for="(availability, index) in availabilities">
                    <div class="content" :class="availability" v-if="availability == 'opened'" @click="selectHour($event, index)">
                        <span class="hour">{{ index }}</span>
                        <span class="free">Disponible</span>
                        <span class="chosen">Sélectionnée</span>
                    </div>
                    <div class="content" :class="availability" v-else><span class="hour">{{ index }}</span></div>
                </li>
            </ul>

            <ul class="actions">
                <li v-if="hourSelected"><button @click="confirmMeeting" class="btn primary">Valider</button></li>
            </ul>
        </div>
    </div>

</template>

<script>

    import moment from 'moment'
    import Loading from '~/components/Loading.vue'

    export default {
        middleware: 'authenticated',
        layout: 'app',
        components: {
            Loading
        },
        data() {
            return {
                pageTitle: 'Fixer un rendez-vous',
                month: '',
                isLoading: true,
                year: '',
                dates: [],
                quoteId: this.$route.params.id,
                dateSelected: '',
                dateHour: '',
                garages: '',
                garageSelected: null,
                hourSelected: '',
                availabilities: [],
                monthSelected: moment().month(),
                months: {
                    0: 'Janvier',
                    1: 'Février',
                    2: 'Mars',
                    3: 'Avril',
                    4: 'Mai',
                    5: 'Juin',
                    6: 'Juillet',
                    7: 'Août',
                    8: 'Septembre',
                    9: 'Octobre',
                    10: 'Novembre',
                    11: 'Décembre'
                }
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)
            moment.locale('fr')

            this.$axios.get('api/garages')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.garages = data.data.garages
                }

                this.isLoading = false
            })
            .catch(error => {
                console.log(error.response)
            })

            this.getMonthDates(this.monthSelected)
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        methods: {
            getMonthDates(monthNumber) {
                let days = ''
                this.dates = []

                this.year = moment().format('YYYY')
                this.month = monthNumber + 1
                days = moment(this.year+'-'+this.month).daysInMonth()
                let currentDay = moment().date()

                while ( days != 0 ) {
                    this.dates.push( moment(this.year+'-'+this.month+'-'+days).format('YYYY-MM-DD') )
                    days--;
                }

                this.dates.sort()

                let firstDay = moment(this.dates[0]).format('d')
                if ( firstDay != 1 ) {
                    while ( firstDay != 1 ) {
                        this.dates.unshift(null)
                        firstDay--;
                    }
                }
            },
            moment(date) {
                return moment(date)
            },
            selectGarage(e) {
                this.garageSelected = e.target.value
            },
            selectMonth(e) {
                this.monthSelected = e.target.value
            },
            selectDate(e, date) {
                let buttons = document.querySelectorAll('.btn-select-date')
                buttons.forEach(button => {
                    button.classList.remove('selected')
                })

                this.isLoading = true
                this.availabilities = ''
                this.dateSelected = ''

                this.$axios.get('api/garages/'+this.garageSelected+'/availabilities', {
                    params: {
                        date: date,
                        quote_id: this.$route.params.id
                    }
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.availabilities = data.data.garage.availabilities
                        this.dateSelected = date
                        e.target.classList.add('selected')
                    }

                    this.isLoading = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            selectHour(e, hour) {
                let hours = document.querySelectorAll('.availability .content')
                hours.forEach(hour => {
                    hour.classList.remove('selected')
                })

                e.target.classList.add('selected')
                this.hourSelected = hour
            },
            confirmMeeting() {
                this.isLoading = true

                this.$axios.patch('api/quotes/'+this.$route.params.id+'/meetings', {
                    date: this.dateSelected,
                    hour: this.hourSelected,
                    garage_id: this.garageSelected
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.$router.push('/quotes/'+this.$route.params.id+'?status=meeting')
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>