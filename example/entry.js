import Vue from 'vue';
import demo from './demo';
import ScrollNumber from '../src';
import './custom-variables.scss';

Vue.use(ScrollNumber, {
    transitionTime: 400,
    numberOnly: false
});

new Vue({
    render: h => h(demo)
}).$mount('#app');