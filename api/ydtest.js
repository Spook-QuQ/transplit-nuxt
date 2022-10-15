const xml2json = require('xml2json')
const request = require('request')
const req_p = async (url, data, method) => {
  return new Promise((resolve, reject) => {
    request[method === 'post' ? 'post' : 'get']({
      url,
      headers: { 'Content-type': 'application/json' },
      qs: data
    }, (err, res, body) => {
      if (err) reject(err)
      return resolve(res)
    })
  })
}

module.exports = async (req, res) => {
  req_p(process.env.YAHOO_API_URL, {
    appid: process.env.YAHOO_API_APP_KEY,
    sentence: 'Do you like sushi?',
    results: 'ma'
  })
    .then(rs => rs.body)
    .then(xml2json.toJson)
    .then(JSON.parse)
    .then(({ ResultSet:{ ma_result } }) => ma_result)
    .then(maRs => {
      console.log(maRs.word_list)
    })
  res.send('o')
}
