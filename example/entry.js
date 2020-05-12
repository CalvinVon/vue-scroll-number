import Vue from 'vue';
import demo from './demo';
import ScrollNumbers from '../src';
import './custom-variables.scss';

Vue.use(ScrollNumbers, { transitionTime: 1000 });

new Vue({
    render: h => h(demo)
}).$mount('#app');