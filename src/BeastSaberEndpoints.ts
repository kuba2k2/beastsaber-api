import { BaseListParams } from "./params"
import { buildQuery } from "./query"

function pageQuery(page: number): string {
	if (page === 1) {
		return ""
	}
	return `page/${page}/`
}

export const BeastSaberEndpoints = {
	Login: () => `/wp-login.php`,
	AdminAjax: () => `/wp-admin/admin-ajax.php`,

	MapByKey: (key: string) => `/songs/${key}/`,
	MapById: (id: number) => `/?p=${id}`,

	Songs: <T extends BaseListParams>(params: T) =>
		`/songs/${params.sortOrder}/${pageQuery(params.page)}${buildQuery(
			params
		)}`,

	Playlist: (slug: string, page: number) => `/${slug}/${pageQuery(page)}`,

	MostReviewed: (page: number) =>
		`/sorted-by-number-of-user-reviews/${pageQuery(page)}`,
	TopUserReviewsAll: (page: number) =>
		`/top-user-reviews-all/${pageQuery(page)}`,
}
