import { getData, setData } from './dataStore';
import validator from 'validator';
import { validUid, validToken, tokenToUid } from './helpers';
import { userProfile, error, profile, usersAll, emptyObject, Data } from './interface';

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @param {number} uId - User Id of a person
  * @returns {uId: number, email: string, nameFirst: string, nameLast: string,
  * handleStr: string} - authUserId and uId must be valid for this return
*/

export function userProfileV2(token: string, uId: number): userProfile | error {
  const data = getData();

  // check error cases
  if (validToken(token) === false) {
    return { error: 'error invalid token' };
  }
  if (validUid(uId) === false) {
    return { error: 'error invalid  uId' };
  }

  // valid cases:
  let user = null;
  const authUserId = tokenToUid(token);

  for (const profile of data.users) {
    if (profile.authUserId === authUserId) {
      user = {
        uId: profile.authUserId,
        email: profile.email,
        nameFirst: profile.nameFirst,
        nameLast: profile.nameLast,
        handleStr: profile.handleStr
      };
      break;
    }
  }

  return { user };
}

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @param {number} uId - User Id of a person
  * @returns {uId: number, email: string, nameFirst: string, nameLast: string,
  * handleStr: string} - authUserId and uId must be valid for this return
*/

export function usersAllV1(token: string): usersAll | error {
  const data = getData();

  // check error cases
  if (validToken(token) === false) {
    return { error: 'error invalid token' };
  }

  const users: profile[] = [];

  if (data.users.length === 0) {
    return { users };
  }
  for (const user of data.users) {
    const userInfo = {
      uId: user.authUserId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr
    };
    users.push(userInfo);
  }
  return { users };
}

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @param {number} uId - User Id of a person
  * @returns {uId: number, email: string, nameFirst: string, nameLast: string,
* handleStr: string} - authUserId and uId must be valid for this return
*/

export function userProfileSetnameV1(token: string, nameFirst: string, nameLast: string): emptyObject | error {
  const data = getData();

  // Invalid Cases:
  if (validToken(token) === false) {
    return { error: 'error invalid token' };
  }
  if (nameFirst.length < 1 || nameFirst.length > 50) {
    return { error: 'First Name length should be between 1 to 50 characters' };
  }
  if (nameLast.length < 1 || nameLast.length > 50) {
    return { error: 'Last Name length should be between 1 to 50 characters' };
  }

  // Valid Cases:
  const newData: Data = {
    users: [],
    sessions: data.sessions,
    channels: data.channels,
  };

  const authUserId = tokenToUid(token);

  for (const profile of data.users) {
    if (profile.authUserId === authUserId) {
      const usersChangeInput = {
        authUserId: authUserId,
        email: profile.email,
        password: profile.password,
        nameFirst: nameFirst,
        nameLast: nameLast,
        handleStr: profile.handleStr,
        globalPermission: profile.globalPermission,
      };
      newData.users.push(usersChangeInput);
    } else {
      newData.users.push(profile);
    }
  }

  setData(newData);
  return { };
}

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @param {number} uId - User Id of a person
  * @returns {uId: number, email: string, nameFirst: string, nameLast: string,
* handleStr: string} - authUserId and uId must be valid for this return
*/

export function userProfileSetEmailV1(token: string, email: string): emptyObject | error {
  const data = getData();

  // Invalid Cases:
  if (validToken(token) === false) {
    return { error: 'error invalid token' };
  }
  if (!(validator.isEmail(email))) {
    return { error: 'Email is not valid' };
  }
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].email === email && data.users[i].authUserId !== tokenToUid(token)) {
      return { error: 'Email has already been used by another user' };
    }
  }

  // Valid Cases:
  const newData: Data = {
    users: [],
    sessions: data.sessions,
    channels: data.channels,
  };

  const authUserId = tokenToUid(token);

  for (const profile of data.users) {
    if (profile.authUserId === authUserId) {
      const usersChangeInput = {
        authUserId: authUserId,
        email: email,
        password: profile.password,
        nameFirst: profile.nameFirst,
        nameLast: profile.nameLast,
        handleStr: profile.handleStr,
        globalPermission: profile.globalPermission,
      };
      newData.users.push(usersChangeInput);
    } else {
      newData.users.push(profile);
    }
  }

  setData(newData);
  return { };
}

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @param {number} uId - User Id of a person
  * @returns {uId: number, email: string, nameFirst: string, nameLast: string,
* handleStr: string} - authUserId and uId must be valid for this return
*/

export function userProfileSetHandleV1(token: string, handleStr: string): emptyObject | error {
  const data = getData();

  // Invalid Cases:
  if (validToken(token) === false) {
    return { error: 'error invalid token' };
  }
  if (handleStr.length < 3 || handleStr.length > 20) {
    return { error: 'HandleStr length should be between 3 to 20 characters' };
  }
  if (!handleStr.match(/^[a-z0-9]+$/i)) {
    return { error: 'HandleStr should only contain alphanumeric characters' };
  }
  for (const person of data.users) {
    if (person.handleStr === handleStr && person.authUserId !== tokenToUid(token)) {
      return { error: 'HandleStr has already been used by another user' };
    }
  }

  // Valid Cases:
  const newData: Data = {
    users: [],
    sessions: data.sessions,
    channels: data.channels,
  };

  const authUserId = tokenToUid(token);

  for (const profile of data.users) {
    if (profile.authUserId === authUserId) {
      const usersChangeInput = {
        authUserId: authUserId,
        email: profile.email,
        password: profile.password,
        nameFirst: profile.nameFirst,
        nameLast: profile.nameLast,
        handleStr: handleStr,
        globalPermission: profile.globalPermission,
      };
      newData.users.push(usersChangeInput);
    } else {
      newData.users.push(profile);
    }
  }

  setData(newData);
  return { };
}
