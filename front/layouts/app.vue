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
                    <li @click="showMainMenu"><n-link to="/quotes/list/waiting">Demandes en attentes ({{quotesWaiting.length}})</n-link></li>
                    <li @click="showMainMenu"><n-link to="/quotes/list/accepted">Demandes acceptées ({{quotesAccepted.length}})</n-link></li>
                    <li @click="showMainMenu"><n-link to="/quotes/list/refused">Demandes refusées ({{quotesRefused.length}})</n-link></li>
                    <li @click="showMainMenu"><n-link to="/notifications">Notifications ({{notifications.length}})</n-link></li>
                    <li @click="showAdminMenu" v-if="currentUser.admin">
                        <span class="title">Administration</span>
                        <ul :class="[this.adminMenu ? 'show' : '' ]">
                            <li><n-link to="/admin/users">Tous les utilisateurs</n-link></li>
                        </ul>
                    </li>
                    <li @click="showMainMenu"><a href="#" @click.prevent="logout">Déconnexion</a></li>
                </ul>
            </nav>
        </div>

        <div id="mainPage">
            <div id="mainTopbar" :style="topBarBackground">
                <h1 class="title">{{ this.$store.state.pageTitle.pageTitle }}</h1>
                <button id="btnShowMenu" @click="showMainMenu">
                    <div class="notifications" v-if="notifications.length"></div>
                    <span></span>
                </button>
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
                adminMenu: false,
                quotes: [],
                quotesWaiting: [],
                quotesAccepted: [],
                notifications: [],
                quotesRefused: [],
                currentUser: JSON.parse(localStorage.getItem('user')),
                topBarBackground: {
                    backgroundColor: (JSON.parse(localStorage.getItem('user')).status.topbar_background ? JSON.parse(localStorage.getItem('user')).status.topbar_background : '')
                }
            }
        },
        head() {
            return {
                bodyAttrs: {
                    class: this.mainMenu ? 'menu-open' : ''
                }
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
                if ( error.response.data.message == 'Unauthenticated.' ) {
                    localStorage.removeItem('auth')
                    localStorage.removeItem('user')

                    this.$router.push('/login')
                }
            })

            this.$axios.get('api/notifications')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.notifications = data.data.notifications
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
            },
            showAdminMenu() {
                this.adminMenu = !this.adminMenu
            }
        },
    }

</script>

<style lang="scss" src="~/assets/scss/app.scss"></style>