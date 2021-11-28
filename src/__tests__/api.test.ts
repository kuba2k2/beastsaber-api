import BeastSaber from "../BeastSaber"

// Test map ("[Alphabeat – Monstercat Pack] Shaku – 2012 – Pegboard Nerds")
const map1Key = "1d62f"
const map1Id = 1694841
const map1Hash = "256e85b599b38c69b13c846e02fe0fe93ae86ef4"
const map1MapperLogin = "smokeybacon"

// Test playlist containing test map ("Alphabeat's Monstercat Music Pack")
const playlist1Slug = "alphabeats-monstercat-music-pack"

const api = new BeastSaber()

test(`Test map by key ${map1Key}`, async () => {
	const map = await api.getMapByKey(map1Key)
	expect(map).not.toBeNull()
	expect(map?.id).toBe(map1Id)
	expect(map?.hash).toBe(map1Hash)
	expect(map?.mapper?.login).toBe(map1MapperLogin)
}, 10000)

test(`Test playlist maps by slug ${playlist1Slug}`, async () => {
	const result = await api.getPlaylistMaps(playlist1Slug)
	expect(result?.pagination?.current).toBe(1)
	expect(result?.pagination?.max).toBe(1)
	expect(result?.pagination?.previous).toBeUndefined()
	expect(result?.pagination?.next).toBeUndefined()
	expect(result?.maps?.length).toBeGreaterThan(0)

	expect(result?.maps?.map((map) => map.key)).toContain(map1Key)
}, 10000)

test("Test map equality", async () => {
	const mapByKey = await api.getMapByKey(map1Key)
	const mapById = await api.getMapById(map1Id)
	expect(mapByKey).toStrictEqual(mapById)
}, 20000)
