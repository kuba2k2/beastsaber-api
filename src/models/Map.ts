import { Difficulty } from "./Difficulty"
import { Tag } from "./Tag"
import { User } from "./User"

export type Map = {
	id: number
	key: string
	hash: string

	title: string
	imageUrl: string
	datePublished: Date

	tags: Tag[]
	difficulties: Difficulty[]

	mapper: User
	curator?: User
	upvotes: number
	downvotes: number

	excerpt?: string
	description?: string
}
