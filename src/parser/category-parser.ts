import { HTMLElement } from "node-html-parser"
import { Tag } from "../models/Tag"

export function parseCategories(categories: HTMLElement[]): Tag[] {
	return categories.map((category) => {
		const url = category.getAttribute("href")
		const key = url
			?.replace("https://bsaber.com/category/", "")
			.split("/")
			.join(" ")
			.trim()
			.split(" ")
			.join(":") as string

		const index = key?.indexOf(":") as number
		const type = key?.substring(0, index) as string
		const value = key?.substring(index + 1) as string
		const label = category.text.trim() as string

		let id = 0
		category.classList.value.forEach((cls) => {
			if (cls.startsWith("category-boxed-link-")) {
				id = parseInt(cls.replace("category-boxed-link-", ""), 10)
			}
		})

		return {
			id: id,
			type: type,
			value: value,
			key: `bsaber:${key}`,
			label: label,
		}
	})
}
