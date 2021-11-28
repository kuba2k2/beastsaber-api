import { Map } from "../models/Map"

export type MapListResponse = {
	maps: Map[]
	pagination: {
		current: number
		max?: number
		previous?: number
		next?: number
	}
}
