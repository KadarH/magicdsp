<template>
    
    <div id="pages-users-list" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <table id="list-users" v-if="users.length">

            <tbody>
                <tr v-for="user in users">
                    <td><n-link :to="'/admin/users/'+user.id">{{ user.firstname }} {{ user.lastname }}</n-link></td>
                    <td align="right">{{ user.email }}</td>
                </tr>
            </tbody>

        </table>
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
                pageTitle: 'Utilisateurs',
                users: [],
                isLoading: true
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)

            this.$axios.get('api/admin/users')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.users = data.data.users
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