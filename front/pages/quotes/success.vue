<template>
    
    <div id="pages-quotes-success" class="container-page">

        <h1>Votre demande a bien été envoyée !</h1>

        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium enim adipisci esse delectus porro neque cumque consequatur fugit, perferendis atque? Neque voluptatibus nostrum, harum odio fuga incidunt aut modi.</p>

        <n-link to="/dashboard" class="btn primary">Ajouter une nouvelle demande</n-link>

    </div>

</template>

<script>

    export default {
        middleware: 'authenticated',
        layout: 'app',
        data() {
            return {
                pageTitle: 'Demande ajoutée'
            }
        },
        mounted() {
            this.$store.commit('pageTitle/set', this.pageTitle)
        },
        head() {
            return {
                title: this.pageTitle
            };
        },
    }

</script>