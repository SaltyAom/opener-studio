import { memo, useEffect, useReducer, useRef } from 'react'

import Image from 'next/image'

import { useStoreon } from 'storeon/react'
import { SettingEvent, SettingStore } from '@stores'

import { useSimulateHeight } from '@libs/hooks'

import { PageComponent, PageProps } from './types'

import './page.styl'

const shouldReRender = (prevProps: PageProps, nextProps: PageProps) =>
	prevProps?.page?.link === nextProps?.page?.link

const Page: PageComponent = memo(
	({ page, alt = '', preload = false, children = null }) => {
		let { safeMode, fullCensor } = useStoreon<SettingStore, SettingEvent>(
			'safeMode',
			'fullCensor'
		)

		let [shouldLoad, load] = useReducer(() => true, false)

		let [
			simulatedImageHeight,
			{ element, stopSimulateImageHeight }
		] = useSimulateHeight({
			page: preload ? undefined : page,
			preload,
			shouldLoad
		})

		let persistObserver = useRef<IntersectionObserver>()

		useEffect(() => {
			if (shouldLoad) return persistObserver.current.disconnect()

			let options = {
					root: null,
					rootMargin: `${
						(window.innerHeight +
							// ? footer
							255) /
						3.5
					}px`,
					threshold: 0
				},
				callback = (result) => {
					let [{ isIntersecting }] = result

					if (isIntersecting) load()
				}

			let observer = new IntersectionObserver(callback, options)
			observer.observe(element.current)

			persistObserver.current = observer
		}, [shouldLoad])

		if (preload)
			return (
				<div className="page">
					{children}
					<img
						className={`paper -lazy -preload`}
						ref={element}
						alt={alt}
					/>
				</div>
			)

		let { link } = page

		return (
			<div className="page">
				{children}
				<img
					className={`paper ${safeMode ? '-blur' : ''} ${
						!shouldLoad ? '-lazy' : ''
					} ${fullCensor ? '-full-censor' : ''}`}
					ref={element}
					src={shouldLoad ? link : ''}
					alt={alt}
					loading="lazy"
					style={{ height: simulatedImageHeight }}
					onLoad={stopSimulateImageHeight}
				/>
			</div>
		)
	},
	shouldReRender
)

export default Page
