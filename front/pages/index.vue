<template>
	
	

</template>

<script>

	export default {
		mounted() {
			this.$router.push('/login')
		},
		head() {
            return {
                bodyAttrs: {
                    'page': 'index'
                }
            }
        }
	}

</script>