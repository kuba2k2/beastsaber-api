import parse from "node-html-parser"
import { User } from "../models/User"
import { RequestHandler } from "../RequestHandler"
import { MapListResponse } from "../response/MapListResponse"
import { parseMapElements } from "./html-map-parser"

export async function parseMapList(html: string): Promise<MapListResponse> {
	const root = parse(html)

	const result: MapListResponse = {
		maps: [],
		pagination: {
			current: 1,
		},
	}

	root.querySelectorAll("article.type-post").forEach((article) => {
		const postGallery = article.querySelector(".post-gallery")
		const galleryLink = postGallery?.querySelector("a[rel=bookmark]")
		const title = galleryLink?.getAttribute("title")
		const url = galleryLink?.getAttribute("href")
		const imageUrl = galleryLink
			?.querySelector("img")
			?.getAttribute("data-original")
		if (!title || !url || !imageUrl) return

		const meta = article.querySelector("div.post-mapper-id-meta")
		if (!meta) return
		const map = parseMapElements(title, url, imageUrl, article, meta)
		if (!map) return

		const curatorLink = article.querySelector(
			"div.post-row > span > a[rel=author]"
		)
		const curatorName = curatorLink?.text?.trim()
		const curatorUrl = curatorLink?.getAttribute("href")
		let curator: User | undefined
		if (curatorName && curatorUrl) {
			curator = {
				name: curatorName,
				login: curatorUrl.split("/")[4] as string,
			}
		}

		map.excerpt = article
			.querySelector(".post-content")
			?.text?.replace(`Mapper: ${map.mapper.name}`, "")
			?.trim()
		map.curator = curator

		result.maps.push(map)
	})

	if (result.maps) {
		result.pagination.current = 1
		result.pagination.max = 1
	}

	const pageCurrent = root.querySelector(".page-numbers-current")
	if (pageCurrent) {
		result.pagination.current = parseInt(pageCurrent.text.trim(), 10)
	}
	const pagePrevious = root.querySelector(".page-numbers.prev")
	if (pagePrevious) {
		result.pagination.previous = result.pagination.current - 1
	}
	const pageNext = root.querySelector(".page-numbers.next")
	if (pageNext) {
		result.pagination.next = result.pagination.current + 1
	}
	const pageMax = root.querySelectorAll(".page-numbers:not(.next)")
	if (pageMax.length) {
		result.pagination.max = parseInt(
			pageMax[pageMax.length - 1].text.trim(),
			10
		)
	}

	return result
}
