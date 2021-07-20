import { Fragment, useEffect, useState, FunctionComponent } from 'react'

import dynamic from 'next/dynamic'

import { useStoreon } from 'storeon/react'
import { SearchStore, SearchEvent, SettingStore, SettingEvent } from '@models'
import { Search as SearchAction } from '@models/constant'

import { GetStaticProps } from 'next'

import { MasonryLayoutDeterminer } from '@providers'

import {
	PreloadGallery,
	RecommendedGallery,
	Search,
	OpenGraph
} from '@components'

import { get, isNhentai, randomPick, tags, filterTag } from '@services'

import { Stories } from '@types'

import styles from '@styles/landing.module.sass'

const SearchGallery = dynamic(() => import('@components/gallery/search')),
	LandingCover = dynamic(() => import('@components/landingCover'))

interface Props {
	stories: Stories
}

const Index: FunctionComponent<Props> = ({ stories }) => {
	let { search, dispatch } = useStoreon<SearchStore, SearchEvent>('search')
	let { filter, useDefaultFilter } = useStoreon<SettingStore, SettingEvent>(
		'filter',
		'useDefaultFilter'
	)

	let [initialStories, updateInitialStories] = useState(stories)

	useEffect(() => {
		window.scrollTo({
			top: 0
		})

		return () => {
			dispatch(SearchAction.UPDATE, '')
			dispatch(SearchAction.LOADING, false)
			dispatch(SearchAction.ERROR, false)
		}
	}, [])

	useEffect(() => {
		if (useDefaultFilter) return

		updateInitialStories(filterTag(stories, filter))
	}, [stories, filter, useDefaultFilter])

	if (!stories.length)
		return (
			<Fragment>
				<OpenGraph
					title="Opener Studio"
					description="Pinterest but for hentai and 6 digit code."
				/>
				<MasonryLayoutDeterminer />
				<Search />
				<main id={styles['gallery']}>
					<PreloadGallery />
				</main>
			</Fragment>
		)

	return (
		<Fragment>
			<OpenGraph
				title="Opener Studio"
				description="Pinterest but for hentai and 6 digit code."
			/>
			<MasonryLayoutDeterminer />
			<Search />
			<main id={styles['gallery']}>
				{search ? (
					isNhentai(search) ? (
						<LandingCover />
					) : (
						<SearchGallery />
					)
				) : (
					<RecommendedGallery
						initial={initialStories}
					/>
				)}
			</main>
		</Fragment>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	let stories = await get<Stories>(
		`https://nhapi.opener.studio/search/${randomPick(tags)}/1`
	)

	return {
		props: {
			stories
		},
		revalidate: 3600
	}
}

export default Index
