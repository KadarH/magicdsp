<template>
    
    <div id="pages-notifications-list" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <table id="list-notifications" v-if="notifications.length">

            <tbody>
                <tr v-for="(notification, index) in notifications">
                    <td>{{ notification.content }}</td>
                    <td class="date">{{ moment(notification.created_at).format('H:m d/m/Y') }}</td>
                </tr>
            </tbody>

        </table>

        <div v-else>
            Aucune notification !
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
                pageTitle: 'Notifications',
                notifications: [],
                isLoading: true
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)
            moment.locale('fr')

            this.$axios.get('api/notifications')
            .then(response => {
                let data = response.data
                console.log(response)

                if ( data.success ) {
                    this.notifications = data.data.notifications
                }

                this.isLoading = false
            })
            .catch(error => {
                console.log(error.response)
            })
        },
        methods: {
            moment(date) {
                return moment(date)
            }
        },
        head() {
            return {
                title: this.pageTitle
            };
        }
    }

</script>