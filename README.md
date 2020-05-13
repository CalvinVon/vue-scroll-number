# vue-scroll-number
一个带有动画顺序控制的数字上下滚动 Vue 2.x 组件

[![version](https://img.shields.io/npm/v/vue-scroll-number.svg)](https://www.npmjs.com/package/vue-scroll-number)
[![](https://img.shields.io/npm/dt/vue-scroll-number.svg)](https://github.com/CalvinVon/vue-scroll-number)
[![](https://img.shields.io/github/size/CalvinVon/vue-scroll-number/dist/vue-scroll-number.min.js.svg?label=minified%20size)](https://github.com/CalvinVon/vue-scroll-number/blob/master/dist/vue-scroll-number.min.js)
[![dependencies](https://img.shields.io/david/CalvinVon/vue-scroll-number.svg)](https://www.npmjs.com/package/vue-scroll-number)

中文文档 | [English](README_en.md)

## Demos
- [效果预览](https://rg41j.csb.app/)
- [工程化用法](https://codesandbox.io/s/vue-scroll-number-rg41j)
- [CDN用法](https://jsbin.com/jupovediwu/1/edit?js,output)

# Table of contents
- [开始](#开始)
    - [安装](#安装)
- [用法](#用法)
    - [基本用法](#基本用法)
    - [全局配置](#全局配置)
    - [定制样式](#定制样式)
    - [动画顺序控制](#动画顺序控制)
- [ScrollNumber 组件](#ScrollNumber-组件)
    - [prop: `value`](#prop-value)
    - [prop: `itemStyle`](#prop-itemStyle)
    - [prop: `transitionTime`](#prop-transitionTime)
    - [method: `changeTo`](#method-changeTo)
    - [event: `change`](#event-change)
- [ScrollNumberItem 组件](#ScrollNumberItem-组件)
    - [prop: `itemStyle`](#prop-itemStyle)
    - [prop: `transitionTime`](#prop-transitionTime)
    - [method: `changeTo`](#method-changeTo)
    - [method: `forwardTo`](#method-forwardTo)
    - [method: `backwardTo`](#method-backwardTo)

# 开始
### 安装
你可以通过 `npm` 来安装。
```bash
npm i vue-scroll-number -S
```
或者通过 `yarn` 安装：
```bash
yarn add vue-scroll-number
```

还可以直接使用 `CDN` 方式引入
> 先决条件：该方式必须先要引入完整 `Vue`，或者在 `window` 对象上暴露出 `Vue` 构造函数。
```html
<!-- 首先要引入 Vue -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js"></script>

<!-- 引入样式 -->
<link ref="stylesheet" href="https://cdn.jsdelivr.net/npm/vue-scroll-number/dist/vue-scroll-number.css">
<!-- 引入 vue-scroll-number -->
<script src="https://cdn.jsdelivr.net/npm/vue-scroll-number/dist/vue-scroll-number.min.js"></script>
<script>
    var Vue = window['Vue'];
    var VueScrollNumber = window['VueScrollNumber'].default;

    Vue.use(VueScrollNumber);
</script>
```


# 用法
### 基本用法

全局引入或者使用组件引入，在入口文件处：
```js
import Vue from 'vue';
import ScrollNumber from "vue-scroll-number";

Vue.use(ScrollNumber);
```

组件内使用：
```html
<template>
    <ScrollNumber :value="number" ref="scrollNumber" />
</template>

<script>
export default {
    data() {
        return {
            number: 12138
        }
    },
    methods: {
        changeValue() {
            this.value = 888;
        },
        changeValueByRef() {
            this.$refs.scrollNumber.changeTo(666);
        }
    }
}
</script>
```
### 全局配置
可全局配置 **ScrollNumber** 组件的行为
```js
Vue.use(ScrollNumber, {
    // 动画渐变时间
    transitionTime: 800,
    // 是否只允许使用数字类型（v1.1.0新增）
    numberOnly: false
});
```


### 定制样式
**vue-scroll-number** 使用 SCSS 编写，如果你的项目也使用了 SCSS，那么可以直接在项目中改变内置的样式变量。新建一个如 `custom-variables.scss` 的文件：
```scss
$font-size: 24px;
$transition-time: 0.4s;
$transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);

@import '~vue-scroll-number/src/style/variables.scss';
@import '~vue-scroll-number/src/style/index.scss';
```

在入口文件引入。`transitionTime` 动画渐变时间需要单独（全局或者[组件传入](#prop-transitionTime)）设置：
```js
import ScrollNumber from 'vue-scroll-number';
import './custom-variables.scss';

Vue.use(ScrollNumber, { transitionTime: 400 });
```

### 动画顺序控制
**vue-scroll-number** 将自动缓冲每一次变化指令，并用流畅的动画**按先后顺序**表现出来。

在代码中，每一次改变状态（或者调用方法）都将返回一个 `Promise` 对象，并保存在组件的 `process` 属性值上。当返回的 `Promise` 对象转变成 `fulfilled` 状态时，当前的动画已经结束。

> 尝试下面的代码，无论调用多少次 `runWithValue` 或者 `runWithApi` 方法，动画仍会桉顺序展现。
```js
const scrollNumber = this.$refs.scrollNumber;
...
// generate random number
function generateValue() {
    const random = val => Math.random() > 0.5 ? val : '';
    const num = () => +[...new Array((Math.random() * 5 >> 0) + 1).keys()]
        .map(() => Math.random() * 9 >> 0)
        .join('');
    return +random('-') + num() + random('.' + num());
}

function runWithValue() {
    const series = [...new Array(5).keys()].map(generateValue);
    console.log(series);
    let index = 0;
    const run = () => {
        const value = series[index++];
        console.log('Run value: ' + value);
        this.value = value;
        if (index !== series.length) {
            scrollNumber.process
                .then(run);
        }
    };
    run();
}

function runWithApi() {
    const series = [...new Array(5).keys()].map(generateValue);
    console.log(series);
    series.forEach((value, index) => {
        scrollNumber
            .changeTo(value)
            .then(() => console.log(`Complete to change value ${value} with index ${index}`));
    });
}
```

####
---

# **ScrollNumber** 组件
## prop: **`value`**
- **类型:** { string | number }
- **默认值:** `0`
- **说明:** `value` 为受控属性，组件会根据 `value` 值变化自动触发动画。每次动画进程的 `Promise` 实例将会更新在组件的 `process` 属性上
    
- **用例:**
    ```html
    <template>
        <ScrollNumber :value="value" ref="scrollNumber">
    </template>
    <script>
        ...
        this.value = 123;
        this.$refs.scrollNumber.process.then(val => {
            console.log('Animation complete with value: ' + val);
        });
    </script>
    ```
> 一般不与 `changeTo` 方法配合使用，请查阅 [method: **changeTo**](#method-changeTo)


## prop: **`itemStyle`**
- **类型:** { object }
- **默认值:** `缺省`
- **说明:** 自定义每一个滚动数字项的样式


## prop: **`transitionTime`**
- **类型:** { number }
- **默认值:** `800`
- **说明:** 定义动画的渐变时长，可覆盖全局配置。一般只在自定义动画时使用，查阅[定制样式](#定制样式)


## method: **`changeTo`**
- **参数:** { string | number }
- **返回值:** `Promise<string|number>`
- **说明:** 直接在组件上调用，触发内部状态变更和动画，返回动画进程的 `Promise` 实例

> **注意**：一般不建议和 `value` 属性配合使用，因为 `changeTo` 手动触发状态变更而不会更新 `value` 参数，而导致内外状态不一致；若捕捉组件 `change` 的事件来变更 `value` 值，则在特定情况下（在一个动画周期内调用多次）将会导致无限的状态变更和动画循环。
    
- **用例:**
    ```html
    <template>
        <ScrollNumber ref="scrollNumber">
    </template>
    <script>
        ...
        this.$refs.scrollNumber.process.then(val => {
            console.log('Animation complete with value: ' + val);
        });
    </script>
    ```

## event: **`change`**
- **参数:** { string | number }
- **说明:** 当内部状态变更后且动画已结束，并在 `process` 的状态 `fulfilled` 前，发出 `change` 事件
---

# **ScrollNumberItem** 组件
ScrollNumberItem 组件是 ScrollNumber 组件的最小组成单位，负责单个数位上的动画，也可单独使用，但往往需要更多的计算和手动控制。

`vue-scroll-number` 包中也导出了该组件。
```js
import Vue from 'vue';
import { ScrollNumber, ScrollNumberItem, DIRECTIONS } from 'vue-scroll-number';

Vue.component(ScrollNumberItem.name, ScrollNumberItem);
// Vue.component(ScrollNumber.Item.name, ScrollNumber.Item);
```

## prop: **`direction`**
- **类型:** { 'FORWARD' | 'BACKWARD' }
- **默认值:** `缺省`
- **说明:** 给定数值变化时动画的方向


## prop: **`itemStyle`**
- **类型:** { object }
- **默认值:** `缺省`
- **说明:** 自定义滚动数字项的样式


## prop: **`transitionTime`**
- **类型:** { number }
- **默认值:** `800`
- **说明:** 定义动画的渐变时长，可覆盖全局配置。一般只在自定义动画时使用，查阅[定制样式](#定制样式)


## method: **`changeTo`**
- **参数:** { string | number }
- **返回值:** `Promise<string|number>`
- **说明:** 直接在组件上调用，触发内部状态变更和动画，返回动画进程的 `Promise` 实例。动画的方向和传入的 `direction` 参数相关


## method: **`forwardTo`**
- **参数:** { string | number }
- **返回值:** `Promise<string|number>`
- **说明:** 直接在组件上调用，触发内部状态变更和动画，返回动画进程的 `Promise` 实例。动画将往上变动至给定值

## method: **`backwardTo`**
- **参数:** { string | number }
- **返回值:** `Promise<string|number>`
- **说明:** 直接在组件上调用，触发内部状态变更和动画，返回动画进程的 `Promise` 实例。动画将往下变动至给定值
