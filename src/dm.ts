import { setData, getData } from './dataStore';
import { findUserWithId, validToken, tokenToUid, findDmWithId, isUserDmMember, getDmIndex } from './helpers';
import { Dm, dmCreate, dmList, emptyObject, error, dmLeaveInput, dmCreateInput, dmMessageReturn } from './interface';

/**
 * Create a DM containing valid users with uids
 *
 * @param {object} newDmInput an object containing the argument parameters:
    * {string} token  random token
    * {number[]} uIds this contains the userId's that this DM is directed to
 * @returns { dmId: number } the Uids should refer to valid user and the token should be valid to return this value
 */
function dmCreateV1(newDmInput: dmCreateInput): dmCreate | error {
  const data = getData();
  // 1. check if all the uIds in the list are valid
  for (const id of newDmInput.uIds) {
    if (findUserWithId(data, id) == null) {
      return { error: 'uId is invalid' };
    }
  }
  // 2. ensure that all uIds are unique
  let duplicatesPresent = false;
  for (let i = 0; i < newDmInput.uIds.length; i++) {
    for (let j = 0; j < newDmInput.uIds.length; j++) {
      if (i !== j) {
        if (newDmInput.uIds[i] === newDmInput.uIds[j]) {
          duplicatesPresent = true;
          break;
        }
      }
    }
    if (duplicatesPresent === true) {
      return { error: 'duplicate uIds present in the list' };
    }
  }
  // 3. check if the token is valid
  const userId = tokenToUid(newDmInput.token);
  if (findUserWithId(data, userId) == null || validToken(newDmInput.token) === false) {
    return { error: 'invalid token' };
  }
  // 4. create dm name
  const dmCreator = findUserWithId(data, userId);
  const handles = [dmCreator.handleStr];
  for (const id of newDmInput.uIds) {
    handles.push(findUserWithId(data, id).handleStr);
  }
  handles.sort();
  const finalDmName = handles.join(', ');
  // 5. create dm
  const dmMembers = [
    {
      authUserId: dmCreator.authUserId,
      email: dmCreator.email,
      nameFirst: dmCreator.nameFirst,
      nameLast: dmCreator.nameLast,
      handleStr: dmCreator.handleStr
    }
  ];
  for (const id of newDmInput.uIds) {
    const nextMember = findUserWithId(data, id);
    dmMembers.push(
      {
        authUserId: nextMember.authUserId,
        email: nextMember.email,
        nameFirst: nextMember.nameFirst,
        nameLast: nextMember.nameLast,
        handleStr: nextMember.handleStr
      }
    );
  }
  const newDm: Dm = {
    dmId: data.dms.length + 1,
    name: finalDmName,
    dmCreator: dmMembers[0],
    members: dmMembers,
    messages: []
  };

  data.dms.push(newDm);

  setData(data);

  return { dmId: newDm.dmId };
}

/**
 * return a lost of DM;s that the user is a member of
 *
 * @param {string} token the token that refers to specific person
 * @returns {dms: array} returns an Array of dm's only if the token is valid
 */
function dmListV1(token: string): dmList | error {
  const data = getData();
  // 1. check if the token is valid
  const userId = tokenToUid(token);
  if (findUserWithId(data, userId) == null || validToken(token) === false) {
    return { error: 'invalid token' };
  }
  // 2. create an array of type Dm
  const dmArray = [];
  // 3. go through each dm
  for (const currentDm of data.dms) {
    // 4. if user is in dm, add that dm to the array
    if (isUserDmMember(currentDm, userId) === true) {
      dmArray.push(currentDm);
    }
  }

  return { dms: dmArray };
}

/**
 *
 * Given a DM with ID dmId that the authorised user is a member of, provide basic details about the DM.
 *
 * @param {string} token token targeting specific dm
 * @param {number} dmId a dmId that we wnat to find details for
 * @returns {name: string, members: array} this retruns details about AllMembers[] and the name of the DM
 */
function dmDetailsV1(token: string, dmId: number): Dm | error {
  const data = getData();

  // 1. check if token is valid
  const userId = tokenToUid(token);
  if (findUserWithId(data, userId) == null || validToken(token) === false) {
    return { error: 'invalid token' };
  }
  // 2. check if dmId is valid
  const dmToGet = findDmWithId(data, dmId);
  if (dmToGet == null) {
    return { error: 'invalid dmId' };
  }
  // 3. check if user is a member of the dm
  if (isUserDmMember(dmToGet, userId) === false) {
    return { error: 'user is not a member of the dm' };
  }
  // 4. return the details of the dm
  return dmToGet;
}

