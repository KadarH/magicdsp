<template>
    
    <div id="pages-garages-list" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <table id="list-garages" v-if="garages.length">

            <tbody>
                <tr v-for="(garage, index) in garages">
                    <td><n-link :to="'/admin/garages/'+garage.id">{{ garage.name }}</n-link></td>
                </tr>
            </tbody>

        </table>

        <div v-else>
            Aucune garage !
        </div>

        <ul class="actions">
            <li><n-link class="btn primary" to="/admin/garages/add">Ajouter un garage</n-link></li>
        </ul>
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
                pageTitle: 'Garages',
                garages: [],
                isLoading: true
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)

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
        },
        head() {
            return {
                title: this.pageTitle
            };
        }
    }

</script>