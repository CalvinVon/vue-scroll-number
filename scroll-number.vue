<template>
	<div class="scroll-number"
        :style="{ width: itemWidth +'px', height: itemHeight +'px' }">

		<div class="scroll-list"
            ref="list"
            :style="{...listStyle, ...overrideStyle}">
			<ul class="number-list padding-number-list">
				<li v-for="(num, index) in backwardPaddingNumbers"
					:key="'real-' + index">
					<div class="number-item"
                        :style="itemStyle">
						<span>{{ numbers[index] + numbers.length - backwardPaddingNumbers.length }}</span>
					</div>
				</li>
			</ul>

			<ul class="number-list"
				ref="realList">
				<li v-for="(num, index) in numbers"
					:key="'real-' + index">
					<div class="number-item"
                        :style="itemStyle">
						<span>{{num}}</span>
					</div>
				</li>
			</ul>

			<ul class="number-list padding-number-list">
				<li v-for="(num, index) in forwardPaddingNumbers"
					:key="'real-' + index">
					<div class="number-item"
                        :style="itemStyle">
						<span>{{num}}</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
const DIRECTIONS = {
	'FORWARD': 'FORWARD',
	'BACKWARD': 'BACKWARD',
};
const transitionTime = 800;
const nextFrame = cb => requestAnimationFrame(cb);
const nextTransition = cb => setTimeout(cb, transitionTime);

export default {
	name: "scroll-number",
	props: {
		value: [Number, String],
		direction: {
			type: String,
			validator(value) {
				return !!DIRECTIONS[value];
			}
		},
		itemStyle: Object
	},
	data() {
		return {
			numbers: [...new Array(10).keys()],
			forwardPaddingNumbers: [],
			backwardPaddingNumbers: [],
			formerValue: this.value,
			itemSize: {},

			currentIndex: -1,
			overrideStyle: {},

			process: Promise.resolve()
		};
	},
	computed: {
		itemWidth() {
			return this.itemSize.width;
		},
		itemHeight() {
			return this.itemSize.height;
		},
		listStyle() {
			const {
				backwardPaddingNumbers,
				currentIndex,
				itemHeight
			} = this;
			return {
				top: -1 * backwardPaddingNumbers.length * itemHeight + 'px',
				transform: `translate3d(0, ${-1 * currentIndex * itemHeight}px, 0)`
			};
		},
	},
	watch: {
		value: {
			immediate: true,
			handler(newValue, oldValue) {
				if (newValue !== undefined && oldValue !== undefined) {
                    const handler = {
                        [DIRECTIONS.FORWARD]: () => this.forwardTo(newValue),
                        [DIRECTIONS.BACKWARD]: () => this.backwardTo(newValue),
                    }[this.direction];
                    nextFrame(() => {
                        handler();
                    });
				}
			}
		},
		itemStyle() {
			this.$nextTick(() => {
				this.calcItemSize();
			});
		}
	},
	created() {
		this.currentIndex = this.numbers.indexOf(+this.value) || -1;
	},
	mounted() {
		this.calcItemSize();
	},
	methods: {
		calcItemSize() {
			this.itemSize = this.$refs.realList.querySelector('span').getBoundingClientRect();
		},
		moveWithoutAnimation(cb) {
			this.overrideStyle = {
				transition: 'none'
			};
			cb();
			nextFrame(() => {
				this.overrideStyle = {};
			});
		},
		forwardTo(newValue) {
			const p = () => new Promise(resolve => {
				const oldValue = this.formerValue;
				const finish = () => {
					nextTransition(() => {
						resolve(newValue);
					});
				};
				let diff = newValue - oldValue;

				// 判断是否需要填充
				if (diff < 0) {
					diff += 10;
					this.forwardPaddingNumbers = [...new Array(newValue + 1).keys()];
					this.currentIndex += diff;
					nextTransition(() => {
						this.moveWithoutAnimation(() => {
							this.currentIndex = this.currentIndex % this.numbers.length;
							finish();
							this.formerValue = newValue;
						});
					});
				} else {
					this.currentIndex += newValue - oldValue;
					finish();
					this.formerValue = newValue;
				}
			});
			this.process = this.process.then(p);
			return this.process;
		},
		backwardTo(newValue) {
			const p = () => new Promise(resolve => {
				const oldValue = this.formerValue;
				const finish = () => {
					nextTransition(() => {
						resolve(newValue);
					});
				};
				let diff = newValue - oldValue;

				// 判断是否需要填充
				// 当新数比原来大，往后倒
				if (diff > 0) {
					this.backwardPaddingNumbers = [...new Array(this.numbers.length - newValue).keys()];
					diff = this.backwardPaddingNumbers.length;
					this.currentIndex = -diff;
					nextTransition(() => {
						this.moveWithoutAnimation(() => {
							this.currentIndex = newValue;
							finish();
							this.formerValue = newValue;
						});
					});
				} else {
					this.currentIndex += newValue - oldValue;
					finish();
					this.formerValue = newValue;
				}
			});
			this.process = this.process.then(p);
			return this.process;
		},
	},
};

export {
	DIRECTIONS
}
</script>

<style lang="scss">
$transition-time: 0.8s;

.scroll-number {
	display: inline-block;
	position: relative;
	width: 15px;
	height: 30px;
	overflow: hidden;

	.scroll-list {
		position: absolute;
		width: 100%;
		transition: transform $transition-time ease;

		ul {
			margin: 0;
			padding: 0;
			list-style: none;
			margin-block-start: 0;
			margin-block-end: 0;
			padding-inline-start: 0;
		}

	}
    .number-item {
        text-align: center;
        font-size: 14px;
    }
}
</style>