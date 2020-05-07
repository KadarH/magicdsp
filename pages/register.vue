<template>
    
    <div>
        <h1>Inscription</h1>

        <form>
            <input type="text" placeholder="Nom" v-model="lastname">
            <input type="text" placeholder="Prénom" v-model="firstname">
            <input type="email" placeholder="Email" v-model="email">
            <input type="password" placeholder="Mot de passe" v-model="password">

            <button type="button" @click="register">Inscription</button>
        </form>
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
            register(e) {
                e.preventDefault()
                this.$router.push('/dashboard')
            }
        }
    }

</script>