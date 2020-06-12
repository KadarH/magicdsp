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

                <ul class="actions">
                    <li><button class="btn success">Modifier</button></li>
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
                formEditGarage: {
                    name: '',
                    status_id: null,
                    opening: null,
                    google_calendar: null
                },
                status: {}
            }
        },
        mounted() {
            this.pageTitle = 'Modifier garage ' + this.$route.params.id
            this.$store.commit('pageTitle/set', this.pageTitle)

            this.$axios.get('api/admin/garages/'+this.$route.params.id)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.formEditGarage = data.data.garage
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
                    }

                    this.isLoading = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>