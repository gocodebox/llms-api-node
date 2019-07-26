/**
 * Utility functiosn
 *
 * @since 1.0.0
 * @version 1.0.0
 */

'use strict';

/**
 * Adds a trailing slash to a string (if one doesn't already exist).
 *
 * @since [version]
 *
 * @param string str A string.
 * @return string
 */
function trailingSlashIt( str ) {
	return '/' === str.slice( -1 ) ? str : str + '/';
}

module.exports = {
	trailingSlashIt: trailingSlashIt,
};
