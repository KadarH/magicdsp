<template>
    
    <div id="containerReset">
        <div id="content">
            <img id="logo" src="~/assets/img/logo.png" alt="Logo Magic DSP">

            <div id="containerForms">
                <h2>Modifier votre mot de passe</h2>

                <form id="loginReset" ref="loginReset" @submit.prevent="reset">
                    <div class="input">
                        <label>Mot de passe</label>
                        <input type="password" v-model="password">
                    </div>

                    <div class="actions">
                        <button class="btn primary">Valider</button>
                    </div>
                </form>

            </div>

            <div v-if="success">Mot de passe modifié, retourner sur /login</div>

            <n-link to="/login" class="link-forgot-password">Connexion/Inscription</n-link>
        </div>
        
    </div>

</template>

<script>
    
    export default {
        middleware: 'notAuthenticated',
        data() {
            return {
                password: '',
                success: false
            }
        },
        mounted() {
            this.$axios.get('api/password/reset/'+this.$route.params.token)
            .then(response => {
                let data = response.data

                if ( data.success ) {
                } else {
                    this.$router.push('/login')
                }
            })
            .catch(error => {
                this.$router.push('/login')
            })
        },
        methods: {
            reset() {
                this.$axios.post('api/password/new', {
                    password: this.password,
                    token: this.$route.params.token,
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.success = true
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>