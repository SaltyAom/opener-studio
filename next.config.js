/* eslint-disable @typescript-eslint/no-var-requires */
const withOffline = require('next-offline')

const composePlugins = require('next-compose-plugins')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const { join } = require('path')

module.exports = composePlugins(
	[
		[
			withOffline,
			{
				workboxOpts: {
					swDest: 'static/service-worker.js',
					runtimeCaching: [
						{
							urlPattern: /.js$|.css$|.svg$|.jpg$|.png$|.otf$/,
							handler: 'CacheFirst'
						},
						{
							urlPattern: /nhapi.opener.studio\/\*/,
							handler: 'NetworkFirst',
							options: {
								cacheableResponse: {
									statuses: [0, 200]
								}
							}
						}
					]
				}
			}
		]
	],
	{
		async rewrites() {
			return [
				{
					source: '/service-worker.js',
					destination: '/_next/static/service-worker.js'
				}
			]
		},
		experimental: {
			modern: true,
			polyfillsOptimization: true
		},
		images: {
			domains: ['i.nhentai.net', 't.nhentai.net'],
			deviceSizes: [640, 750, 828, 1080],
			imageSizes: [16, 32, 48, 64, 96],
			path: '/_next/image',
			loader: 'default'
		},
		target: 'serverless',

		async rewrites() {
			return [
				{
					source: '/service-worker.js',
					destination: '/_next/static/service-worker.js'
				}
			]
		},

		webpack(config, { dev, isServer }) {
			config.resolve.alias = {
				...config.resolve.alias,
				'@pages': join(__dirname, 'src/pages'),
				'@components': join(__dirname, 'src/components'),
				'@icons': join(__dirname, 'src/icons'),
				'@services': join(__dirname, 'src/services'),
				'@models': join(__dirname, 'src/models'),
				'@layouts': join(__dirname, 'src/layouts'),
				'@providers': join(__dirname, 'src/providers'),
				'@styles': join(__dirname, 'src/styles'),
			}

			if (!dev)
				config.optimization = {
					...config.optimization,
					usedExports: true,
					minimizer: [
						...config.optimization.minimizer,
						new OptimizeCSSAssetsPlugin()
					]
				}

			return config
		}
	}
)
