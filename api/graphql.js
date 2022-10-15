const { GraphqlOwO } = require('../api_functions/graphql-OwO')

const firebaseOptions = [
  {
    "type": process.env.FIREBAE_SERVICE_ACCOUNT_TYPE,
    "project_id": process.env.FIREBAE_SERVICE_ACCOUNT_PROJECT_ID,
    "private_key_id": process.env.FIREBAE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBAE_SERVICE_ACCOUNT_PRIVATE_KEY,
    "client_email": process.env.FIREBAE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    "client_id": process.env.FIREBAE_SERVICE_ACCOUNT_CLIENT_ID,
    "auth_uri": process.env.FIREBAE_SERVICE_ACCOUNT_AUTH_URL,
    "token_uri": process.env.FIREBAE_SERVICE_ACCOUNT_TOKEN_URL,
    "auth_provider_x509_cert_url": process.env.FIREBAE_SERVICE_ACCOUNT_AUTH_PROVIDER_x509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBAE_SERVICE_ACCOUNT_CLIENT_x509_CERT_URL
  },
  process.env.FIREBASE_RDB_URL
]

const { r_db, admin } = require('../api_functions/firebase-OwO')(...firebaseOptions)

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

const tokenizer = async text => {
  return await req_p(process.env.YAHOO_API_URL, {
    appid: process.env.YAHOO_API_APP_KEY,
    sentence: text,
    results: 'ma'
  }).then(rs => rs.body)
    .then(xml2json.toJson)
    .then(JSON.parse)
    .then(({ ResultSet:{ ma_result } }) => ma_result)
    .then(maRs => {
      if (Array.isArray(maRs.word_list.word)) {
        return maRs.word_list.word
      } else {
        return [maRs.word_list.word]
      }
    })
}

const translateReq = async (val, f, t) => {
  return await req_p(process.env.TRANSLATE_API_URL, {
    text: val,
    source: f,
    target: t
  }).then(rs => rs.body)
}

// r_db.ref('test').once('value', snapshot => {
//   console.log(snapshot.val())
// })

