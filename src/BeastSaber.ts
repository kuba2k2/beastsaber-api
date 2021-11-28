import { BeastSaberEndpoints } from "./BeastSaberEndpoints"
import { Map } from "./models/Map"
import { BaseListParams } from "./params"
import { parseMapList } from "./parser/html-map-list-parser"
import { parseMapSingle } from "./parser/html-map-single-parser"
import { MapListResponse } from "./response/MapListResponse"

class BeastSaber {
	public setBaseUrl(baseUrl: string) {
		BeastSaberEndpoints.BaseUrl = baseUrl
	}

	public async getMapByKey(key: string): Promise<Map | null> {
		const url = BeastSaberEndpoints.MapByKey(key)
		return await parseMapSingle(url)
	}

	public async getMapById(id: number) {
		const url = BeastSaberEndpoints.MapById(id)
		return await parseMapSingle(url)
	}

	public async getMaps(params: BaseListParams): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.Songs(params)
		return await parseMapList(url)
	}

	public async getPlaylistMaps(
		playlistSlug: string,
		page: number = 1
	): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.Playlist(playlistSlug, page)
		return await parseMapList(url)
	}

	public async getUploadedBy(
		userLogin: string,
		page: number = 1
	): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.Songs({
			uploadedBy: userLogin,
			page: page,
			sortOrder: "new",
		})
		return await parseMapList(url)
	}

	public async getBookmarkedBy(
		userLogin: string,
		page: number = 1
	): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.Songs({
			bookmarkedBy: userLogin,
			page: page,
			sortOrder: "new",
		})
		return await parseMapList(url)
	}

	public async getFollowedBy(
		userLogin: string,
		page: number = 1
	): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.Songs({
			followedBy: userLogin,
			page: page,
			sortOrder: "new",
		})
		return await parseMapList(url)
	}

	public async getMostReviewed(page: number = 1): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.MostReviewed(page)
		return await parseMapList(url)
	}

	public async getTopUserReviewsAll(
		page: number = 1
	): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.TopUserReviewsAll(page)
		return await parseMapList(url)
	}
}

export = BeastSaber
