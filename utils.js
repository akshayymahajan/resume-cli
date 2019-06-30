const axios = require("axios");
const querystring = require("querystring");

module.exports = {
  clearTerminal: () => {
    process.stdout.write("\033c");
  },
  submitResponse: (url, data = {}, config = {}) => {
    return axios.post(url, querystring.stringify(data), config);
  }
};
