import { setData, getData } from './dataStore';
import { getChannelIndex, findChannelWithId, findUserWithId, isUserChannelMember, validToken, tokenToUid, isUserOwnerMember } from './helpers';
import { channelDetails, channelInvite, error, channelMessagesReturn, emptyObject } from './interface';

/**
 *
 * Given a channelId of a channel that the authorised user can join, adds them to that channel.
 *
 * @param {string} token
 * @param {number} channelId channelId that the authorised user want to join
 * @returns {} returns nothing when channelId is valid, authorised is not already a member of the channel
 * or the channelId refers to a private channel that the user is not a member of
 */
function channelJoinV2(token: string, channelId: number): emptyObject | error {
  const data = getData();

  // Find the user
  const userId = tokenToUid(token);
  const user = findUserWithId(data, userId);
  if (user === null) {
    return { error: "user doesn't exist" };
  }

  // Find the channel
  const channel = findChannelWithId(data, channelId);
  if (channel === null) {
    return { error: "channel doesn't exist" };
  }

  // Make sure channel is public
  if (channel.isPublic === false) {
    return { error: 'channel is private' };
  }

  // Make sure user hasn't joined
  if (isUserChannelMember(channel, userId) === true) {
    return { error: 'already a member' };
  }

  const channelIndex = getChannelIndex(data, channelId);

  // Add user to channel
  /* channel.allMembers.push({
    uId: user.authUserId,
    email: user.email,
    nameFirst: user.nameFirst,
    nameLast: user.nameLast,
    handleStr: user.handleStr,
  }); */

  data.channels[channelIndex].allMembers.push(
    {
      authUserId: user.authUserId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    }
  );

  // Save data
  setData(data);

  return {};
}

/**
 *
 * Given a channel with ID channelId that the authorised user is a member of, provide basic details about the channel.
 *
 * @param token
 * @param channelId the channelId of the channel we wnat to get details about
 * @returns { name: string, isPublic: boolean, ownerMembers: Array, allMembers: Array }
 * returns an object if the channelId is valid, token is valid and both the authorisedUser is a member of this channel
 */
function channelDetailsV2(token: string, channelId: number): channelDetails | error {
  const data = getData();

  // Find the user
  const userId = tokenToUid(token);
  const user = findUserWithId(data, userId);
  if (user === null) {
    return { error: "user doesn't exist" };
  }

  // Find the channel
  const channel = findChannelWithId(data, channelId);
  if (channel === null) {
    return { error: "channel doesn't exist" };
  }

  // Make sure user is a member
  if (isUserChannelMember(channel, userId) === false) {
    return { error: 'User is not a member of this channel' };
  }

  // return details
  const returnDetails = {
    name: channel.name,
    isPublic: channel.isPublic,
    ownerMembers: channel.ownerMembers,
    allMembers: channel.allMembers,
  };

  return returnDetails;
}

/**
 *
 * Invites a user with ID uId to join a channel with ID channelId. Once invited, the user is added to the channel immediately. In both public and private channels, all members are able to invite users.
 *
 * @param {string} token
 * @param {number} channelId the target channel's channelId
 * @param {number} uId the userId of the user that we wnat to invite
 * @returns {} must return nothing if channelId is valid, Uid is valid, uId and authuserId refers to a valid user and the token is valid
 */
