import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import {readFileSync} from 'fs'
import {createServer} from 'https'

export default defineConfig({
	resolve: {
		alias: {
			'@': `${path.resolve(__dirname, 'src')}`,
		},
	},

	build: {
		minify: true,
	},

	plugins: [
		vue(),
	],

	server: {
		// strictPort: true,
		// https: createServer({
		// 	key: readFileSync('/etc/letsencrypt/live/melody.cs.duke.edu/privkey.pem'),
		// 	cert: readFileSync('/etc/letsencrypt/live/melody.cs.duke.edu/fullchain.pem')
		// }),
		port: 8090,
		proxy: {
			"^/api": {
				target: "http://localhost:8888",
        		ws: true
			}
    	}
	},
})
