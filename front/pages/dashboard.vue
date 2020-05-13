<template>
    
    <div id="dashboard">
        <div class="container-quotes-list">
            <h2 class="title" @click="showQuotesList(0)">Demandes en attentes (2)</h2>

            <table class="quotes-list" id="quotes-list-0">
                <tbody>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="container-quotes-list">
            <h2 class="title" @click="showQuotesList(1)">Demandes approuvées (1)</h2>

            <table class="quotes-list" id="quotes-list-1">
                <tbody>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="container-quotes-list">
            <h2 class="title" @click="showQuotesList(2)">Demandes refusées (4)</h2>

            <table class="quotes-list" id="quotes-list-2">
                <tbody>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                    <tr>
                        <td>01/05/2020</td>
                        <td class="actions"><n-link to="/quote/1">Voir</n-link></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <n-link id="newDemand" to='/quote/new'>Nouvelle demande</n-link>
    </div>

</template>

<script>
    
    export default {
        middleware: 'auth',
        layout: 'app',
        data() {
            return {
            }
        },
        mounted() {
            console.log( this.$axios.$get('/api/toto') )
        },
        methods: {
           showQuotesList(index) {
                let list = document.getElementById('quotes-list-'+index)
                list.classList.toggle("show")
            }
        }
    }

</script>