# beastsaber-api
BeastSaber scrapping API wrapper

![npm](https://img.shields.io/npm/v/beastsaber-api?logo=npm&style=for-the-badge)


## Installation

```sh
npm install beastsaber-api
```

## Usage

```js
const BeastSaber = require('beastsaber-api')

const api = new BeastSaber()

// optionally, prepend a CORS proxy URL, such as cors-anywhere (note no trailing slash)
// api.setBaseUrl("https://cors-anywhere.example.com/https://bsaber.com")

const map = await api.getMapByKey("1d62f")
const map = await api.getMapById(1694841)

const maps = await api.getMaps({
    sortOrder: "new",
    page: 1,
    curatorOnly: true,
})
const maps = await api.getPlaylistMaps("alphabeats-monstercat-music-pack")
const maps = await api.getUploadedBy("smokeybacon")
const maps = await api.getBookmarkedBy("nitronikexe")
const maps = await api.getMostReviewed(/*page*/ 3)
const maps = await api.getTopUserReviewsAll()
```
