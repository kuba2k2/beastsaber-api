export type Response = {
	headers: Record<string, string>
	body: string
}

export interface RequestHandler {
	get(endpoint: string): Promise<Response>
	post(endpoint: string, params: Record<string, string>): Promise<Response>
}
