import { Fragment, MouseEvent } from 'react'

import { OpenGraph } from '@components'

import { useRouter } from 'next/router'

import { ChevronLeft } from '@icons'

import { SettingsLayoutComponent } from './types'

import './settings-layout.sass'

const SettingsLayout: SettingsLayoutComponent = ({
	children,
	title = 'Settings'
}) => {
	let { back } = useRouter()

	const backToPreviousPage = (
		event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
	) => {
		event.preventDefault()
		back()
	}

	return (
		<Fragment>
			<OpenGraph title={title} description={`Opener Studio ${title}`} />
			<main id="settings">
				<a
					className="back"
					href="/"
					onClick={backToPreviousPage}
					aria-label="Back to previous page"
				>
					<ChevronLeft /> Back
				</a>
				<h1 className="title">{title}</h1>
				<section className="menu">{children}</section>
			</main>
		</Fragment>
	)
}

export {
	default as MenuLayout,
	ExternalLink,
	MenuLink,
	MenuToggle,
	MenuDetail,
	MenuContainer,
	MenuButton
} from './menuLayout'
export default SettingsLayout
