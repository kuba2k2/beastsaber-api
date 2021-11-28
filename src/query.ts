const queryMap = new Map<string, string | null>([
	["sortOrder", null],
	["page", null],
	["rankedOnly", "ranked"],
	["curatorOnly", "recommended"],
	["verifiedOnly", "verified"],
	["genre", "genre"],
	["difficulty", "difficulty"],
	["time", "time"],
	["uploadedBy", "uploaded_by"],
	["bookmarkedBy", "bookmarked_by"],
	["followedBy", "followed_by"],
])

export function buildQuery(params: object): string {
	const query = [] as string[]
	Object.entries(params).forEach((entry) => {
		const key = entry[0]
		const value = entry[1]
		if (!queryMap.get(key) || value == null || value === undefined) return
		query.push(queryMap.get(key) + "=" + encodeURIComponent(String(value)))
	})
	if (query) return "?" + query.join("&")
	return ""
}
