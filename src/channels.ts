// import { Channel } from 'diagnostics_channel';
import { getData, setData } from './dataStore';
import { createChannels, error, Channel, listChannels, listAllChannels, Channels } from './interface';
import { tokenToUid, validToken } from './helpers';

/**
  * The function will take authUserId, name, isPublic
  * What it create:
  * >  inputting all the user's detail, name, owner's channel and all members
  *    for the given channels
  * >  channelId - just a random number
  * >  check errors
  *
  * @param {integer} authUserId - the userId obtained from registering
  * @param {string} name - the user's name
  * @param {boolean} isPublic - channels will be public or private
  * ...
  *
  * @returns {integer} - channelId, which is the id of the channel created
*/

export function channelsCreateV2 (token: string, name: string, isPublic: boolean): createChannels | error {
  const data = getData();
  let result = false;
  let userIndex = 0;

  const authUserId = tokenToUid(token);

  for (let i = 0; i < data.users.length; i++) {
    if (authUserId === data.users[i].authUserId) {
      result = true;
      userIndex = i;
      break;
    }
  }

  if (result === false) {
    return { error: 'No authUserId matched' };
  }
  if (name.length < 1 || name.length > 20) {
    return { error: 'Length is not between 1 to 20' };
  }

  const channelId = data.channels.length * 2 + 221;

  const channelsInput: Channel = {
    channelId: channelId,
    name: name,
    isPublic: isPublic,
    ownerMembers: [
      {
        authUserId: data.users[userIndex].authUserId,
        email: data.users[userIndex].email,
        nameFirst: data.users[userIndex].nameFirst,
        nameLast: data.users[userIndex].nameLast,
        handleStr: data.users[userIndex].handleStr,
      }
    ],
    allMembers: [
      {
        authUserId: data.users[userIndex].authUserId,
        email: data.users[userIndex].email,
        nameFirst: data.users[userIndex].nameFirst,
        nameLast: data.users[userIndex].nameLast,
        handleStr: data.users[userIndex].handleStr,
      }
    ],

    messages: [
    ],

  };
  data.channels.push(channelsInput);
  setData(data);

  return { channelId };
}

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @returns {channelId: number, channelName: string} - authUserId must be valid
  * for the return
*/

export function channelsListV2(token: string): listChannels | error {
  const data = getData();

  // ERROR CHECK
  if (validToken(token) === false) {
    return { error: 'error invalid token' };
  }

  // VALID CASE
  const authUserId = tokenToUid(token);

  const channels = [];
  for (const channel of data.channels) {
    for (const members of channel.allMembers) {
      if (members.authUserId === authUserId) {
        const channelInfo = {
          channelId: channel.channelId,
          name: channel.name
        };
        channels.push(channelInfo);
      }
    }
  }

  return { channels };
}

/**
  * Function takes in authUserId and returns an array of all channels
  *
  * @param {number} authUserId - User Id of the person running the function
  * @returns {channelId: number, channelName: string} - authUserId must be valid
  * for the return
*/

export function channelsListAllV2(token: string): listAllChannels | error {
  const data = getData();

  // ERROR CHECK
  if (validToken(token) === false) {
    return { error: 'error invalid token' };
  }

  // VALID CASE
  const channels: Channels[] = [];

  if (data.channels.length === 0) {
    return { channels };
  }
  for (const channel of data.channels) {
    const channelInfo = {
      channelId: channel.channelId,
      name: channel.name
    };
    channels.push(channelInfo);
  }
  return { channels };
}
