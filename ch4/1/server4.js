const http = require(`http`);
const fs = require(`fs`);
const url = require(`url`);
const qs = require(`querystring`);

const parseCookies = (cookie = '') =>
	cookie
		.split(`;`)
		.map(v => v.split(`=`))
		.map(([k, ...vs]) => [k, vs.join(`=`)])
		.reduce((acc, [k, v]) => {
			acc[k.trim()] = decodeURIComponent(v);
			return acc;
		}, {}) ;

http.createServer((req, res) => {
	const cookies = parseCookies(req.headers.cookie);
	if (req.url.startsWith(`/login`)) {
		const {query} = url.parse(req.url);
		const {name} = qs.parse(query);
		const expires = new Date();
		expires.setMinutes(expires.getMinutes() + 5);
		res.wrtieHead(302, {
			Location : '/',
			`Set-Cookie` : 'name=${encodeURIComponent(name)}';

		})
		}
	}
})