<template>
    
    <div id="pages-quotes-communications" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <ul class="communications">
            <li v-for="(communication, index) in communications" :class="[ communication.user_id == currentUser.id ? 'me' : 'him' ]">
                <span class="body">{{ communication.body }}</span>
                <span class="date">{{ moment(communication.created_at).format('DD/MM/YYYY - h:mm:ss') }}</span>
            </li>
        </ul>

        <div class="add-communication">
            <form @submit.prevent="addCommunication">
                <textarea v-model="body" placeholder="Ecrire ..."></textarea>
                <button><i class="far fa-paper-plane"></i></button>
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
                communications: [],
                body: '',
                isLoading: true,
                currentUser: JSON.parse(localStorage.getItem('user'))
            }
        },
        mounted() {
            this.pageTitle = 'Communications Demande ' + this.$route.params.id
            this.$store.commit('pageTitle/set', this.pageTitle)
            moment.locale('fr')

            this.getCommunications()
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
        methods: {
            moment(date) {
                return moment(date)
            },
            getCommunications() {
                this.$axios.get('api/communications/'+this.$route.params.id)
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.communications = data.data.communications

                        if ( this.communications.length == 0 ) {
                            if ( !this.currentUser.admin ) {
                                this.$router.push('/quotes/'+this.$route.params.id)
                            }
                        }
                    }

                    this.isLoading = false
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            addCommunication() {
                let oldBody = this.body
                this.body = ''

                this.$axios.post('api/communications/'+this.$route.params.id, {
                    body: oldBody
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.communications.push(data.data.communication)
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>