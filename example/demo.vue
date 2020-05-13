<template>
	<div class="app">
		<h1>vue-scroll-number</h1>
		<ScrollNumber ref="scrollNumber"
					  @change="handleChange"
					  :value="value"
					  numberOnly />

		<h3>Open console panel to see what happened</h3>
		<br>
		<button @click="runWithValue">Start with changing value props</button>
		<br>
		<br>
		<button @click="runWithApi">Start with change API method</button>
	</div>
</template>

<script>
export default {
	name: "app",
	data() {
		return {
			value: '10:42'
		}
	},
	methods: {
		generateValue() {
			const random = val => Math.random() > 0.5 ? val : '';
			const num = () => +[...new Array((Math.random() * 5 >> 0) + 1).keys()]
				.map(() => Math.random() * 9 >> 0)
				.join('');
			return random('-') + num() + random('.' + num());
		},
		runWithValue() {
			const series = [...new Array(5).keys()].map(this.generateValue);
			console.log(series);
			let index = 0;
			const run = () => {
				const value = series[index++];
				this.value = value;
				if (index !== series.length) {
                    this.$refs.scrollNumber.process.then(val => {
                        console.log(`Complete to change value ${val} with index ${index}`)
                        run();
					})
				}
			};
			run();
		},

		runWithApi() {
			const series = [...new Array(5).keys()].map(this.generateValue);
			console.log(series);
			series.forEach((value, index) => {
				const p = this.$refs.scrollNumber.changeTo(value);
				p.then(val => console.log(`Complete to change value ${val} with index ${index}`));
			});
        },
        
        handleChange(value) {
            console.log('Event: change, value: ' + value);
            // WARNING: may cause infinity state change and animation
            // this.value = value;
        }
	}
};
</script>

