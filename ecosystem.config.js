module.exports = {
    apps: [
        {
            name: 'next-roulette-app',
            script: 'node_modules/next/dist/bin/next',
            args: 'start',
            instances: 2,
            exec_mode: 'cluster',
        },
    ],
};
