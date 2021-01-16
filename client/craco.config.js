const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#6E7ED3',
                            '@link-color': '#6E7ED3',
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};