function channelInviteV2 (token: string, channelId: number, uId: number): channelInvite | error {
  const data = getData();

  // The code below checks whether channelId is a valid channel.
  // If not return error per specification.
  const validChannelId = findChannelWithId(data, channelId);
  if (validChannelId === null) {
    return { error: 'Invalid channel' };
  }

  // Check whether uId and authuserId refers to a valid user.
  // If the user does exist then checkUId will be true.
  if (findUserWithId(data, uId) == null) {
    return { error: 'User ID is invalid' };
  }

  // Check whether the token is valid
  if (validToken(token) === false) {
    return { error: 'Invalid token' };
  }

  // Ensure uId is not a member of the channel.
  const channelIndex = getChannelIndex(data, channelId);
  const channelInvited = data.channels[channelIndex];
  if (isUserChannelMember(channelInvited, uId) === true) {
    return { error: 'User is already a member of the channel' };
  }

  // Ensure the user inviting is a member of the channel
  const invitingUserId = tokenToUid(token);
  if (isUserChannelMember(channelInvited, invitingUserId) === false) {
    return { error: 'Inviting user is not a member of the channel' };
  }

  // If everything is valid, input the new member.
  const userInvited = findUserWithId(data, uId);
  data.channels[channelIndex].allMembers.push(userInvited);

  setData(data);

  return {};
}

/**
 *
 * Given a channel with ID channelId that the authorised user is a member of, return up to 50 messages between index "start" and "start + 50". Message with index 0 is the most recent message in the channel.
 *
 * @param {string} token
 * @param {number} channelId the target channel's ChannelId
 * @param start start index
 * @returns { messages: string, start: number, end: number} must return this if  channelId is valid, start is greater than the total number of messages in the channel.
 * and the token is valid
 */
function channelMessagesV2(token: string, channelId: number, start: number): channelMessagesReturn | error {
  const data = getData();

  // Checking whether channelId refers to a valid channel.
  const validChannelId = findChannelWithId(data, channelId);
  if (validChannelId === null) {
    return { error: 'Invalid channel' };
  }

  // Checking whether start is greater than the total number of messages in the channel.
  // Remember to modify the dataStore.js file.

  let isGreater = false;
  const channelIndex = getChannelIndex(data, channelId);
  if (data.channels[channelIndex].message.length < start) {
    isGreater = true;
  }
  if (isGreater === true) {
    return { error: 'Start is greater than the total number of messages' };
  }

  // Checking if the user ID is valid

  const userId = tokenToUid(token);

  if (findUserWithId(data, userId) == null) {
    return { error: 'User ID is invalid' };
  }

  // If channel ID and user ID is valid,
  // Return error if authorised user is not a member of the channel.

  if (isUserChannelMember(data.channels[channelIndex], userId) === false) {
    return { error: 'User not a member of the channel' };
  }

  // Now is where we output the message array.
  // Write a for loop to cycle through the messages.
  const messageArray = [];

  let end = 0;

  if (data.channels[channelIndex].message.length - start < 50) {
    end = -1;
  } else if (data.channels[channelIndex].message.length - start > 50) {
    end = start + 50;
  }

  for (let i = start; i <= start + 50 && i < data.channels[channelIndex].message.length; i++) {
    const messageReturn = data.channels[channelIndex].message[i];
    messageArray.unshift(messageReturn);
  }

  return {
    messageArray,
    start,
    end,
  };
}

/**
 *
 * Given a channel with ID channelId that the authorised user is a member of, remove them as a member of the channel.
 *
 * @param {string} token
 * @param {number} channelId the traget channel's channelId
 * @returns {} returns nothing if channelId is valid, and the user associated to the token is a member of the channel
 */
