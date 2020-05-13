<template>
    
    <div id="containerLogin">
        <div id="content">
            <img id="logo" src="~/assets/img/logo.png" alt="Logo Magic DSP">

            <div id="containerForms">
                <h2>Connexion</h2>

                <form id="loginForm">
                    <div class="input">
                        <label>Adresse email</label>
                        <input type="email" v-model="email">
                    </div>
                    <div class="input">
                        <label>Mot de passe</label>
                        <input type="password" v-model="password">
                    </div>

                    <div class="actions">
                        <button class="btn primary" type="button" @click="login">Connexion</button>
                    </div>
                </form>

                <br>

                <h2>Inscription</h2>

                <form id="registerForm">
                    <div class="input">
                        <label>Nom</label>
                        <input type="text" v-model="lastname">
                    </div>
                    <div class="input">
                        <label>Prénom</label>
                        <input type="text" v-model="firstname">
                    </div>
                    <div class="input">
                        <label>Adresse email</label>
                        <input type="email" v-model="email">
                    </div>
                    <div class="input">
                        <label>Mot de passe</label>
                        <input type="password" v-model="password">
                    </div>

                    <div class="actions">
                        <button class="btn primary" type="button" @click="register">Inscription</button>
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
                lastname: '',
                firstname: '',
                email: '',
                password: ''
            }
        },
        methods: {
            login(e) {
                e.preventDefault()
                this.$router.push('/dashboard')
            },
            register(e) {
                e.preventDefault()
                this.$router.push('/dashboard')
            }
        }
    }

</script>