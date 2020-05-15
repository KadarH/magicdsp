<template>

	<div id="containerApp">

        <div id="mainMenu" :class="[this.mainMenu ? 'show' : '' ]">
            <div class="header">
                <img src="~/assets/img/logo.png" alt="Logo Magic DSP">
                <button id="btnHideMenu" @click="showMainMenu"><span></span></button>
            </div>
            <nav>
                <ul>
                    <li @click="showMainMenu"><n-link to="/dashboard">Nouvelle demande</n-link></li>
                    <li @click="showMainMenu"><n-link to="/quote/list/waiting">Demandes en attentes ({{quotesWaiting.length}})</n-link></li>
                    <li @click="showMainMenu"><n-link to="/quote/list/accepted">Demandes acceptées ({{quotesAccepted.length}})</n-link></li>
                    <li @click="showMainMenu"><n-link to="/quote/list/refused">Demandes refusées ({{quotesRefused.length}})</n-link></li>
                    <li @click="showMainMenu"><a href="#" @click.prevent="logout">Déconnexion</a></li>
                </ul>
            </nav>
        </div>

        <div id="mainPage">
            <div id="mainTopbar">
                <h1 class="title">title</h1>
                <button id="btnShowMenu" @click="showMainMenu"><span></span></button>
            </div>

            <div id="containerMainPage">
        		<nuxt />
            </div>
        </div>

	</div>
    
</template>

<script>

    export default {
        data() {
            return {
                mainMenu: false,
                quotes: [],
                quotesWaiting: [],
                quotesAccepted: [],
                quotesRefused: []
            }
        },
        mounted() {
            this.$axios.get('api/quotes')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.quotes = data.data.quotes

                    this.quotes.map(quote => {
                        if ( quote.waiting ) {
                            this.quotesWaiting.push(quote)
                        }
                        if ( quote.accepted ) {
                            this.quotesAccepted.push(quote)
                        }
                        if ( quote.refused ) {
                            this.quotesRefused.push(quote)
                        }
                    })
                }
            })
            .catch(error => {
                console.log(error.response)
            })
        },
        methods: {
            async logout() {
                await this.$axios.get('api/logout')
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        localStorage.removeItem('auth')
				        localStorage.removeItem('user')

                        this.$router.push('/login')
                    }
                })
                .catch(error => {
                    console.log(error.response)
                })
			},
            showMainMenu() {
                this.mainMenu = !this.mainMenu
            }
        },
    }

</script>

<style lang="scss" src="~/assets/scss/app.scss"></style>