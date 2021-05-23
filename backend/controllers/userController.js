/* eslint-disable no-throw-literal */
/* eslint-disable prefer-template */
import axios from 'axios';
import db from '../config/databaseAsync';

const { sendRes, dbCall } = db

async function addBulkUser(req, res) {
  const { getNewUsers = false } = req.body
  let catchErrorMsg = 'Error occured while processing users data'
  try {
    const getUsersSqlQuery = 'SELECT * FROM users;'
    let users
    let usersData

    try {
      users = await dbCall(getUsersSqlQuery)

      const getUserUrl = 'https://gorest.co.in/public-api/users'
      if (users.length === 0 || getNewUsers) usersData = await axios.get(getUserUrl)
    } catch (error) {
      catchErrorMsg = 'Error occurred while fetching User details'
      throw error
    }

    let userDataAdd

    if (usersData && usersData.status === 200 && usersData.data.code === 200) {
      const { data } = usersData.data
      const processedData = data.map((user) => {
        const mapUserData = { ...user }
        delete mapUserData.id
        mapUserData.created_at = new Date(mapUserData.created_at)
        mapUserData.updated_at = new Date(mapUserData.updated_at)
        return Object.values(mapUserData);
      })

      const insertUserSql = 'TRUNCATE table users; INSERT INTO `users` (`name`, `email`, `gender`, `status`, `created_at`, `updated_at`) VALUES ?'

      userDataAdd = await dbCall(insertUserSql, [processedData])
        .catch((err) => {
          catchErrorMsg = 'Error occurred while adding users into the database'
          throw err
        })

      users = await dbCall(getUsersSqlQuery)
        .catch((err) => {
          catchErrorMsg = 'Error occurred while fetching users'
          throw err
        })
    }

    const successMsg = users.length === 0 || getNewUsers
      ? 'Database has been updated with new users'
      : 'Successfully Fetched User Details'

    const codeStatus = userDataAdd ? 201 : 200

    sendRes(res, codeStatus, users, 'success', successMsg)
  } catch (error) {
    sendRes(res, 500, error, 'error', catchErrorMsg)
  }
}

function addUser(req, res) {
  const { formValues } = req.body
  const sqlQuery = 'INSERT INTO users SET ?'
  dbCall(sqlQuery, formValues)
    .then((result) => sendRes(res, 200, result, 'success', 'Successfully added user'))
    .catch((error) => sendRes(res, 500, error, 'error', 'Something happened while adding user '))
}

function editUser(req, res) {
  const { formValues, id } = req.body
  const sqlQuery = 'UPDATE users SET ? WHERE id=?'
  dbCall(sqlQuery, [formValues, id])
    .then(() => {
      const data = { ...formValues, id }
      sendRes(res, 200, data, 'success', 'Successfully updated user')
    })
    .catch((error) => sendRes(res, 500, error, 'error', 'Something happened while updating user '))
}

function deleteUser(req, res) {
  const { id } = req.body
  const sqlQuery = 'DELETE FROM users WHERE id=?'
  dbCall(sqlQuery, id)
    .then((result) => sendRes(res, 200, result, 'success', 'Successfully deleted user'))
    .catch((error) => sendRes(res, 500, error, 'error', 'Something happened while deleting user '))
}

export default {
  addBulkUser, addUser, editUser, deleteUser,
}
