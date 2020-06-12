<template>
    
    <div id="pages-garages-add" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div id="newgarage">
            <form @submit.prevent="newGarage" enctype="multipart/form-data">
                <div class="input">
                    <label>Nom du garage</label>
                    <input type="text" v-model="formNewGarage.name">
                </div>

                <div class="input">
                    <label>Status</label>
                    <select v-model="formNewGarage.status_id">
                        <option value="null" selected>Sélectionner un status</option>
                        <option v-for="status in status" :value="status.id">{{ status.name }}</option>
                    </select>
                </div>

                <ul class="actions">
                    <li><button type="submit" class="btn primary">Ajouter le garage</button></li>
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
                pageTitle: 'Ajouter un garage',
                formNewGarage: {
                    name: '',
                    status_id: null,
                    opening: null,
                    google_calendar: null
                },
                status: {},
                isLoading: true
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)

            this.$axios.get('api/status')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.status = data.data.status
                }

                this.isLoading = false
            })
            .catch(error => {
                console.log(error.response)
            })
        },
        methods: {
            newGarage() {
                this.isLoading = true;

                this.$axios.post('api/admin/garages', {
                    name: this.formNewGarage.name,
                    status_id: this.formNewGarage.status_id,
                    opening: this.formNewGarage.opening,
                    google_calendar: this.formNewGarage.google_calendar
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.$router.push('/admin/garage/'+data.data.garage.id+'/edit')
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
        },
        head() {
            return {
                title: this.pageTitle
            };
        }
    }

</script>