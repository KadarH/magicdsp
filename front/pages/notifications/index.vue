<template>
    
    <div id="pages-notifications-list" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <div v-if="notifications.length">
            <button @click="deleteAllNotifications">Vider</button>
        </div>

        <table id="list-notifications" v-if="notifications.length">

            <tbody>
                <tr v-for="(notification, index) in notifications" @click="read(notification)">
                    <td><span v-if="!notification.read" class="unread"></span>{{ notification.content }}</td>
                    <td class="date">{{ moment(notification.created_at).format('H:m DD/MM/Y') }}</td>
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
            deleteAllNotifications() {
                this.isLoading = true

                this.$axios.delete('api/notifications/')
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.$store.commit('notifications/reset')
                        this.notifications = []
                        this.isLoading = false
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            moment(date) {
                return moment(date)
            },
            read(notification) {
                if ( !notification.read ) {
                    this.$axios.patch('api/notifications/'+notification.id+'/read')
                    .then(response => {
                        let data = response.data

                        if ( data.success ) {
                            notification.read = true
                            this.$store.commit('notifications/decrement')
                        }
                    })
                    .catch(error => {
                        console.log(error.response)
                    })
                }
            }
        },
        head() {
            return {
                title: this.pageTitle
            };
        }
    }

</script>