import ScrollNumber, { DIRECTIONS } from './scroll-number';
import ScrollNumberItem from './scroll-number-item';
import { setOptions } from './options';
import './style/index.scss';

ScrollNumber.install = function (Vue, options) {
    setOptions(options);
    Vue.component(ScrollNumber.name, ScrollNumber);
};

ScrollNumber.Item = ScrollNumberItem;
export default ScrollNumber;
export {
    ScrollNumber,
    ScrollNumberItem,
    DIRECTIONS
};
