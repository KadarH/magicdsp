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

                    <div class="status" :class="errors.status_id !== undefined ? 'error' : ''">
                        <span class="title">Vous êtes un* :</span>

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

                        <span class="error-message" v-if="errors.status_id !== undefined">*Ce champ est obligatoire</span>
                    </div>
                    
                    <div class="input" :class="errors.lastname !== undefined ? 'error' : ''">
                        <label>Nom*</label>
                        <input type="text" v-model="formRegister.lastname">
                        <span class="error-message" v-if="errors.lastname !== undefined">*Ce champ est obligatoire</span>
                    </div>
                    <div class="input" :class="errors.firstname !== undefined ? 'error' : ''">
                        <label>Prénom*</label>
                        <input type="text" v-model="formRegister.firstname">
                        <span class="error-message" v-if="errors.firstname !== undefined">*Ce champ est obligatoire</span>

                    </div>
                    <div class="input" :class="errors.email !== undefined ? 'error' : ''">
                        <label>Adresse email*</label>
                        <input type="email" v-model="formRegister.email">
                        <span class="error-message" v-if="errors.email !== undefined">*Ce champ est obligatoire</span>

                    </div>
                    <div class="input" :class="errors.address !== undefined ? 'error' : ''">
                        <label>Adresse*</label>
                        <input type="text" v-model="formRegister.address">
                        <span class="error-message" v-if="errors.address !== undefined">*Ce champ est obligatoire</span>

                    </div>
                    <div class="input" :class="errors.phone_number !== undefined ? 'error' : ''">
                        <label>Numéro de téléphone*</label>
                        <input type="tel" v-model="formRegister.phone_number">
                        <span class="error-message" v-if="errors.phone_number !== undefined">*Ce champ est obligatoire</span>

                    </div>
                    <div class="input" :class="errors.password !== undefined ? 'error' : ''">
                        <label>Mot de passe*</label>
                        <input type="password" v-model="formRegister.password">
                        <span class="error-message" v-if="errors.password !== undefined">*Ce champ est obligatoire</span>

                    </div>

                    <div class="actions">
                        <button class="btn primary">Inscription</button>
                    </div>
                </form>

            </div>

            <n-link to="/password/forgot" class="link-forgot-password">Mot de passe oublié ?</n-link>

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
                    address: '',
                    phone_number: '',
                    email: '',
                    password: ''
                },
                errors: []
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
                this.errors = []

                await this.$axios.post('api/register', {
                    status_id: this.formRegister.status_id,
                    firstname: this.formRegister.firstname,
                    lastname: this.formRegister.lastname,
                    address: this.formRegister.address,
                    phone_number: this.formRegister.phone_number,
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
                    this.errors = error.response.data.errors
                })
            }
        },
        head() {
            return {
                bodyAttrs: {
                    'page': 'login'
                }
            }
        }
    }

</script>