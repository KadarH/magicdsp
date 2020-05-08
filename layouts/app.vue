<template>

	<div id="containerApp">

        <div id="mainPage">

            <div id="mainTopbar">
                <h1 class="title">title</h1>
                <button id="btnShowMenu"><span></span></button>
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
            }
        },
        methods: {
            logout() {
                this.$router.push('/login')
			}
        },
    }

</script>

<style lang="scss" src="~/assets/scss/app.scss"></style>