/* eslint-disable @typescript-eslint/no-var-requires */
const withOffline = require('next-offline')
const withSass = require('@zeit/next-sass')

const composePlugins = require('next-compose-plugins')

const { join } = require('path')

// const withStyles = require('./tools/withStyles')
// const { useEsbuildLoader } = require('./tools/useEsbuild')

module.exports = composePlugins(
	[
		[withSass],
		[
			withOffline,
			{
				workboxOpts: {
					swDest: 'static/service-worker.js',
					runtimeCaching: [
						{
							urlPattern: /^https?.*/,
							handler: 'NetworkFirst',
							options: {
								cacheName: 'https-calls',
								networkTimeoutSeconds: 15,
								expiration: {
									maxEntries: 150,
									maxAgeSeconds: 6 * 60 * 60 // 6 hours
								},
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

		webpack(config, { dev }) {
			// useEsbuildLoader(config)

			config.resolve.alias = {
				...config.resolve.alias,
				'react': 'preact/compat',
				'react-dom': 'preact/compat',
				'@pages': join(__dirname, 'src/pages'),
				'@components': join(__dirname, 'src/components'),
				'@icons': join(__dirname, 'src/icons'),
				'@services': join(__dirname, 'src/services'),
				'@models': join(__dirname, 'src/models'),
				'@layouts': join(__dirname, 'src/layouts'),
				'@providers': join(__dirname, 'src/providers'),
				'@styles': join(__dirname, 'src/styles')
			}

			return config
		}
	}
)
