<template>
	<div class="app">
		<template v-for="(val, index) in numbers">
			<ScrollNumber :key="index"
                        ref="scrollItem"
                        :value="val"
                        :direction="direction"
                        :itemStyle="itemStyle" />
		</template>
	</div>
</template>

<script>
import ScrollNumber, { DIRECTIONS } from './scroll-number';


export default {
	name: "ScrollNumbers",
	components: {
		ScrollNumber
	},
	props: {
		value: {
			type: [Number, String],
			default: 0
		},
		itemStyle: Object
	},
	data() {
		return {
			direction: DIRECTIONS.FORWARD,
		};
	},
	computed: {
		numbers() {
			return String(this.value).split('').map(it => it === '.' ? it : Number(it));
		}
	},
	watch: {
		value(newV, oldV) {
			if (newV > oldV) {
				this.direction = DIRECTIONS.FORWARD;
			}
			else {
				this.direction = DIRECTIONS.BACKWARD;
			}
		}
	}
};

export {
	DIRECTIONS
};
</script>

<style lang="scss">
.scroll-numbers {
}
</style>