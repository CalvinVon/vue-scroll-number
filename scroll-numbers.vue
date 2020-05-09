<template>
	<div class="scroll-numbers">
		<template v-for="(val, index) in numbers">
			<div class="digit"
                :style="itemStyle"
                v-if="isExceptChar(val)"
                :key="'char-' + index">
				<span>{{ val }}</span>
            </div>

            <ScrollNumber :key="index"
                v-else
                ref="scrollItem"
                :value="val"
                :direction="direction"
                :itemStyle="itemStyle" />
		</template>
	</div>
</template>

<script>
import ScrollNumber, { DIRECTIONS } from './scroll-number';
const exceptChars = ['.','-'];
const isExceptChar = val => exceptChars.indexOf(val) !== -1;

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
            isExceptChar,
            direction: DIRECTIONS.FORWARD,
		};
	},
	computed: {
		numbers() {
			return String(this.value).split('').map(it => isExceptChar(it) ? it : Number(it));
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
    },
};

export {
	DIRECTIONS
};
</script>

<style lang="scss">
.scroll-numbers {
    display: inline-block;
    font-size: 0;
    .digit {
        display: inline-block;
        vertical-align: text-bottom;
        font-size: 14px;
        text-align: center;
    }
}
</style>