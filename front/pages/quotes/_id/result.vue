<template>
    
    <div id="pages-quotes-success" class="container-page">

        <div v-if="status == 'create'">
            <h1>Votre demande a bien été envoyée !</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium enim adipisci esse delectus porro neque cumque consequatur fugit, perferendis atque? Neque voluptatibus nostrum, harum odio fuga incidunt aut modi.</p>
            <n-link to="/dashboard" class="btn primary">Ajouter une nouvelle demande</n-link>
        </div>
        
        <div v-if="status == 'edit'">
            <h1>Vos modifications ont bien été enregistrées !</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium enim adipisci esse delectus porro neque cumque consequatur fugit, perferendis atque? Neque voluptatibus nostrum, harum odio fuga incidunt aut modi.</p>
            <n-link :to="'/quotes/'+this.$route.params.id" class="btn primary">Retour à la demande</n-link>
        </div>

    </div>

</template>

<script>

    export default {
        middleware: 'authenticated',
        layout: 'app',
        data() {
            return {
                pageTitle: 'Demande ajoutée',
                status: this.$route.query.status
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