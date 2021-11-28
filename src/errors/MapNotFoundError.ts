export default class MapNotFoundError extends Error {
	constructor(url: string) {
		super(`Map not found at ${url}`)
		this.name = "MapNotFoundError"
	}
}
