class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }

    toJSON() {
        return { message: this.message, code: this.status };
    }
}

module.exports = HttpError;