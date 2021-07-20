// /* eslint-disable no-param-reassign */
// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable no-unused-vars */
// const oneClassName = require('1-classname')

// module.exports = (nextConfig = {}) => ({
//     ...nextConfig,
//     webpack(config, options) {
//         const oneOf = config.module.rules.find(
//             (rule) => typeof rule.oneOf === 'object'
//         )

//         const fixUse = (use) => {
//             if (use.loader.indexOf('css-loader') >= 0 && use.options.modules)
//                 use.options = {
//                     ...use.options,
//                     modules: {
//                         ...use.options.modules,
//                         mode: 'local',
//                         localIdentName: '[path][name]__[local]',
//                         getLocalIdent: ({ resourcePath }, _, className) =>
//                             process.env.NODE_ENV === 'production'
//                                 ? oneClassName(resourcePath + className)
//                                 : `${className}_${oneClassName(resourcePath)}`
//                     }
//                 }
//         }

//         if (oneOf)
//             oneOf.oneOf.forEach((rule) => {
//                 if (Array.isArray(rule.use)) rule.use.map(fixUse)
//                 else if (rule.use && rule.use.loader) fixUse(rule.use)
//             })

//         return config
//     }
// })