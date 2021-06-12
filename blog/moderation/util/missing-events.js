const axios = require('axios');

const config = require('../config/config');
const eventController = require('../controllers/event-controller');
const HttpError = require('./http-error');

const missingEvents = async () => {
    let events;
    try {
        const response = await axios.get(config.EVENT_BUS);
        events = response.data;
    } catch (err) {
        throw new HttpError('Internal Server Error', 500);
    }
    if (events && events.length >= 0) {
        events.map(e => eventController.eventHanlder(e.type, e.data));
    }
}

module.exports = missingEvents;