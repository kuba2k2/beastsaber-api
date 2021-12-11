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
	domain: string
	baseUrl: string
	userAgent: string =
		"Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"

	/**
	 * @param cookieStore a store for a CookieJar to use with the default request handler
	 */
	constructor(domain?: string, cookieStore?: Store) {
		this.domain = domain ?? "bsaber.com"
		this.handler = new AxiosRequestHandler(this.domain, cookieStore)
		this.baseUrl = "https://" + this.domain
	}

	/**
	 * Set a custom request handler.
	 */
	public setRequestHandler(handler: RequestHandler) {
		this.handler = handler
	}

	private getHeaders(): Record<string, string> {
		return {
			Accept: "*/*",
			"Accept-Language": "en-US",
			Referer: "https://bsaber.com/",
			Origin: "https://bsaber.com/",
			DNT: "1",
			Pragma: "no-cache",
			"Cache-Control": "no-cache",
		}
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
			domain: this.domain,
			path: "/",
		})
		this.handler.cookieJar.setCookie(cookie, this.baseUrl)

		const response = await this.handler.post({
			endpoint,
			params,
			headers: this.getHeaders(),
		})
		if (response.status !== 302) {
			throw new LoginFailedError(response.body)
		}
		return await this.handler.cookieJar.getCookies(this.baseUrl)
	}

	/**
	 * Check if the user is logged in (based on cookies expiration).
	 */
	public async isLoggedIn(endpoint?: string): Promise<boolean> {
		const url = endpoint ? this.baseUrl + endpoint : this.baseUrl
		const cookies = await this.handler.cookieJar.getCookies(url)
		return cookies.some(
			(cookie) =>
				cookie.TTL() > 0 && cookie.key.includes("wordpress_logged_in")
		)
	}

	/**
	 * Try to bookmark a map.
	 * @param mapId bsaber.com post ID
	 * @returns true if succeeded, false if failed (not logged in, etc.)
	 */
	public async bookmarkAdd(mapId: number): Promise<boolean> {
		const endpoint = BeastSaberEndpoints.AdminAjax()
		if (!this.isLoggedIn(endpoint)) return false
		const params = {
			action: "bsaber_bookmark_post",
			type: "add_bookmark",
			post_id: String(mapId),
		}
		const response = await this.handler.post({
			endpoint,
			params,
			headers: this.getHeaders(),
		})
		return response.body.length === 0
	}

	/**
	 * Try to un-bookmark a map.
	 * @param mapId bsaber.com post ID
	 * @returns true if succeeded, false if failed (not logged in, etc.)
	 */
	public async bookmarkRemove(mapId: number): Promise<boolean> {
		const endpoint = BeastSaberEndpoints.AdminAjax()
		if (!this.isLoggedIn(endpoint)) return false
		const params = {
			action: "bsaber_bookmark_post",
			type: "remove_bookmark",
			post_id: String(mapId),
		}
		const response = await this.handler.post({
			endpoint,
			params,
			headers: this.getHeaders(),
		})
		return response.body.length === 0
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
