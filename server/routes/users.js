const User = require('mongoose').model('User')
const { isObjectId } = require('../../helpers/mongo-utils')

function getUsers (req, res) {
  const users = (req.query.users || '')
    .split(',')
    .map(id => id.trim())
    .filter(id => isObjectId(id))

  if (!users.length) {
    return res.status(200).jsonp([]).end()
  }
  return User.find({ _id: { $in: users } })
    .select('name')
    .lean()
    .then(users => {
      return res.status(200).jsonp(users || []).end()
    })
    .catch(() => res.status(404).jsonp({ message: 'could not load users' }).end())
}

module.exports = getUsers