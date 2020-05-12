module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: false,
                modules: "umd",
                corejs: 3
            }
        ]
    ]
};