const sleeper = (ms) => {
    return new Promise(res => setTimeout(res, ms * 1000));
}

module.exports = sleeper;