import { HTMLElement } from "node-html-parser"
import { Map } from "../models/Map"
import { User } from "../models/User"
import { parseCategories } from "./category-parser"
import { parseDifficulties } from "./difficulty-parser"

export function parseMapElements(
	title: string,
	url: string,
	imageUrl: string,
	root: HTMLElement,
	meta: HTMLElement
): Map | null {
	const id = root.querySelector("a.js-bookmark")?.getAttribute("data-id")
	const difficulties = root.querySelectorAll("a.post-difficulty")
	if (!difficulties || !id) return null

	const datetime = meta.querySelector("time")?.getAttribute("datetime")
	const categories = meta.querySelectorAll(".bsaber-categories a")
	if (!datetime || !categories) return null

	const mapperImg = meta.querySelector("img.avatar")
	const mapperSpan = meta.querySelector("span.mapper_id")
	const mapperLink = meta.querySelector("strong.mapper_id a")
	const mapperName = mapperLink?.text?.trim() ?? mapperSpan?.text?.trim()
	const mapperUrl = mapperLink?.getAttribute("href")
	let mapper: User
	if (mapperImg && mapperName && mapperUrl) {
		mapper = {
			name: mapperName,
			login: mapperUrl.split("/")[4] as string,
			avatarUrl: mapperImg.getAttribute("src"),
			verified: !!meta.querySelector("i.yz-account-verified"),
		}
	} else if (mapperName) {
		mapper = {
			name: mapperName,
			login: mapperName,
		}
	} else {
		return null
	}

	const upvotes =
		root.querySelector(".post-row span.post-stat .fa-thumbs-up")?.parentNode
			?.text ?? "0"
	const downvotes =
		root.querySelector(".post-row span.post-stat .fa-thumbs-down")
			?.parentNode?.text ?? "0"

	const listenOnClick = root
		.querySelector("a.js-listen")
		?.getAttribute("onclick")
	const hash = listenOnClick?.match(
		/previewSong\(this, 'https:\/\/cdn\.beatsaver\.com\/([a-f0-9]+)\./
	)
	if (!hash) return null

	return {
		id: parseInt(id, 10),
		key: url.split("/")[4] as string,
		hash: hash[1],

		title: title,
		imageUrl: imageUrl,
		datePublished: new Date(datetime),

		tags: parseCategories(categories),
		difficulties: parseDifficulties(difficulties),

		mapper: mapper,
		curator: undefined,
		upvotes: parseInt(upvotes, 10),
		downvotes: parseInt(downvotes, 10),

		excerpt: undefined,
		description: undefined,
	}
}
