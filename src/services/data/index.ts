import { Story } from '@types'

// Popular tag on nHentai
export const tags = [
	'big breasts',
	'group',
	'lolicon',
	'sole female',
	'stockings',
	'anal',
	'sole male',
	'schoolgirl uniform',
	'glasses',
	'nakadashi',
	'shotacon',
	'blowjob',
	'bondage',
	'rape',
	'full color',
	'ahegao',
	'yaoi',
	'yuri',
	'incest',
	'tankoubon',
	'double penetration',
	'mosaic censorship',
	'defloration',
	'futanari',
	'paizuri',
	'milf',
	'males only',
	'dark skin',
	'x-ray',
	'sex toys',
	'swimsuit',
	'ffm threesome',
	'femdom',
	'full censorship',
	'netorare',
	'impregnation',
	'dilf',
	'pantyhose',
	'sister',
	'collar',
	'multi-work series',
	'tentacles',
	'mind break',
	'crossdressing',
	'schoolboy uniform',
	'lactation',
	'cheating',
	'bbm',
	'bikini',
	'maid',
	'anthology',
	'mmf threesome',
	'tomgirl',
	'teacher',
	'big ass',
	'footjob',
	'hairy',
	'masturbation',
	'muscle',
	'pregnant',
	'big penis',
	'mind control',
	'story arc',
	'females only',
	'exhibitionism',
	'catgirl',
	'ponytail',
	'twintails',
	'mother',
	'sweating',
	'garter belt',
	'lingerie',
	'unusual pupils',
	'harem',
	'gender bender',
	'uncensored',
	'gag',
	'huge breasts',
	'urination',
	'small breasts',
	'drugs',
	'kemonomimi',
	'scat',
	'handjob',
	'kimono',
	'blindfold',
	'bloomers',
	'tanlines',
	'prostitution',
	'piercing',
	'demon girl',
	'condom',
	'inflation',
	'elf',
	'bunny girl',
	'fingering',
	'bbw',
	'bukkake',
	'stomach deformation',
	'blackmail'
]

export const createStructureData = (story: Story) => {
	let {
		id,
		images: { cover, pages },
		title: { display, english, japanese },
		info: { favorite, amount, upload },
		metadata: { language, artist, tags: tagList }
	} = story

	let description = `${english} / ${japanese} Language: ${language}, ${amount} page, ${favorite} favorite. Tags: ${tagList
		.map((tag) => tag.name)
		.join(', ')}`

	let date = new Date(+`${upload.original}000`)
	let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
	let month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date)
	let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)

	let structuredData = JSON.stringify({
		'@context': 'https://schema.org/',
		'@type': 'Book',
		description,
		headline: display,
		image: [cover.link],
		bookEdition: '1',
		bookFormat: 'GraphicNovel',
		illustrator: artist.name,
		numberOfPages: pages.length,
		inLanguage: language,
		mainEntityOfPage: `https://opener.studio/h/${id}`,
		url: `https://opener.studio/h/${id}`,
		datePublished: `${month} ${day}, ${year}`
	}).replace(/\n|\t| {2}/g, '')

	return [structuredData, description]
}
