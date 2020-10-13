import { Story } from '@types'

export const splitChunk = <T extends any[]>(
	data: T,
	chunk: number
): Array<T> => {
	let newChunk: T[] = Array(chunk).fill(Array())

	data.forEach((data, index) => {
		let column = index % chunk

		// @ts-ignore
		newChunk[column] = [...newChunk[column], data]
	})

	return newChunk
}

export const filterTag = (galleries: Story[], filter: string[]) =>
		galleries.filter(
			(story) => {
				let tags = story.metadata.tags.map(tag => tag.name).flat(1)

				let foundTag = filter.find(filter => tags.includes(filter)),
					found = typeof foundTag !== "undefined"

				return !found
			}),
	filterPreference = (galleries: Story[], preference: string[]) =>
		galleries.filter(
			(story) =>
				story.metadata.tags.find((tag) => preference.includes(tag.name))
		)
