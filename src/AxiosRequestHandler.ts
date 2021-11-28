import axios from "axios"
import { BeastSaberEndpoints } from "./BeastSaberEndpoints"
import { RequestHandler, Response } from "./RequestHandler"

export class AxiosRequestHandler implements RequestHandler {
	async get(endpoint: string): Promise<Response> {
		const response = await axios.get(BeastSaberEndpoints.BaseUrl + endpoint)
		return {
			headers: response.headers,
			body: response.data as string,
		}
	}

	async post(
		endpoint: string,
		params: Record<string, string>
	): Promise<Response> {
		const response = await axios.post(
			BeastSaberEndpoints.BaseUrl + endpoint,
			params
		)
		return {
			headers: response.headers,
			body: response.data as string,
		}
	}
}
