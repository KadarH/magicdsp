<template>
    
    <div id="containerLogin">
        <div id="content">
            <img id="logo" src="~/assets/img/logo.png" alt="Logo Magic DSP">

            <div id="containerForms">
                <h2>Connexion</h2>

                <form id="loginForm" ref="loginform" @submit.prevent="login()">
                    <div class="input">
                        <label>Adresse email</label>
                        <input type="email" name="email">
                    </div>
                    <div class="input">
                        <label>Mot de passe</label>
                        <input type="password" name="password">
                    </div>

                    <div class="actions">
                        <button class="btn primary">Connexion</button>
                    </div>
                </form>

                <br>

                <h2>Inscription</h2>

                <form id="registerForm" @submit.prevent="register()">
                    <div class="input">
                        <label>Nom</label>
                        <input type="text" name="lastname">
                    </div>
                    <div class="input">
                        <label>Prénom</label>
                        <input type="text" name="firstname">
                    </div>
                    <div class="input">
                        <label>Adresse email</label>
                        <input type="email" name="email">
                    </div>
                    <div class="input">
                        <label>Mot de passe</label>
                        <input type="password" name="password">
                    </div>

                    <div class="actions">
                        <button class="btn primary">Inscription</button>
                    </div>
                </form>

            </div>
        </div>
        
    </div>

</template>

<script>
    
    export default {
        data() {
            return {
                error: {}
            }
        },
        mounted() {
            this.$axios.$get('/sanctum/csrf-cookie');
        },
        methods: {
            async login() {
                this.error = {}

                try {
                    const formData = new FormData(this.$refs.loginform)
                    await this.$auth.loginWith('local', { data: formData })
                } catch (err) {
                    this.error = err
                    console.log(this.error.response)
                }
            },
            register() {
                this.$router.push('/dashboard')
            }
        }
    }

</script>