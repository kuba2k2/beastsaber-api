import {
	BaseListParams,
	BookmarkedByListParams,
	FollowedByListParams,
	UploadedByListParams,
} from "./params"
import { buildQuery } from "./query"

export const BeastSaberEndpoints = {
	BaseUrl: "https://bsaber.com",

	MapByKey: (key: string) => `/songs/${key}/`,
	MapById: (id: number) => `/?p=${id}`,

	Songs: (
		params:
			| BaseListParams
			| BookmarkedByListParams
			| FollowedByListParams
			| UploadedByListParams
	) => `/songs/${params.sortOrder}/page/${params.page}/${buildQuery(params)}`,

	Playlist: (slug: string, page: number) => `/${slug}/page/${page}/`,

	MostReviewed: (page: number) =>
		`/sorted-by-number-of-user-reviews/page/${page}/`,
	TopUserReviewsAll: (page: number) => `/top-user-reviews-all/page/${page}/`,
}
