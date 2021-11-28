import { AxiosRequestHandler } from "./AxiosRequestHandler"
import { BeastSaberEndpoints } from "./BeastSaberEndpoints"
import { Map } from "./models/Map"
import { BaseListParams } from "./params"
import { parseMapList } from "./parser/html-map-list-parser"
import { parseMapSingle } from "./parser/html-map-single-parser"
import { RequestHandler } from "./RequestHandler"
import { MapListResponse } from "./response/MapListResponse"

class BeastSaber {
	handler: RequestHandler

	constructor() {
		this.handler = new AxiosRequestHandler()
	}

	public setBaseUrl(baseUrl: string) {
		BeastSaberEndpoints.BaseUrl = baseUrl
	}

	public setRequestHandler(handler: RequestHandler) {
		this.handler = handler
	}

	public async getMapByKey(key: string): Promise<Map | null> {
		const url = BeastSaberEndpoints.MapByKey(key)
		return await parseMapSingle(this.handler, url)
	}

	public async getMapById(id: number) {
		const url = BeastSaberEndpoints.MapById(id)
		return await parseMapSingle(this.handler, url)
	}

	public async getMaps(params: BaseListParams): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.Songs(params)
		return await parseMapList(this.handler, url)
	}

	public async getPlaylistMaps(
		playlistSlug: string,
		page: number = 1
	): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.Playlist(playlistSlug, page)
		return await parseMapList(this.handler, url)
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
		return await parseMapList(this.handler, url)
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
		return await parseMapList(this.handler, url)
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
		return await parseMapList(this.handler, url)
	}

	public async getMostReviewed(page: number = 1): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.MostReviewed(page)
		return await parseMapList(this.handler, url)
	}

	public async getTopUserReviewsAll(
		page: number = 1
	): Promise<MapListResponse> {
		const url = BeastSaberEndpoints.TopUserReviewsAll(page)
		return await parseMapList(this.handler, url)
	}
}

export = BeastSaber
