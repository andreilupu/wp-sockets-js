const wordpressConfig = require( '@wordpress/prettier-config' );

module.exports = {
	...wordpressConfig,
	useTabs: true,
	tabWidth: 4,
	parenSpacing: true,
};
