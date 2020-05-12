module.exports = {
    env: {
        "cjs": {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        useBuiltIns: false,
                        modules: "commonjs",
                        corejs: 3
                    }
                ]
            ]
        },
        "umd": {
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
        }
    },
    plugins: [
        // "@babel/plugin-transform-runtime",
    ]
};