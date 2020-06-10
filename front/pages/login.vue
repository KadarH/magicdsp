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

                    <div class="status">
                        <span class="title">Vous êtes un :</span>

                        <label class="radio">
                            <input type="radio" value='1' v-model='formRegister.status_id'>
                            <span class="fake"></span>
                            <span class="name">particulier</span>
                        </label>

                        <label class="radio">
                            <input type="radio" value='2' v-model='formRegister.status_id'>
                            <span class="fake"></span>
                            <span class="name">professionnel de l'automobile</span>
                        </label>

                        <label class="radio">
                            <input type="radio" value='3' v-model='formRegister.status_id'>
                            <span class="fake"></span>
                            <span class="name">cabinet d'expertise</span>
                        </label>
                    </div>
                    
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
                    status_id: '',
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

                        this.$cookies.set('auth', JSON.stringify(auth))
                        this.$cookies.set('user', JSON.stringify(data.user))

                        this.$router.push('/dashboard')
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            },
            async register() {
                await this.$axios.post('api/register', {
                    status_id: this.formRegister.status_id,
                    firstname: this.formRegister.firstname,
                    lastname: this.formRegister.lastname,
                    email: this.formRegister.email,
                    password: this.formRegister.password
                })
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        data = data.data
                        const auth = { token: data.token }

                        this.$cookies.set('auth', JSON.stringify(auth))
                        this.$cookies.set('user', JSON.stringify(data.user))

                        this.$router.push('/dashboard')
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }

</script>