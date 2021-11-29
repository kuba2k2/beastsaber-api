import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { wrapper } from "axios-cookiejar-support"
import { CookieJar, Store } from "tough-cookie"
import { BeastSaberEndpoints } from "./BeastSaberEndpoints"
import {
	BsaberGetRequest,
	BsaberPostRequest,
	BsaberResponse,
	RequestHandler,
} from "./RequestHandler"

export class AxiosRequestHandler implements RequestHandler {
	cookieJar: CookieJar
	axios: AxiosInstance

	constructor(cookieStore?: Store) {
		this.cookieJar = new CookieJar(cookieStore)
		this.axios = wrapper(
			axios.create({
				jar: this.cookieJar,
			})
		)
	}

	async get({
		endpoint,
		headers,
	}: BsaberGetRequest): Promise<BsaberResponse> {
		const url = BeastSaberEndpoints.BaseUrl + endpoint
		const config: AxiosRequestConfig = {
			headers: headers,
		}
		const response = await this.axios.get(url, config)
		return {
			headers: response.headers,
			body: response.data,
			status: response.status,
		}
	}

	async post({
		endpoint,
		headers,
		params,
	}: BsaberPostRequest): Promise<BsaberResponse> {
		const url = BeastSaberEndpoints.BaseUrl + endpoint
		const data = new URLSearchParams(params)
		const config: AxiosRequestConfig = {
			headers: headers,
			maxRedirects: 0,
			validateStatus: (status) => status >= 200 && status < 400,
		}
		const response = await this.axios.post(url, data, config)
		return {
			headers: response.headers,
			body: response.data,
			status: response.status,
		}
	}
}
