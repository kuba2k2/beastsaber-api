import { HTMLElement } from "node-html-parser"
import { Difficulty } from "../models/Difficulty"

export function parseDifficulties(difficulties: HTMLElement[]): Difficulty[] {
	return difficulties.map((difficulty) => {
		const url = difficulty.getAttribute("href")
		const index = url?.indexOf("=") as number
		const key = url?.substring(index + 1) as string
		const label = difficulty.text.trim()

		return {
			key: key,
			label: label,
		}
	})
}