/**
 *
 * Remove an existing DM, so all members are no longer in the DM
 *
 * @param {string} token a token
 * @param {number} dmId the dmId of theb DM that we remove all its members
 * @returns {} nothing is returned if dmId is valid and the token is valid
 */
function dmRemoveV1(token: string, dmId: number): emptyObject | error {
  const data = getData();
  // 1. check if the token is valid
  const userId = tokenToUid(token);
  if (findUserWithId(data, userId) == null || validToken(token) === false) {
    return { error: 'invalid token' };
  }
  // 2. check if the dmId is valid
  const dmToRemove = findDmWithId(data, dmId);
  if (dmToRemove == null) {
    return { error: 'invalid dmId' };
  }
  // 3. check if the user is the owner of the dm
  if (dmToRemove.dmCreator.authUserId !== userId) {
    return { error: 'user is not the owner of the dm' };
  }
  // 4. remove the dm
  const dmIndex = getDmIndex(data, dmId);
  data.dms.splice(dmIndex, 1);
  return {};
}

/**
 *
 * Given a DM ID, the user is removed as a member of this DM.
 *
 * @param {object} LeaveInput that consists of:
 *  token: string;
 *  dmId: number;  dmId of the DM that we wnat to remove
 * @returns
 */
function dmLeaveV1(LeaveInput: dmLeaveInput): emptyObject | error {
  const data = getData();
  // 1. check if the token is valid
  const userId = tokenToUid(LeaveInput.token);
  if (findUserWithId(data, userId) == null || validToken(LeaveInput.token) === false) {
    return { error: 'invalid token' };
  }
  // 2. check if the dmId is valid
  const dmToLeave = findDmWithId(data, LeaveInput.dmId);
  if (dmToLeave == null) {
    return { error: 'invalid dmId' };
  }
  // 3. check if the user is a member of the dm
  if (isUserDmMember(dmToLeave, userId) === false) {
    return { error: 'user is not a member of the dm' };
  }
  // 4. remove the member from the dm
  let userIndex = 0;
  for (const members of dmToLeave.members) {
    if (members.authUserId === userId) {
      dmToLeave.members.splice(userIndex, 1);
      break;
    }
    userIndex++;
  }

  setData(data);

  return {};
}

/**
 *
 * Given a DM with ID dmId that the authorised user is a member of, return a message
 *
 * @param {string} token
 * @param {number} dmId dmId of the DM that we want to view its messages
 * @param start start index
 * @returns {messages: string, start: number, end: number} returns the messages in the DM with start being the most recent.
 * this is returned only when dmId is valid and start is greater than the total number of messages
 */
function dmMessagesV1(token: string, dmId: number, start: number): dmMessageReturn | error {
  const data = getData();
  // 1. checking if the dmId is valid
  const dmToGetMessages = findDmWithId(data, dmId);
  if (dmToGetMessages == null) {
    return { error: 'invalid dmId' };
  }
  // 2. checking if the token is valid
  const userId = tokenToUid(token);
  if (validToken(token) === false) {
    return { error: 'invalid token' };
  }
  // 3. checking if the user is a member of the dm
  if (isUserDmMember(dmToGetMessages, userId) === false) {
    return { error: 'user is not a member of the dm' };
  }
  // 4. checking if the start is lesser than the number of messages in the dm
  const dmMessageLength = dmToGetMessages.message.length;
  if (start > dmMessageLength) {
    return { error: 'start is greater than the number of messages in the dm' };
  }
  // 5. return the messages
  const messageArray = [];
  let end = 0;
  if (dmMessageLength - start > 50) {
    end = start + 50;
  } else {
    end = -1;
  }

  for (let i = start; i <= start + 50 && i < dmMessageLength; i++) {
    const messageReturn = dmToGetMessages.message[i];
    messageArray.unshift(messageReturn);
  }

  return {
    messages: messageArray,
    start: start,
    end: end
  };
}

export { dmCreateV1, dmListV1, dmDetailsV1, dmRemoveV1, dmLeaveV1, dmMessagesV1 };
