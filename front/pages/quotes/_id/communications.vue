<template>
    
    <div id="pages-quotes-communications" class="container-page" :class='{ loading: isLoading }'>
        <Loading />

        <ul class="communications">
            <li v-for="(communication, index) in communications" :class="[ communication.user_id == currentUser.id ? 'me' : 'him' ]">
                {{ communication.body }}
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

            this.$axios.get('api/communications/'+this.$route.params.id)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.communications = data.data.communications
                    console.log(this.communications)
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
        },
        methods: {
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