function channelLeaveV1(token: string, channelId: number): emptyObject | error {
  const data = getData();
  // 1. check whether the channelId referes to a valid channel
  const userChannel = findChannelWithId(data, channelId);
  if (userChannel == null) {
    return { error: 'Invalid channel' };
  }

  // 2. check whether the token passed is valid
  const userId = tokenToUid(token);
  if (findUserWithId(data, userId) == null) {
    return { error: 'User ID is invalid' };
  }

  // 3. check whether the user associated with the token is a member of the channel, if true then remove user
  if (isUserChannelMember(userChannel, userId) === true) {
    // finding the user in both allMembers and ownerMembers array and removing them
    for (let i = 0; i < userChannel.allMembers.length; i++) {
      if (userChannel.allMembers[i].authUserId === userId) {
        userChannel.allMembers.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < userChannel.ownerMembers.length; i++) {
      if (userChannel.ownerMembers[i].authUserId === userId) {
        userChannel.ownerMembers.splice(i, 1);
        break;
      }
    }
    setData(data);
    return {};
  } else {
    return { error: 'User is not a member of the channel' };
  }
}

/**
 *
 * Make user with user id uId an owner of the channel.
 *
 * @param {string} token
 * @param {number} channelId channel that we want to addowner to
 * @param {number} uId userId of the user we wnat to make owner
 * @returns {} returns nothing if channelId is valid, token is valid, uId is valid, both users are a member of the channel,
 * and if user of the token is an owner and the uId user is not
 */
function channelAddOwnerV1(token: string, channelId: number, uId: number): emptyObject | error {
  const data = getData();
  // 1. check if the channelId refers to a valid channel
  const userChannel = findChannelWithId(data, channelId);
  if (userChannel == null) {
    return { error: 'Invalid channel' };
  }

  // 2. check if the token is valid
  const userId = tokenToUid(token);
  const addingOwner = findUserWithId(data, userId);
  if (addingOwner == null) {
    return { error: 'User ID of the token user is invalid' };
  }

  // 3. check if the uId is valid
  const invitedOwner = findUserWithId(data, uId);
  if (invitedOwner == null) {
    return { error: 'uId is invalid' };
  }

  // 4. check if both users are members of the channel
  if (isUserChannelMember(userChannel, userId) === false) {
    return { error: 'Adding user is not a member of the channel' };
  } else if (isUserChannelMember(userChannel, uId) === false) {
    return { error: 'user with uId is not a member of the channel' };
  }
  // 5. check if user of the token is an owner and the uId user is not

  const channelIndex = getChannelIndex(data, channelId);

  if (isUserOwnerMember(userChannel, userId) === true) {
    if (isUserOwnerMember(userChannel, uId) === false) {
      // 6. make uId user an owner
      data.channels[channelIndex].ownerMembers.push(invitedOwner);
    } else {
      return { error: 'user is already an owner' };
    }
  } else {
    return { error: 'user trying to add an owner is not an owner themselves' };
  }
  setData(data);
  console.log(data.channels[channelIndex].ownerMembers);
  return {};
}

/**
 *
 * Remove user with user id uId as an owner of the channel.
 *
 * @param token
 * @param channelId
 * @param uId
 * @returns
 */
function channelRemoveOwnerV1(token: string, channelId: number, uId: number): emptyObject | error {
  const data = getData();
  // 1. check if the channelId refers to a valid channel
  const userChannel = findChannelWithId(data, channelId);
  if (userChannel == null) {
    return { error: 'Invalid channel' };
  }
  // 2. check if the token is valid
  const userId = tokenToUid(token);
  const removingOwner = findUserWithId(data, userId);
  if (removingOwner == null) {
    return { error: 'User ID of the token user is invalid' };
  }
  // 3. check if the uId is valid
  const removedOwner = findUserWithId(data, uId);
  if (removedOwner == null) {
    return { error: 'uId is invalid' };
  }
  // 4. check if both users are owner members of the channel
  if (isUserOwnerMember(userChannel, userId) === false) {
    return { error: 'Removing user is not an owner hence does not have permissions' };
  }
  if (isUserOwnerMember(userChannel, uId) === false) {
    return { error: 'User to be removed from owner is not an owner to begin with' };
  }
  // 5. check if the remover and removee are not the same person
  //    because the only owner of the channel cannot be removed
  if (userId === uId) {
    return { error: 'Cannot remove the only owner of the channel' };
  }

  // 6. remove owner
  const channelIndex = getChannelIndex(data, channelId);
  for (let i = 0; i < userChannel.ownerMembers.length; i++) {
    if (userChannel.ownerMembers[i].authUserId === uId) {
      data.channels[channelIndex].ownerMembers.splice(i, 1);
      break;
    }
  }

  setData(data);

  return {};
}

export { channelJoinV2, channelDetailsV2, channelInviteV2, channelMessagesV2, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1 };
