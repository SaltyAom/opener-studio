import { Fragment, FunctionComponent } from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import { Cover, Page, OpenGraph } from '@components'
import NotFound from '@components/gallery/search/notFound'

import { createStructureData, get } from '@services'

import { Stories, Story } from '@types'

import styles from '@styles/h.module.sass'

const Book = dynamic(() => import('@components/book'))

interface Props {
	story: Story
	related: Story[]
}

type Component = FunctionComponent<Props>

interface Path {
	params: {
		h: string
	}
}

const Code: Component = ({ story, related }) => {
	// ? Generating
	if (typeof story === 'undefined')
		return (
			<>
				<OpenGraph
					title="Opener Studio"
					description="Pinterest but for hentai and 6 digit code."
				/>
				<Head>
					<title>Loading...</title>
				</Head>
				<main id={styles['h']}>
					<Cover preload />
					<section className={styles.pages}>
						{Array(20)
							.fill(0)
							.map((_, index) => (
								<Page key={index} preload />
							))}
					</section>
					<h5 className={styles.more}>More like this</h5>
					<footer className={styles.related}>
						{Array(5)
							.fill(0)
							.map((_, index) => (
								<Book key={index} preload />
							))}
					</footer>
				</main>
			</>
		)

	// ? Not valid
	if (!story.id)
		return (
			<main id={styles['h']}>
				<OpenGraph
					title="Opener Studio"
					description="Pinterest but for hentai and 6 digit code."
				/>
				<Head>
					<title>Not Found</title>
				</Head>
				<NotFound />
			</main>
		)

	let {
		id,
		images: { cover, pages },
		title: { display, english, japanese },
		metadata: { artist, tags }
	} = story

	let [structuredData, description] = createStructureData(story)

	return (
		<>
			<OpenGraph
				title={display}
				alternativeTitle={[english, japanese]}
				description={description}
				author={artist.name}
				image={cover}
				id={id}
			/>
			<Head>
				<script
					type="application/ld+json"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: structuredData
					}}
				/>
				<meta property="og:type" content="book" />
				<meta property="book:author" content={artist.name} />
				<meta
					property="book:tag"
					content={tags.map((tag) => tag.name).join(', ')}
				/>
			</Head>
			<main id={styles['h']}>
				<Cover story={story} preview={false} />
				<section className={styles.pages}>
					{pages.map((page, index) => (
						<Page
							key={index}
							page={page}
							alt={`Page ${index + 1}`}
						/>
					))}
				</section>
				<h5 className={styles.more}>More like this</h5>
				<footer className={styles.related}>
					{related.map((story, index) => (
						<Book key={index} story={story} />
					))}
				</footer>
			</main>
		</>
	)
}

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: [],
	fallback: true
})

export const getStaticProps: GetStaticProps<Props> = async (context) => {
	let {
		params: { h }
	} = context as {
		params: { h: string }
	}

	let story: Story
	let related: Stories

	try {
		story = await get<Story>(`https://nhapi.opener.studio/${h}`)
	} catch (err) {
		// @ts-ignore
		story = { id: 0 }
	}

	try {
		let data = await get<Stories>(`https://nhapi.opener.studio/${h}/related`)

		related = Array.isArray(data) ? data : [data]
	} catch (err) {
		related = []
	}

	return {
		props: {
			story,
			related
		},
		revalidate: 3600
	}
}

export default Code
