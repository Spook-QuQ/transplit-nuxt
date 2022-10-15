const { graphiqlHTML } = require('../api_functions/graphql-OwO')

module.exports = (req, res) => {
  if (req.query.wolfgang == 'hiroki') {
    // res.send(graphiqlHTML.toString().replace('[[__req_url__]]', req.query.url || '/api/graphql'))
    res.send(graphiqlHTML(req.query.url))
  } else {
    res.send('close')
  }
}
