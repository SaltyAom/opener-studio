import { Fragment } from 'react'

import FloatingActionButton from '@components/fab'

import SettingsLayout, { MenuDetail, MenuLayout, ExternalLink } from '@layouts/settings'

const About = () => {
	return (
		<Fragment>
			<FloatingActionButton />
			<SettingsLayout title="About Opener">
				<MenuLayout title="Not For Profit">
					<MenuDetail>
						Opener Studio is Not-For-Profit software platform,
						Free-To-Use, and not in or from any organization.
					</MenuDetail>
					<MenuDetail>
						A free platform for investigating / reading Japanese
						Doujinshi with performance and user experience focus in
						mind powered by nhentai.
					</MenuDetail>
					<MenuDetail>
						Opener is completly and ALWAYS FREE-TO-USE platform. We
						never contact you for your payment from usage of Opener
						or your personal information.
					</MenuDetail>
					<MenuDetail>
						You can support Opener by continue to using the platform
						or if you really want, you can{' '}
						<ExternalLink href="https://ko-fi.com/saltyaom">
							buy me some Ko-fi
						</ExternalLink>
						.
					</MenuDetail>
				</MenuLayout>
				<MenuLayout title="Privacy" id="privacy">
					<MenuDetail>
						We use{' '}
						<ExternalLink href="https://marketingplatform.google.com/about/analytics/terms/us/">
							Google Analytic
						</ExternalLink>{' '}
						to collect your data anonymously for Search Engine
						Optimization and Data Analytic purpose only.
					</MenuDetail>
					<MenuDetail>
						We do not share or sell your data for your privacy
						because we know we should keep this as a secret. :)
					</MenuDetail>
				</MenuLayout>
				<MenuLayout title="Terms and Services" id="terms">
					<MenuDetail>
						We are not responsible for any illegal act which is done
						or caused within any place or location while using
						Opener.
					</MenuDetail>
				</MenuLayout>
				<MenuLayout title="API" id="api">
					<MenuDetail>
						Opener Studio built on top and rely on nhentai API. We
						developed reverse proxy server for caching data and
						transforming data to reduce nhentai API usage.
					</MenuDetail>
					<MenuDetail>
						We're planning to collect the data from nhentai API
						server in the future to help reduce the server load from
						our client.
					</MenuDetail>
				</MenuLayout>
				<MenuLayout title="Ownership">
					<MenuDetail>
						Opener Studio is closed-source software rightfully owned
						and developed by{' '}
						<ExternalLink href="https://github.com/saltyAom">
							SaltyAom
						</ExternalLink>{' '}
						as side project in free time.
					</MenuDetail>
					<MenuDetail>
						At first for personal usage but later on welcome
						everyone to use.
					</MenuDetail>
					<MenuDetail>&copy; SaltyAom 2020.</MenuDetail>
				</MenuLayout>
			</SettingsLayout>
		</Fragment>
	)
}

export default About
