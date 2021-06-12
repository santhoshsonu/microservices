const axios = require('axios');

const config = require('../config/config');
const HttpError = require('../util/http-error');

const filterString = 'orange';

const eventHanlder = async (type, data) => {
    if (type === 'CREATE_COMMENT') {
        data.status = data.content.includes(filterString) ? 'rejected' : 'approved';
        try {
            await axios.post(config.EVENT_BUS, { type: 'MODERATE_COMMENT', data });
        } catch (err) {
            throw new HttpError('Internal Server Error', 500);
        }
    }
};


module.exports.eventHanlder = eventHanlder;
