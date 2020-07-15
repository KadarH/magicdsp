<template>
    
    <div id="containerReset">
        <div id="content">
            <img id="logo" src="~/assets/img/logo.png" alt="Logo Magic DSP">

            <div id="containerForms">
                <h2>Mot de passe oublié</h2>

                <form id="loginReset" ref="loginReset" @submit.prevent="reset" v-if="!success">
                    <div class="input">
                        <label>Adresse email</label>
                        <input type="email" v-model="email">
                    </div>

                    <div class="actions">
                        <button class="btn primary">Demande de réinitialisation</button>
                    </div>
                </form>

                <div class="success" v-else>Votre demande a bien été enregistrée. Dans quelques minutes, vous recevrez un email avec un lien pour réinitialiser votre mot de passe.</div>
            </div>

            <n-link to="/login" class="link-forgot-password">Connexion/Inscription</n-link>
        </div>
        
    </div>

</template>

<script>
    
    export default {
        middleware: 'notAuthenticated',
        data() {
            return {
                email: '',
                success: false
            }
        },
        mounted() {
        },
        methods: {
            reset() {
                this.$axios.post('api/password/forgot', {
                    email: this.email
                })
                .then(response => {
                    let data = response.data
                    console.log(data)

                    if ( data.success ) {
                        this.success = true
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        },
        head() {
            return {
                bodyAttrs: {
                    'page': 'password-forgot'
                }
            }
        }
    }

</script>