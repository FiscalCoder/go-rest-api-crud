import database from './database'

function sendRes(res, code, result, type, message) {
  let warn = 36
  let ifErr = false
  if (code >= 400) {
    console.log(result, message)
    warn = 33
    ifErr = true
  }

  console.log(`\x1b[4m\x1b[1m\x1b[${warn}m${message}${ifErr ? `\n\n${result}` : ''}\x1b[89m\x1b[22m\x1b[24m\x1b[0m`)

  res.status(code).send({
    code,
    result,
    type,
    message,
  });
}

function dbCall(sql, data) {
  return new Promise((resolve, reject) => {
    database.query(sql, data, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    });
  })
}

export default { sendRes, dbCall }
