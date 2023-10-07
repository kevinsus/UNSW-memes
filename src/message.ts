import { getData, setData } from './dataStore';
import {
  validToken, findChannelWithId, tokenToUid, isUserChannelMember, findDmWithId, isUserDmMember,
  getMessageFromId, findUserWithId, isOwnerChannel, isDmCreator,
  getMessageIndexFromId
} from './helpers';
import { messageSend, error, messageSendDmInput, messageSendDmReturn, emptyObject } from './interface';

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @param {number} uId - User Id of a person
  * @returns { uId: number, email: string, nameFirst: string, nameLast: string,
  * handleStr: string } - authUserId and uId must be valid for this return
*/

export function messageSendV1(token: string, channelId: number, message: string): messageSend | error {
  const data = getData();
  const authUserId = tokenToUid(token);

  if (validToken(token) === false) {
    return { error: 'error invalid token' };
  }
  if (message.length < 1 || message.length > 1000) {
    return { error: 'error - message length' };
  }

  const channel = findChannelWithId(data, channelId);
  if (channel === null) {
    return { error: 'error invalid channelId' };
  }
  if (isUserChannelMember(channel, authUserId) === false) {
    return { error: 'person is not a member of the channel' };
  }

  const messageId = authUserId + channelId + 21 * 3;
  const messageInput = {
    messageId: messageId,
    uId: authUserId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000),
  };

  channel.messages.push(messageInput);
  setData(data);

  return { messageId };
}
/**
 *
 * Function sends a DM message from an authorisedUserId to the DM specified by the dmId
 *
 * @param {object} sendDmInput this consists of :
    * {string} token random token
    * {number} dmId this is the id of the DM that we want to send a message to
    * {string} message this is actual message we want to send
 * @returns { messageId } dmId, Token and Message must be valid for this return value
 */
export function messageSendDmV1(sendDmInput: messageSendDmInput): messageSendDmReturn | error {
  const data = getData();
  // 1. check if the dmId is valid
  const dmToSend = findDmWithId(data, sendDmInput.dmId);
  if (dmToSend === null) {
    return { error: 'invalid dmid' };
  }
  // 2. check if the token is valid
  const userId = tokenToUid(sendDmInput.token);
  if (validToken(sendDmInput.token) === false) {
    return { error: 'invalid token' };
  }
  // 3. check if the user is a member of the dm
  if (isUserDmMember(dmToSend, userId) === false) {
    return { error: 'user is not a member of the dm' };
  }
  // 4. check if the length of the message is valid
  if (sendDmInput.message.length < 1 || sendDmInput.message.length > 1000) {
    return { error: 'error - message length is invalid' };
  }
  // 5. send the dm
  const messageToSend = {
    messageId: userId + sendDmInput.dmId + 21 * 3,
    uId: userId,
    message: sendDmInput.message,
    timeSent: Math.floor(Date.now() / 1000),
  };

  dmToSend.messages.push(messageToSend);
  setData(data);
  console.log(dmToSend);

  return { messageId: messageToSend.messageId };
}

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @param {number} uId - User Id of a person
  * @returns {uId: number, email: string, nameFirst: string, nameLast: string,
* handleStr: string} - authUserId and uId must be valid for this return
*/

export function messageEditV1(token: string, messageId: number, message: string): emptyObject | error {
  const data = getData();
  const authUserId = tokenToUid(token);

  if (!validToken(token)) {
    return { error: 'error invalid token' };
  }
  if (message.length > 1000) {
    return { error: 'error - message length is greater than 1000' };
  }

  // This will return the message object that contain the messageId in either channels[] or dms[]
  const messages = getMessageFromId(data, messageId);
  if (messages === null) {
    return { error: 'error - messageId does not refer to a valid message' };
  }

  const user = findUserWithId(data, authUserId);

  if (messages.uId === authUserId) {
    // If the person is the sender
    messages.message = message;
  } else if (user.globalPermission === 1 || isOwnerChannel(data, authUserId) || isDmCreator(data, authUserId)) {
    // If the person is not, but they are the owner
    messages.message = message;
  } else {
    return { error: 'error - the message was not sent by the authorised user or they have any persmissions' };
  }

  setData(data);

  return {};
}

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @param {number} uId - User Id of a person
  * @returns {uId: number, email: string, nameFirst: string, nameLast: string,
* handleStr: string} - authUserId and uId must be valid for this return
*/

export function messageRemoveV1(token: string, messageId: number): emptyObject | error {
  const data = getData();
  const authUserId = tokenToUid(token);
  const messages = getMessageFromId(data, messageId);
  const messageIndex = getMessageIndexFromId(data, messageId);
  const user = findUserWithId(data, authUserId);

  if (!validToken(token)) {
    return { error: 'error invalid token' };
  }
  if (messages === null) {
    return { error: 'error - messageId does not refer to a valid message' };
  }

  if (messages.uId === authUserId) {
    // If the person is the sender
    if (messageIndex.channelUsed) {
      data.channels[messageIndex.channelsIndex].messages.splice(messageIndex.messageIndex, 1);
    }
    if (messageIndex.dmsUsed) {
      data.dms[messageIndex.dmsIndex].messages.splice(messageIndex.messageIndex, 1);
    }
  } else if (user.globalPermission === 1 || isOwnerChannel(data, authUserId) || isDmCreator(data, authUserId)) {
    // If the person is not, but they are the owner
    if (messageIndex.channelUsed) {
      data.channels[messageIndex.channelsIndex].messages.splice(messageIndex.messageIndex, 1);
    }
    if (messageIndex.dmsUsed) {
      data.dms[messageIndex.dmsIndex].messages.splice(messageIndex.messageIndex, 1);
    }
  } else {
    return { error: 'error - the message was not sent by the authorised user or they have any persmissions' };
  }

  // if (messages.uId === authUserId) {
  //   // If the person is the sender
  //   let channelIndex = getChannelIndex(data, messageId);
  //   let dmsIndex = getDmsIndex(data, messageId);
  //   if (channelIndex !== null) {
  //     data.channels[channelIndex].messages.splice(messageIndex, 1);
  //   } else {
  //     data.dms[dmsIndex].messages.splice(messageIndex, 1);
  //   }
  // } else if (user.globalPermission === 1 || isOwnerChannel(data, authUserId) || isDmCreator(data, authUserId)) {
  //   // If the person is not, but they are the owner
  //   let channelIndex = getChannelIndex(data, messageId);
  //   let dmsIndex = getDmsIndex(data, messageId);
  //   if (channelIndex !== null) {
  //     data.channels[channelIndex].messages.splice(messageIndex, 1);
  //   } else {
  //     data.dms[dmsIndex].messages.splice(messageIndex, 1);
  //   }

  // } else {
  //   return { error: 'error - the message was not sent by the authorised user or they have any persmissions' };
  // }

  setData(data);

  return {};
}
