export default class MapNotFoundError extends Error {
	constructor(idOrKey: any) {
		super(`Map with ID/key ${idOrKey} not found`)
		this.name = "MapNotFoundError"
	}
}
