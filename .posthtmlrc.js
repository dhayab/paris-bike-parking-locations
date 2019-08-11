/* @see https://github.com/mohsen1/posthtml-favicon-parcel-example/blob/master/.posthtmlrc.js */
module.exports = {
	plugins: {
		'posthtml-favicons': {
			configuration: {
				path: '/',
				appName: '',
				background: '#666666',
				theme_color: '#666666',
				display: "minimal-ui",
				icons: {
					android: false,
					appleIcon: true,
					appleStartup: false,
					coast: false,
					favicons: true,
					firefox: false,
					windows: false,
					yandex: false,
				},
			},
		},
	},
};
