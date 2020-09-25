/**
 * Format error to uniform type and description
 * @param {error} err 
 */
module.exports.error = (err) => {
	let errorBag = {}
	console.log(err)
	if(err.name === 'SequelizeUniqueConstraintError') {
		for (const error of err.errors) {
			errorBag[`${error.path}`] = {
				type: error.type,
				description: `${error.message}`
			}
		}
	} else if(err.name === 'SequelizeValidationError') {
		for (const error of err.errors) {
			errorBag[`${error.path}`] = {
				type: error.type,
				description: `${error.message}`
			}
		}
	} else {
		for (const error in err) {
			errorBag[`${error}`] = {
				description: err[`${error}`]
			}
		}
	}
	err.errors = errorBag
	return err;
}
