import { useEffect, useReducer, useState, useRef, useCallback, EventHandler } from 'react'

import { useStoreon } from 'storeon/react'
import { SearchEvent, SearchStore, SettingEvent, SettingStore } from '@models'
import { Search } from '@models/constant'

import { randomPick, get, filterTag } from '@services'

import { Stories } from '@types'

interface useSearchHentaiArgument {
	tags: string[]
	resetDeterminer: string | number
	searchKey: string
}

const useSearchHentai = ({
	tags,
	resetDeterminer,
	searchKey
}: useSearchHentaiArgument) => {
	let { dispatch, isError } = useStoreon<SearchStore, SearchEvent>('isError')

	let { filter, useDefaultFilter } = useStoreon<SettingStore, SettingEvent>(
		'useDefaultFilter',
		'filter'
	)

	let [galleries, updateGalleries] = useState<Stories>([])
	let [shouldReset, reset] = useReducer((count) => count + 1, 0)

	let [page, updatePage] = useState(1)
	let [shouldFetchMore, fetchMore] = useReducer((state) => state + 1, 0)

	let persistedListener = useRef<() => void>()
	let isLoading = useRef(false)
	let loadedTag = useRef<string[]>([])
	let previousFetch = useRef<AbortController>()

	// ? Initial isn't require because nothing has loaded.
	let lazyListener = useCallback(
		(tag = '') => {
			if (isLoading.current) return

			if (
				document.body.scrollHeight - window.innerHeight * 3.5 >=
				window.pageYOffset
			)
				return

			fetchMore()
			updatePage(page + 1)

			loadedTag.current = [...loadedTag.current, tag]

			if (loadedTag.current.length < tags.length) return

			// ? Load tag from next page
			loadedTag.current = []
			updatePage(page + 1)
		},
		[page, tags]
	)

	let fetchStories = useCallback(
		(randomTag: string[]) => {
			isLoading.current = true
			dispatch(Search.LOADING, true)

			let controller = new AbortController()
			let { signal } = controller

			if (previousFetch.current) previousFetch.current.abort()

			previousFetch.current = controller

			get<Stories>(`https://nhapi.opener.studio/search/${randomTag}/${page}`, {
				signal
			})
				.then((newGalleries) => {
					let filteredGalleries = useDefaultFilter
						? newGalleries
						: filterTag(newGalleries, filter)

					if (newGalleries.length)
						return updateGalleries([
							...galleries,
							...filteredGalleries
						])
				})
				.catch(() => {
					dispatch(Search.ERROR, true)
				})
				.finally(() => {
					isLoading.current = false
					dispatch(Search.LOADING, false)
				})

			return () => previousFetch.current?.abort()
		},
		[galleries, filter, useDefaultFilter]
	)

	useEffect(() => {
		let randomTag = randomPick(
			tags.filter((tag) => !loadedTag.current.includes(tag))
		)

		if (!isLoading.current) fetchStories(randomTag)

		let stopListener = () =>
			window.removeEventListener('scroll', persistedListener.current as any)
		let listener = () => lazyListener(randomTag)

		if (persistedListener.current) stopListener()

		persistedListener.current = listener

		window.addEventListener('scroll', listener, {
			passive: true
		})

		return () => stopListener()
	}, [shouldFetchMore, resetDeterminer, shouldReset])

	useEffect(() => {
		updatePage(1)
		updateGalleries([])
		dispatch(Search.ERROR, false)
	}, [resetDeterminer])

	useEffect(() => {
		if (isError) {
			reset()
			dispatch(Search.ERROR, false)
		}
	}, [searchKey, galleries])

	return [galleries]
}

export default useSearchHentai
