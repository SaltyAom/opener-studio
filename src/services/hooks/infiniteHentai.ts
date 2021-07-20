import { useEffect, useReducer, useState, useRef, useCallback } from 'react'

import { useStoreon } from 'storeon/react'
import { SettingEvent, SettingStore } from '@models'

import { tags, randomPick, get, filterTag } from '@services'

import { Stories } from '@types'

const useInfiniteHentai = (initState: Stories) => {
	let {
		useDefaultPreference,
		preference,
		useDefaultFilter,
		filter
	} = useStoreon<SettingStore, SettingEvent>(
		'useDefaultPreference',
		'preference',
		'useDefaultFilter',
		'filter'
	)

	let [galleries, updateGalleries] = useState(initState)

	let [page, updatePage] = useState(2)
	let [shouldFetchMore, fetchMore] = useReducer((state) => state + 1, 0)

	let persistedListener = useRef<() => void>()
	let isLoading = useRef(false)
	let loadedTag = useRef<string[]>([])
	let isInitial = useRef(true)
	let previousFetch = useRef<AbortController>()

	const useTag =
		useDefaultPreference || !preference.length ? tags : preference

	let lazyListener = useCallback(
		(tag = '') => {
			if (isLoading.current) return

			if (
				document.body.scrollHeight - window.innerHeight * 3.5 >=
				window.pageYOffset
			)
				return

			fetchMore()

			loadedTag.current = [...loadedTag.current, tag]

			if (loadedTag.current.length < useTag.length) return

			// ? Load tag from next page
			loadedTag.current = []
			updatePage(page + 1)
		},
		[page, useTag]
	)

	let fetchStories = useCallback(
		(randomTag: string[]) => {
			isLoading.current = true

			let controller = new AbortController()
			let { signal } = controller

			if (previousFetch.current) previousFetch.current.abort()

			previousFetch.current = controller

			get<Stories>(`https://nhapi.opener.studio/search/${randomTag}/${page}`, {
				signal
			})
				.then(newGalleries => {
					let filteredGalleries = useDefaultFilter
						? newGalleries
						: filterTag(newGalleries, filter)

					updateGalleries([...galleries, ...filteredGalleries])
				})
				.finally(() => {
					isLoading.current = false
				})

			return () => previousFetch.current?.abort()
		},
		[galleries, filter, useDefaultFilter]
	)

	useEffect(() => {
		let randomTag = randomPick(
			useTag.filter((tag) => !loadedTag.current.includes(tag))
		)

		if (!isLoading.current)
			if (isInitial.current) isInitial.current = false
			else fetchStories(randomTag)

		let stopListener = () =>
			window.removeEventListener('scroll', persistedListener.current as any)
		let listener = () => lazyListener(randomTag)

		if (persistedListener.current) stopListener()

		persistedListener.current = listener

		window.addEventListener('scroll', listener, {
			passive: true
		})

		return () => stopListener()
	}, [shouldFetchMore, useTag])

	return [galleries]
}

export default useInfiniteHentai
