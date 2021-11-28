export type BaseListParams = {
	sortOrder: "new" | "top" | "most-difficult"
	page: number
	rankedOnly?: boolean
	curatorOnly?: boolean
	verifiedOnly?: boolean
	genre?: string
	difficulty?: string
	time?: "24-hours" | "7-days" | "30-days" | "3-months" | "all"
}

export type UploadedByListParams = {
	uploadedBy: string
} & BaseListParams

export type BookmarkedByListParams = {
	bookmarkedBy: string
} & BaseListParams

export type FollowedByListParams = {
	followedBy: string
} & BaseListParams
