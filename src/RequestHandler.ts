import { CookieJar } from "tough-cookie"

export type BsaberGetRequest = {
	/**
	 * Bsaber.com endpoint (including leading /).
	 */
	endpoint: string

	/**
	 * Request headers.
	 */
	headers?: Record<string, string>
}

export type BsaberPostRequest = {
	/**
	 * Form fields (application/x-www-form-urlencoded).
	 */
	params: Record<string, string>
} & BsaberGetRequest

export type BsaberResponse = {
	/**
	 * Response headers.
	 */
	headers: Record<string, string> & {
		"set-cookie"?: string[]
	}

	/**
	 * Response HTTP status code.
	 */
	status: number

	/**
	 * Response body, as a string.
	 */
	body: string
}

export interface RequestHandler {
	/**
	 * A cookie jar containing cookies sent in requests.
	 */
	cookieJar: CookieJar

	/**
	 * Performs a GET request using cookies from the cookie jar.
	 * @param request request parameters
	 */
	get(request: BsaberGetRequest): Promise<BsaberResponse>

	/**
	 * Performs a POST request using cookies from the cookie jar.
	 * @param request request parameters
	 */
	post(request: BsaberPostRequest): Promise<BsaberResponse>
}
