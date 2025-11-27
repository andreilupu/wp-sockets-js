/**
 * Desc: @TODO Create an example of an alternative data helper with ApiFetch. Should cover basic CRUD operations.
 *
 * @return {Object} dataHelper
 */
const useApiFetchDataHelper = () => {
	const savedSettings = {}; // @TODO: just find a better name for this

	const getSetting = ( settingId ) => {
		// @TODO
		return settingId;
	};

	const setSetting = ( settingId, value ) => {
		// @TODO
		return [ settingId, value ];
	};

	const saveSettings = () => {
		// @TODO
	};

	return { saveSettings, savedSettings, getSetting, setSetting };
};

export { useApiFetchDataHelper };
