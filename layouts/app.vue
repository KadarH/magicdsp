<template>

	<div id="containerApp">

        <div id="mainMenu" :class="[this.mainMenu ? 'show' : '' ]">
            <div class="header">
                <img src="~/assets/img/logo.png" alt="Logo Magic DSP">
                <button id="btnHideMenu" @click="showMainMenu"><span></span></button>
            </div>
            <nav>
                <ul>
                    <li @click="showMainMenu"><n-link to="/dashboard">Tableau de bord</n-link></li>
                    <li @click="showMainMenu"><n-link to="/quote/list/waiting">Demandes en attentes (2)</n-link></li>
                    <li @click="showMainMenu"><n-link to="/quote/list/accepted">Demandes acceptées (1)</n-link></li>
                    <li @click="showMainMenu"><n-link to="/quote/list/refused">Demandes refusées (4)</n-link></li>
                    <li @click="showMainMenu"><n-link to="/login">Déconnexion</n-link></li>
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
                mainMenu: false
            }
        },
        methods: {
            showMainMenu() {
                this.mainMenu = !this.mainMenu
            }
        },
    }

</script>

<style lang="scss" src="~/assets/scss/app.scss"></style>