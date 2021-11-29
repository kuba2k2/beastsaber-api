import { Cookie, Store } from "tough-cookie"
import { AxiosRequestHandler } from "./AxiosRequestHandler"
import { BeastSaberEndpoints } from "./BeastSaberEndpoints"
import LoginFailedError from "./errors/LoginFailedError"
import { Map } from "./models/Map"
import { BaseListParams } from "./params"
import { parseMapList } from "./parser/html-map-list-parser"
import { parseMapSingle } from "./parser/html-map-single-parser"
import { RequestHandler } from "./RequestHandler"
import { MapListResponse } from "./response/MapListResponse"

class BeastSaber {
	handler: RequestHandler

	constructor(cookieStore?: Store) {
		this.handler = new AxiosRequestHandler(cookieStore)
	}

	/**
	 * Set base URL for all requests. The URL should not include a trailing slash.
	 */
	public setBaseUrl(baseUrl: string) {
		BeastSaberEndpoints.BaseUrl = baseUrl
	}

	/**
	 * Set a custom request handler.
	 */
	public setRequestHandler(handler: RequestHandler) {
		this.handler = handler
	}

	/**
	 * Login the user.
	 * @param userLogin user login/email
	 * @param password user password
	 * @returns array of currently stored cookies for bsaber.com
	 */
	public async login(userLogin: string, password: string): Promise<Cookie[]> {
		const endpoint = BeastSaberEndpoints.Login()
		const params = {
			log: userLogin,
			pwd: password,
			rememberme: "forever",
			"wp-submit": "Log In",
			redirect_to: "https://bsaber.com/",
			testcookie: "1",
		}

		const cookie = new Cookie({
			key: "wordpress_test_cookie",
			value: "WP+Cookie+check",
		})
		this.handler.cookieJar.setCookie(cookie, BeastSaberEndpoints.BaseUrl)

		const response = await this.handler.post({ endpoint, params })
		if (response.status !== 302) {
			throw new LoginFailedError(response.body)
		}
		return await this.handler.cookieJar.getCookies(
			BeastSaberEndpoints.BaseUrl
		)
	}

	/**
	 * Get a single map.
	 * @param key map hexadeximal key
	 * @returns Map or null if parse error
	 */
	public async getMapByKey(key: string): Promise<Map | null> {
		const response = await this.handler.get({
			endpoint: BeastSaberEndpoints.MapByKey(key),
		})
		return await parseMapSingle(response.body, key)
	}

	/**
	 * Get a single map.
	 * @param id bsaber.com post ID
	 * @returns Map or null if parse error
	 */
	public async getMapById(id: number): Promise<Map | null> {
		const response = await this.handler.get({
			endpoint: BeastSaberEndpoints.MapById(id),
		})
		return await parseMapSingle(response.body, id)
	}

	/**
	 * Fetch maps by the given params.
	 */
	public async getMaps<T extends BaseListParams>(
		params: T
	): Promise<MapListResponse> {
		const response = await this.handler.get({
			endpoint: BeastSaberEndpoints.Songs(params),
		})
		return await parseMapList(response.body)
	}

	/**
	 * Get maps in a playlist.
	 * @param playlistSlug playlist slug name, as seen in the page URL
	 */
	public async getPlaylistMaps(
		playlistSlug: string,
		page: number = 1
	): Promise<MapListResponse> {
		const response = await this.handler.get({
			endpoint: BeastSaberEndpoints.Playlist(playlistSlug, page),
		})
		return await parseMapList(response.body)
	}

	/**
	 * Get maps uploaded by a user.
	 */
	public async getUploadedBy(
		userLogin: string,
		page: number = 1
	): Promise<MapListResponse> {
		return await this.getMaps({
			uploadedBy: userLogin,
			page: page,
			sortOrder: "new",
		})
	}

	/**
	 * Get maps bookmarked by a user.
	 */
	public async getBookmarkedBy(
		userLogin: string,
		page: number = 1
	): Promise<MapListResponse> {
		return await this.getMaps({
			bookmarkedBy: userLogin,
			page: page,
			sortOrder: "new",
		})
	}

	/**
	 * Get maps by mappers followed by a user.
	 */
	public async getFollowedBy(
		userLogin: string,
		page: number = 1
	): Promise<MapListResponse> {
		return await this.getMaps({
			followedBy: userLogin,
			page: page,
			sortOrder: "new",
		})
	}

	/**
	 * Get most reviewed maps.
	 */
	public async getMostReviewed(page: number = 1): Promise<MapListResponse> {
		const response = await this.handler.get({
			endpoint: BeastSaberEndpoints.MostReviewed(page),
		})
		return await parseMapList(response.body)
	}

	/**
	 * Get "Top User Reviews All" maps.
	 */
	public async getTopUserReviewsAll(
		page: number = 1
	): Promise<MapListResponse> {
		const response = await this.handler.get({
			endpoint: BeastSaberEndpoints.TopUserReviewsAll(page),
		})
		return await parseMapList(response.body)
	}
}

export = BeastSaber
