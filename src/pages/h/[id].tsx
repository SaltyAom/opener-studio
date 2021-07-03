import { FunctionComponent, useCallback, useEffect } from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'

import type { OperationResult } from 'urql'

import { useAtom } from 'jotai'
import { collectHistoryAtom } from '@stores/settings'
import { HistoryActions, historyAtom } from '@stores/history'

import { ReaderLayout } from '@layouts/reader'

import { OpenGraph } from '@components/modules/opengraph'
import { Page, ProgressIndicator } from '@atoms'

import tw from '@tailwind'
import { getHentaiReaderById, HentaiQuery } from '@services/graphql'
import type { GetHentaiById, GetHentaiByIdVariables } from '@services/graphql'

import type { Story } from '@types'

interface ReaderProps {
	story: HentaiQuery<Story> | undefined
	error:
		| OperationResult<GetHentaiById, GetHentaiByIdVariables>['error']
		| undefined
}

const Reader: FunctionComponent<ReaderProps> = ({ story, error }) => {
	let [collectHistory] = useAtom(collectHistoryAtom)
	let [, dispatchHistory] = useAtom(historyAtom)

	useEffect(() => {
		if (typeof story === 'undefined' || !story.success) return

		if (collectHistory)
			dispatchHistory({
				type: HistoryActions.add,
				story: story.data
			})
	}, [story])

	let reload = useCallback(() => {
		window.location.reload()
	}, [])

	if (typeof story === 'undefined')
		return (
			<>
				<OpenGraph title="Opener Studio" />
				<ReaderLayout isValid={false}>
					<section
						className={tw`absolute top-0 left-0 flex justify-center items-center w-full h-screen`}
					>
						<ProgressIndicator />
					</section>
				</ReaderLayout>
			</>
		)

	if (error || !story.success)
		return (
			<>
				<OpenGraph title="Opener Studio" />
				<ReaderLayout isValid={false}>
					<section
						className={tw`flex flex-col justify-center h-screen mt-8 py-12`}
					>
						<h1
							className={tw`text-xl text-gray-700 dark:text-gray-300 m-0 mb-4 font-normal`}
						>
							{JSON.stringify(error) || story.error.toString()}
						</h1>
						<button
							className={tw`appearance-none text-xl text-gray-700 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 font-medium px-6 py-2 rounded border-none cursor-pointer`}
							onClick={reload}
							type="button"
						>
							Reload
						</button>
					</section>
				</ReaderLayout>
			</>
		)

	let {
		data: {
			title: { display },
			images: { pages }
		}
	} = story

	return (
		<>
			<OpenGraph title={`${display} - Opener Studio`} />
			<ReaderLayout isValid story={story.data}>
				{pages.map((page) => (
					<Page key={page.link} page={page} />
				))}
			</ReaderLayout>
		</>
	)
}

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: [],
	fallback: true
})

interface Path {
	params: {
		id: string
	}
}

export const getStaticProps: GetStaticProps<ReaderProps> = async (context) => {
	let {
		params: { id }
	} = context as Path

	let story = await getHentaiReaderById({ id: +id })

	return {
		props: {
			story: story.data?.getHentaiById,
			error: JSON.parse(
				JSON.stringify(story.error, (_, v) =>
					typeof v === 'undefined' ? null : v
				)
			)
		},
		revalidate: 3600
	}
}

export default Reader
