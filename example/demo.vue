<template>
	<div class="app">
		<ScrollNumbers ref="scrollNumber"
					:value="value"
					:itemStyle="{ fontSize: '120px' }" />

		<br>
		<button @click="runWithValue">Start with changing value props</button>
		<button @click="runWithApi">Start with change API method</button>
	</div>
</template>

<script>
export default {
	name: "app",
	data() {
		return {
			value: 10
		}
	},
	mounted() {
		// this.runWithValue();
		// this.runWithApi();
	},
	methods: {
		generateValue() {
			return ''+[...new Array((Math.random() * 3 >> 0) + 1).keys()]
				.map(() => Math.random() * 9 >> 0)
				.join('');
		},
		runWithValue() {
			const series = [...new Array(10).keys()].map(this.generateValue);
			console.log(series);
			let index = 0;
			let timer = setInterval(() => {
				const value = series[index++];
				console.log('Run value: ' + value);
				this.value = value;
				if (index === series.length) {
					clearInterval(timer);
					timer = null;
				}
			}, 200);
		},

		runWithApi() {
			const series = [...new Array(10).keys()].map(this.generateValue);
			console.log(series);
			series.forEach((value, index) => {
				const p = this.$refs.scrollNumber.changeTo(value);
				p.then(() => console.log(`Complete to change value ${value} with index ${index}`));
			});
		}
	}
};
</script>

