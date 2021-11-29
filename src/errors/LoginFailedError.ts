export default class LoginFailedError extends Error {
	html: string

	constructor(html: string) {
		super(`Login failed`)
		this.name = "LoginFailedError"
		this.html = html
	}
}
