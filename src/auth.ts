import { getData, setData } from './dataStore';
import validator from 'validator';
import { error, authRegister, authLogin, emptyObject } from './interface';
import { validToken } from './helpers';

const ownersPermission = 1;
const membersPermission = 2;

/**
  * The function will take email, password, nameFirst, nameLast
  * What it creates:
  * >  handlestr from the nameFirst and nameLast
  * >  authUserId - just a number
  * >  token - just a string
  * >  push the details of user input into the data
  * >  check errors
  *
  * @param {string} email - the email of user
  * @param {integer} password - the password for the email
  * @param {string} nameFirst - the user's first name
  * @param {string} nameLast - the user's last name
  * ...
  *
  * @returns {{token: string}} - authUserId, which is the 'unique string' of the user
  * @returns {{authUserId: integer}} - authUserId, which is the id of the user
*/
export function authRegisterV2(email: string, password: string, nameFirst: string, nameLast: string): authRegister | error {
  const data = getData();

  // ERROR CASE:
  if (!(validator.isEmail(email))) {
    return { error: 'Email is not valid' };
  }
  if (password.length < 6) {
    return { error: 'Password length is less than 6' };
  }
  if (nameFirst.length < 1 || nameFirst.length > 50) {
    return { error: 'First Name length should be between 1 to 50 characters' };
  }
  if (nameLast.length < 1 || nameLast.length > 50) {
    return { error: 'Last Name length should be between 1 to 50 characters' };
  }
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].email === email) {
      return { error: 'Email has already been used by another user' };
    }
  }

  // NORMAL CASE:
  // Making the handleStr
  let handleStr = nameFirst + nameLast;
  handleStr = handleStr.toLowerCase().replace(/[^a-z0-9]/g, '');

  // if length > 20 character
  if (handleStr.length > 20) {
    handleStr = handleStr.substring(0, 20);
  }

  // if handle is already taken
  const ogHandle = handleStr;
  let appendConcatenated = 0;
  let foundDuplicate = true;
  while (foundDuplicate) {
    foundDuplicate = false;
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].handleStr === handleStr) {
        handleStr = ogHandle + appendConcatenated;
        appendConcatenated++;
        foundDuplicate = true;
        break;
      }
    }
  }

  // for global permissions:
  // if the array is empty, this means that he is the first person create
  let globalPermission = 0;
  if (data.users.length < 1) {
    globalPermission = ownersPermission;
  } else {
    globalPermission = membersPermission;
  }

  const authUserId = data.users.length;
  const token = Math.floor(Math.random() * 1000000000000000).toString() + authUserId.toString();

  const session = {
    authUserId: authUserId,
    token: token,
  };

  const usersInput = {
    authUserId: authUserId,
    email: email,
    password: password,
    nameFirst: nameFirst,
    nameLast: nameLast,
    handleStr: handleStr,
    globalPermission: globalPermission,
  };

  data.sessions.push(session);
  data.users.push(usersInput);
  setData(data);

  return {
    token: token,
    authUserId: authUserId,
  };
}

/**
  * The function will take email, password
  * What it does:
  * >  It will like login into the person's account
  * >  create authUserId - just a number
  * >  create token - just a string
  *
  * @param {string} email - the email of user registered
  * @param {integer} password - the password for the email
  * ...
  *
  * @returns {string} - token, every time that user wants to make a request to the server, they will pass this "token" to know the user
  * @returns {integer} - authUserId, which is the id of the user
*/

export function authLoginV2(email: string, password: string): authLogin | error {
  let authUserId = 0;
  let token;
  let login = false;
  const data = getData();
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].email === email && data.users[i].password === password) {
      authUserId = data.users[i].authUserId;
      token = Math.floor(Math.random() * 1000000000000000).toString() + authUserId.toString();
      login = true;
    } else if (data.users[i].email === email && data.users[i].password !== password) {
      return { error: 'Incorrect password' };
    }
  }

  // If the input email is not in the data
  if (login === false) {
    return { error: 'Email entered is wrong' };
  }

  const session = {
    authUserId: authUserId,
    token: token,
  };
  data.sessions.push(session);
  setData(data);

  return {
    token, authUserId
  };
}

/**
  * The function will take email, password
  * What it does:
  * >  It will like login into the person's account
  * >  create authUserId - just a number
  * >  create token - just a string
  *
  * @param {string} email - the email of user registered
  * @param {integer} password - the password for the email
  * ...
  *
  * @returns {string} - token, every time that user wants to make a request to the server, they will pass this "token" to know the user
  * @returns {integer} - authUserId, which is the id of the user
*/

export function authLogoutV1(token: string): emptyObject | error {
  const data = getData();

  if (!(validToken(token))) {
    return { error: 'error invalid token' };
  }

  let sessionIndex = 0;
  for (const session of data.sessions) {
    if (token === session.token) {
      data.sessions.splice(sessionIndex, 1);
      setData(data);
    }
    sessionIndex++;
  }

  setData(data);

  return {};
}
