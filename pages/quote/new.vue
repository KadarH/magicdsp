<template>
    
    <div>

        <h1>Nouvelle demande</h1>

        <form>
            <div>
                <label>Ajouté photo 01</label>
                <input type="file">
            </div>
            <div>
                <label>Ajouté photo 02</label>
                <input type="file">
            </div>
            <div>
                <label>Ajouté photo 03</label>
                <input type="file">
            </div>

            <button type="button" @click="newQuote">Envoyer</button>
        </form>
    </div>

</template>

<script>
    
    export default {
        methods: {
            newQuote(e) {
                e.preventDefault()
                this.$router.push('/dashboard')
            }
        }
    }

</script>