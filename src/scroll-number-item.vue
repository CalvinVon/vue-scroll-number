<template>
    <div class="scroll-number-item"
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
/**
 * ScrollNumberItem
 * @prop {'FORWARD'|'BACKWARD'} direction animation direction
 * @prop {number} transitionTime animation transition time
 * @prop {object} itemStyle css style of each number item
 * 
 * @member {Promise<number>} process a promise instance of animation process
 * @method changeTo(value):Promise trigger to change the value
 * @method forwardTo(value):Promise trigger to change the value forward
 * @method backwardTo(value):Promise trigger to change the value backward
 */
import { getOptions } from './options';
const DIRECTIONS = {
    'FORWARD': 'FORWARD',
    'BACKWARD': 'BACKWARD',
};

export default {
    name: "scroll-number-item",
    props: {
        direction: {
            type: String,
            validator(value) {
                return !!DIRECTIONS[value];
            }
        },
        transitionTime: {
            type: Number,
            default: () => getOptions().transitionTime
        },
        itemStyle: Object
    },
    data() {
        return {
            numbers: [...new Array(10).keys()],
            forwardPaddingNumbers: [],
            backwardPaddingNumbers: [],
            itemSize: {},

            value: 0,
            currentIndex: 0,
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
        itemStyle() {
            this.$nextTick(() => {
                this.calcItemSize();
            });
        }
    },
    created() {
        this.currentIndex = this.numbers.indexOf(+this.value);
    },
    mounted() {
        this.calcItemSize();
    },
    methods: {
        changeTo(value) {
            const handler = {
                [DIRECTIONS.FORWARD]: () => this.forwardTo(value),
                [DIRECTIONS.BACKWARD]: () => this.backwardTo(value),
            }[this.direction];
            return handler();
        },
        forwardTo(newValue) {
            const p = () => new Promise(resolve => {
                const oldValue = this.value;
                const finish = () => {
                    this.nextTransition(() => {
                        resolve(newValue);
                    });
                };
                let diff = newValue - oldValue;

                // 判断是否需要填充
                if (diff < 0) {
                    diff += 10;
                    this.forwardPaddingNumbers = [...new Array(newValue + 1).keys()];
                    this.currentIndex += diff;
                    this.nextTransition(() => {
                        this.moveWithoutAnimation(() => {
                            this.currentIndex = this.currentIndex % this.numbers.length;
                            finish();
                            this.value = newValue;
                        });
                    });
                } else {
                    this.currentIndex += newValue - oldValue;
                    finish();
                    this.value = newValue;
                }
            });
            this.process = this.process.then(p);
            return this.process;
        },
        backwardTo(newValue) {
            const p = () => new Promise(resolve => {
                const oldValue = this.value;
                const finish = () => {
                    this.nextTransition(() => {
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
                    this.nextTransition(() => {
                        this.moveWithoutAnimation(() => {
                            this.currentIndex = newValue;
                            finish();
                            this.value = newValue;
                        });
                    });
                } else {
                    this.currentIndex += newValue - oldValue;
                    finish();
                    this.value = newValue;
                }
            });
            this.process = this.process.then(p);
            return this.process;
        },

        nextFrame(cb) {
            this.$nextTick(() => {
                setTimeout(cb, 1000 / 60);
            });
        },
        nextTransition(cb) {
            this.nextFrame(() => {
                setTimeout(cb, this.transitionTime);
            });
        },
        calcItemSize() {
            this.itemSize = this.$refs.realList.querySelector('span').getBoundingClientRect();
        },
        moveWithoutAnimation(cb) {
            this.overrideStyle = {
                transition: 'none'
            };
            cb();
            this.nextFrame(() => {
                this.overrideStyle = {};
            });
        },
    },
};

export {
    DIRECTIONS
}
</script>
