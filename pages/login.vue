<template>
    
    <div>
        <h1>Connexion</h1>

        <form>
            <input type="email" placeholder="Email" v-model="email">
            <input type="password" placeholder="Mot de passe" v-model="password">

            <button type="button" @click="login">Connexion</button>
            <n-link to="/register">Inscription</n-link>
        </form>
    </div>

</template>

<script>
    
    export default {
        data() {
            return {
                email: '',
                password: ''
            }
        },
        methods: {
            login(e) {
                e.preventDefault()
                this.$router.push('/dashboard')
            }
        }
    }

</script>