const options = {
    transitionTime: 800,
    numberOnly: false
};

function setOptions(opts) {
    Object.assign(options, (opts || {}));
}

function getOptions() {
    return options;
}

export default options;
export {
    setOptions,
    getOptions
};