module.exports = async (req, res) => {

  const graphqlOwO = new GraphqlOwO({
    query: [
      // {
      //   name: 'test',
      //   fields: {
      //     id: 'ID',
      //     text: 'String',
      //     flag: 'Boolean'
      //   },
      //   args: {
      //     id: {
      //       type: 'Number'
      //     }
      //   },
      //   resolve: args => {
      //     return { id: 1, text: 'Test text', flag: false }
      //   },
      //   list: true,
      //   listResolve: args => {
      //     return [
      //       { id: 1, text: 'Test text', flag: false }
      //     ]
      //   },
      //   description: 'This is The Test Type.',
      //   typeDescription: 'This is The Type of This Test',
      //   listDescription: 'This is The description of own Lists'
      // }
      {
        name: 'history',
        fields: {
          rs: 'String'
        },
        resolve: async () => {
          if (req.headers['authorization']) {
            const idToken = req.headers['authorization'].replace('Bearer', '').trim()
            if (idToken) {
              const decodedToken = await admin.auth().verifyIdToken(idToken)
              const historyRef = r_db.ref('users').child(decodedToken.uid + '/history')
              const histories = await historyRef.once('value').then(snapshot => snapshot.val())
              const rsHistories = Object.keys(histories).reduce((arr, key) => {
                arr.push(histories[key])
                return arr
              }, [])
              return { rs: JSON.stringify(rsHistories) }
            }
          } else {
            return 'error'
          }
        }
      }
    ],
    mutation: [
      {
        name: 'deleteHistory',
        description: '-',
        typeDescription: '- \n -',
        fields: {
          rs: 'string',
        },
        resolve: async () => {
          if (req.headers['authorization']) {
            const idToken = req.headers['authorization'].replace('Bearer', '').trim()
            if (idToken) {
              const decodedToken = await admin.auth().verifyIdToken(idToken)
              await r_db.ref('users').child(decodedToken.uid + '/history').remove()
              return { rs: 'done' }
            }
          }
        }
      },
      {
        name: 'translate',
        description: '-',
        typeDescription: '- \n -',
        fields: {
          rsText: 'string',
          rsWords: 'string',
          // splitedText: 'string'
          splitedRsText: 'string'
        },
        args: {
          from: { type: 'string'},
          to: { type: 'string', nonNull: true },
          text: { type: 'string', nonNull: true },
        },
        resolve: async args => {
          const { from, to, text } = args || {}
          const languages = ['en', 'ja']
          const f = languages.find(lang => lang === from)
          const t = languages.find(lang => lang === to)

          if (!f || !t) throw new Error('"from" or "target" language is not exists')
          if (!text) throw new Error('"text" is not exists')
          if (text.length > 2000) throw new Error('"text.length" is over 2000')

          // // const kuromoji = require('kuromoji')
          // //
          // // kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build(function (err, tokenizer) {
          // //   console.log(tokenizer.tokenize('好きな食べ物は何ですか？'))
          // // })
          //
          // const tokenizer = await new Promise((resolve, reject) => {
          //   kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build(function (err, tokenize) {
          //     if (err) { reject(err) }
          //     resolve(tokenize)
          //   })
          // })

          // const tokenize_p = text => {
          //   return new Promise((resolve, reject) => {
          //     return resolve(tokenizer.tokenize(text))
          //   })
          // }

          const translateAllWords = async text => {
            const words = await tokenizer(text)

            return await Promise.all([
              ...words.filter(word => {
                // console.log(word)
                // return word.pos !== '空白' && word.pos_detail_1 !== '空白' && word.pos_detail_2 !== '空白' && word.pos_detail_3 !== '空白'
                return word.surface !== ''

              }).map(async (word, i) => {

                // const isWordExists = (await wordsRef.orderByChild(t).equalTo(word.surface_form).once('value')).val()
                
                const wordsRef = r_db.ref('words')
                const isWordExists = (await wordsRef.orderByChild(t).equalTo(word.surface).once('value')).val()

                if (isWordExists) {
                  const thisWord = isWordExists[Object.keys(isWordExists)[0]]

                  return {
                    rs: thisWord[f],
                    // word: word.surface_form
                    word: word.surface
                  }
                } else {
                  // const rsWord =  await translateReq(word.surface_form, t, f)
                  // const rsWord = await translateReq(word.surface, t, f) // !

                  const sleep_p = length => {
                    return new Promise((resolve, reject) => {
                      setTimeout(_=> {
                        return resolve()
                      }, length)
                    })
                  }


                  const regexpStrings = 'alt="Google Apps Script" src="//ssl.gstatic.com/docs/script/images/logo.png"></div><div style="text-align:center;font-family:monospace;margin:50px auto 0;max-width:600px">'
                  const translateReUnrelateWIthError = async (word, t, f) => {
                    const rs = await translateReq(word, t, f)
                    if (rs.match(regexpStrings)) {
                      return await sleep_p(Math.floor(Math.random() * 4))
                        .then(async _ => translateReUnrelateWIthError(word, t, f))
                    } else { return rs }
                  }
                  const rsWord = await translateReUnrelateWIthError(word.surface, t, f)
                  // console.log(rsWord)

                  wordsRef.push({
                    // [t]: word.surface_form,
                    [t]: word.surface,
                    [f]: rsWord
                  })
                  const rs = {
                    rs: rsWord,
                    // word: word.surface_form
                    word: word.surface
                  }
                  return rs
                }
              })
            ]).catch(console.log)
          }

          const rsText = await translateReq(text, f, t)

          const regexpStrings = '{background-color: #fff; margin: 0; padding: 0;}.errorMessage {font-family: Arial,sans-serif; font-size: 12pt; font-weight: bold; line-height: 150%; padding-top: 25px;}</style></head><body style="margin:20px"><div><img alt="Google Apps Script" src="//ssl.gstatic.com/docs/script/images/logo.png"></div><div style="text-align:center;font-family:monospace;margin:50px auto 0;max-width:600px">'
          const isRsError = rsText.match(regexpStrings)

          let splitedRsText
          let rsWords

          if (!isRsError) {
            const [ _splitedRsText, _rsWords ] = await Promise.all([
              tokenizer(rsText).then(words => words.map(word => word.surface)),
              translateAllWords(rsText)
            ])
            splitedRsText = _splitedRsText
            rsWords = _rsWords
            // splitedRsText = (await tokenizer(rsText)).map(word => word.surface)
            // rsWords = await translateAllWords(rsText)

            if (req.headers['authorization']) {
              const idToken = req.headers['authorization'].replace('Bearer', '').trim()
              if (idToken) {
                const decodedToken = await admin.auth().verifyIdToken(idToken)
                if (!decodedToken) return
                const historyRef = r_db.ref('users').child(decodedToken.uid + '/history')
                await Promise.all([
                  historyRef.push({
                    text,
                    rsText,
                    // splitedText: JSON.stringify(words.map(word => word.surface_form)),
                    splitedRsText: JSON.stringify(splitedRsText),
                    rsWords: JSON.stringify(rsWords)
                  }),
                  historyRef.once('value', snapshot => {
                    const max = 20
                    if (snapshot.numChildren() > max) {
                      const data = snapshot.val()
                      // console.log(data)
                      historyRef.update(
                        Object.keys(data).reverse().reduce((obj, key, index) => {
                          if (max > index) obj[key] = data[key]
                          else obj[key] = null
                          return obj
                        }, {})
                      )
                    }
                  })
                ])
                // await historyRef.push({
                //   text,
                //   rsText,
                //   // splitedText: JSON.stringify(words.map(word => word.surface_form)),
                //   splitedRsText: JSON.stringify(splitedRsText),
                //   rsWords: JSON.stringify(rsWords)
                // })
                // await historyRef.once('value', snapshot => {
                //   const max = 20
                //   if (snapshot.numChildren() > max) {
                //     const data = snapshot.val()
                //     // console.log(data)
                //     historyRef.update(
                //       Object.keys(data).reverse().reduce((obj, key, index) => {
                //         if (max > index) obj[key] = data[key]
                //         else obj[key] = null
                //         return obj
                //       }, {})
                //     )
                //   }
                // })
              }
            }
          } else {
            throw new Error(isRsError)
          }

          return {
            rsText: isRsError ? 'Error' : rsText,
            splitedRsText: JSON.stringify(splitedRsText),
            // splitedText: JSON.stringify(words.map(word => word.surface_form)),
            rsWords: JSON.stringify(rsWords)
          }
        }
      }
    ],
    description: {
      query: 'Hello',
      mutation: 'World'
    }
  })

  if (req.method == 'POST') {
    const { query, variables } = req.body
    graphqlOwO.run(query, variables).then(rs => {
      const data = rs.data
      res.send({ data } || {})
    })
  }

}
