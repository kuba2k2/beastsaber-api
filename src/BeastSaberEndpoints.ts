import { BaseListParams } from "./params"
import { buildQuery } from "./query"

export const BeastSaberEndpoints = {
	BaseUrl: "https://bsaber.com",

	Login: () => `/wp-login.php`,

	MapByKey: (key: string) => `/songs/${key}/`,
	MapById: (id: number) => `/?p=${id}`,

	Songs: <T extends BaseListParams>(params: T) =>
		`/songs/${params.sortOrder}/page/${params.page}/${buildQuery(params)}`,

	Playlist: (slug: string, page: number) => `/${slug}/page/${page}/`,

	MostReviewed: (page: number) =>
		`/sorted-by-number-of-user-reviews/page/${page}/`,
	TopUserReviewsAll: (page: number) => `/top-user-reviews-all/page/${page}/`,
}
