<template>
	<div class="app">
		<ScrollNumbers :value="-29.5" />
	</div>
</template>

<script>
import ScrollNumbers from './scroll-numbers';

export default {
	name: "app",
	components: {
		ScrollNumbers
	},
};
</script>

