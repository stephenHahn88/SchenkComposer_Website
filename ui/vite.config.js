import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

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
		port: 8090,
		proxy: {
			"^/api": {
				target: "http://localhost:8095",
        		ws: true
			},
			"^/model": {
				target: "http://localhost:8888",
				ws: true
			}
    	}
	},
})
