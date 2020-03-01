module.exports = {
    plugins: [["@babel/plugin-proposal-class-properties", {"loose": true}]],
    presets: [
        ["@babel/preset-env", {"exclude": ["@babel/plugin-transform-classes"]}],
        '@vue/cli-plugin-babel/preset'
    ]
};
