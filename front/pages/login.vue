<template>
    
    <div id="containerLogin">
        <div id="content">
            <img id="logo" src="~/assets/img/logo.png" alt="Logo Magic DSP">

            <div id="containerForms">
                <h2>Connexion</h2>

                <form id="loginForm" ref="loginform" @submit.prevent="login">
                    <div class="input">
                        <label>Adresse email</label>
                        <input type="email" v-model="formLogin.email">
                    </div>
                    <div class="input">
                        <label>Mot de passe</label>
                        <input type="password" v-model="formLogin.password">
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
                        <input type="text" v-model="formRegister.lastname">
                    </div>
                    <div class="input">
                        <label>Prénom</label>
                        <input type="text" v-model="formRegister.firstname">
                    </div>
                    <div class="input">
                        <label>Adresse email</label>
                        <input type="email" v-model="formRegister.email">
                    </div>
                    <div class="input">
                        <label>Mot de passe</label>
                        <input type="password" v-model="formRegister.password">
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
        middleware: 'notAuthenticated',
        data() {
            return {
                formLogin: {
                    email: '',
                    password: ''
                },
                formRegister: {
                    lastname: '',
                    firstname: '',
                    email: '',
                    password: ''
                }
            }
        },
        mounted() {
            this.$axios.$get('/sanctum/csrf-cookie');
        },
        methods: {
            async login() {
                await this.$axios.post('api/login', {
                    email: this.formLogin.email,
                    password: this.formLogin.password
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        data = data.data
                        const auth = { token: data.token }

                        localStorage.setItem("auth", JSON.stringify(auth))
                        localStorage.setItem("user", JSON.stringify(data.user))

                        this.$router.push('/dashboard')
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            register() {
                this.$router.push('/dashboard')
            }
        }
    }

</script>