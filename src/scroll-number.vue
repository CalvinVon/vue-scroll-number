<template>
    <div class="scroll-number">
        <template v-for="(val, index) in numbers">
            <div class="digit"
                 :style="itemStyle"
                 v-if="!isNumber(val)"
                 :key="'char-' + index">
                <span>{{ val }}</span>
            </div>

            <ScrollNumberItem :key="getIndex(numbers, index)"
                          v-else
                          ref="scrollItem"
                          :value="val"
                          :direction="direction"
                          :transitionTime="transitionTime"
                          :itemStyle="itemStyle" />
        </template>
    </div>
</template>

<script>
import ScrollNumberItem, { DIRECTIONS } from './scroll-number-item';
import { getOptions } from './options';

const isNumber = val => !Number.isNaN(+val);

export default {
    name: "ScrollNumber",
    components: {
        ScrollNumberItem
    },
    props: {
        value: {
            type: [Number, String],
            default: 0,
            validator: isNumber
        },
        transitionTime: {
            type: Number,
            default: () => getOptions().transitionTime
        },
        itemStyle: Object
    },
    data() {
        return {
            innerValue: this.value,
            isNumber,
            direction: DIRECTIONS.FORWARD,

            process: Promise.resolve(),
        };
    },
    computed: {
        numbers() {
            return this.getNumbers(this.innerValue);
        }
    },
    watch: {
        value(newV) {
            this.changeTo(newV);
        },
        innerValue(newV, oldV) {
            if (Math.abs(newV) > Math.abs(oldV)) {
                this.direction = DIRECTIONS.FORWARD;
            }
            else {
                this.direction = DIRECTIONS.BACKWARD;
            }
        }
    },
    mounted() {
        this.changeTo(this.innerValue);
    },
    methods: {
        changeTo(value) {
            if (!isNumber(value)) {
                console.warn('[vue-scroll-number]: You can only change value to a number');
                return Promise.reject();
            }
            this.process = this.process.then(() => {
                return new Promise(resolve => {
                    this.innerValue = value;
                    this.$nextTick(() => {
                        const p = this.getNumbers(value)
                            .filter(isNumber)
                            .map((item, index) => {
                                const scrollItem = this.$refs.scrollItem[index];
                                if (scrollItem) {
                                    return scrollItem.changeTo(item);
                                }
                                else {
                                    return Promise.resolve();
                                }
                            });
                        resolve(Promise.all(p));
                    });
                })
            });
            return this.process;
        },

        getNumbers(value) {
            return String(value).split('').map(it => isNumber(it) ? Number(it) : it);
        },


        // get index
        // except the non-number chars
        getIndex(numbers, index) {
            // let nonNumCount = 0;
            // for (let i = 0; i < index; i++) {
            //     if (!isNumber(numbers[i])) {
            //         nonNumCount++;
            //     }
            // }
            // return index - nonNumCount;
            return Date.now() + Math.random().toString(16);
        }
    },
};

export {
    DIRECTIONS
};
</script>
