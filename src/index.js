import ScrollNumbers, { DIRECTIONS } from './scroll-numbers';
import ScrollNumber from './scroll-number';
import { setOptions } from './options';

ScrollNumbers.install = function (Vue, options) {
    setOptions(options);
    Vue.component(ScrollNumbers.name, ScrollNumbers);
};

export default ScrollNumbers;
export {
    ScrollNumber,
    DIRECTIONS
};
