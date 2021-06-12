const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = errors.array()
            .reduce((arr, el) => {
                if (el.nestedErrors) el = el.nestedErrors[0];
                return { ...arr, [el.param]: el.msg };
            }, {});
        return res.status(400).json({ error: error });
    }
    next();
};