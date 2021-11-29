import parse from "node-html-parser"
import MapNotFoundError from "../errors/MapNotFoundError"
import { Map } from "../models/Map"
import { RequestHandler } from "../RequestHandler"
import { parseMapElements } from "./html-map-parser"

export async function parseMapSingle(
	html: string,
	idOrKey: any
): Promise<Map | null> {
	const root = parse(html)

	const title = root
		.querySelector("meta[property=og:title]")
		?.getAttribute("content")
	const url = root
		.querySelector("meta[property=og:url]")
		?.getAttribute("content")
	const imageUrl = root
		.querySelector("meta[property=og:image]")
		?.getAttribute("content")
	const description = root
		.querySelector("meta[property=og:description]")
		?.getAttribute("content")
	if (!title || !url || !imageUrl) throw new MapNotFoundError(idOrKey)

	const header = root.querySelector("header.entry-header")
	const meta = header?.querySelector("div.bsaber-user")
	if (!meta || !header) return null
	const map = parseMapElements(title, url, imageUrl, header, meta)
	if (!map) return null

	map.description = description
		?.replace(`Mapper: ${map.mapper.login} |`, "")
		?.trim()
		?.replace("Description:", "")
		?.trim()

	return map
}
