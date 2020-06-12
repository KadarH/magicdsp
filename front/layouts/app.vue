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

                    <li @click="showMainMenu" v-if="notificationsUnread"><n-link to="/notifications">Notifications <span class="count-notifications">{{notifications.length}}</span></n-link></li>
                    <li @click="showMainMenu" v-else><n-link to="/notifications">Notifications ({{notifications.length}})</n-link></li>

                    <li @click="showAdminMenu" v-if="currentUser.admin">
                        <span class="title">Administration</span>
                        <ul :class="[this.adminMenu ? 'show' : '' ]">
                            <li @click="showMainMenu"><n-link to="/admin/users">Tous les utilisateurs</n-link></li>
                            <li @click="showMainMenu" v-for="status in status"><n-link :to="'/admin/users/status/'+status.id+'/quotes'">Demandes des "{{status.name}}"</n-link></li>
                            <li @click="showMainMenu"><n-link to="/admin/garages">Tous les garages</n-link></li>
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
                    <div class="notifications" v-if="notificationsUnread"></div>
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
                status: '',
                notificationsUnread: false,
                quotesRefused: [],
                currentUser: this.$cookies.get('user'),
                topBarBackground: {
                    backgroundColor: (this.$cookies.get('user').status.topbar_background ? this.$cookies.get('user').status.topbar_background : '')
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
            this.$axios.get('api/status')
            .then(response => {
                let data = response.data

                if ( data.success ) {
                    this.status = data.data.status
                }
            })
            .catch(error => {
                console.log(error.response)
            })

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
                    this.$cookies.remove('auth')
                    this.$cookies.remove('user')

                    this.$router.push('/login')
                }
            })

            this.$axios.get('api/notifications')
            .then(response => {
                let data = response.data
                
                if ( data.success ) {
                    this.notifications = data.data.notifications

                    this.notifications.map(notification => {
                        if ( !notification.read ) {
                            this.notificationsUnread = true
                        }
                    })
                }
            })
            .catch(error => {
                console.log(error.response)
            })

            OneSignal.push(() => {
                OneSignal.on('subscriptionChange', (isSubscribed) => {
                    if ( isSubscribed === true ) {
                        OneSignal.sendTag("user_id", this.currentUser.id)
                    }
                });
            });
        },
        methods: {
            async logout() {
                await this.$axios.get('api/logout')
                .then(response => {
                    let data = response.data

                    if ( data.success ) {
                        this.$cookies.remove('auth')
                        this.$cookies.remove('user')

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
        }
    }

</script>

<style lang="scss" src="~/assets/scss/app.scss"></style>