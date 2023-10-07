// Importing data
import { getData } from './dataStore';

// Convert tokens into authUserId
export function tokenToUid (token) {
  const data = getData();
  let authUserId = null;

  for (const person of data.sessions) {
    if (person.token === token) {
      authUserId = person.authUserId;
      break;
    }
  }
  return authUserId;
}

// check validUid
export function validUid (authUserId) {
  const data = getData();

  for (const user of data.users) {
    if (user.authUserId === authUserId) {
      return true;
    }
  }
  return false;
}

// check validToken
export function validToken (token) {
  const data = getData();

  for (const user of data.sessions) {
    if (user.token === token) {
      return true;
    }
  }
  return false;
}

export function getChannelIndex(data, channelId) {
  let channelIndex = 0;
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      return channelIndex;
    }
    channelIndex++;
  }
}

export function findChannelWithId(data, channelId) {
  let channel = null;
  for (const c of data.channels) {
    if (c.channelId === channelId) {
      channel = c;
    }
  }
  return channel;
}

export function findUserWithId(data, authUserId) {
  for (const u of data.users) {
    if (u.authUserId === authUserId) {
      return u;
    }
  }
  return null;
}

export function isUserChannelMember(channel, authUserId) {
  for (const u of channel.allMembers) {
    if (u.authUserId === authUserId) {
      return true;
    }
  }
  return false;
}

export function isUserOwnerMember(channel, authUserId) {
  for (const u of channel.ownerMembers) {
    if (u.authUserId === authUserId) {
      return true;
    }
  }
  return false;
}

export function findDmWithId(data, dmId) {
  for (const eachDm of data.dms) {
    if (eachDm.dmId === dmId) {
      return eachDm;
    }
  }
  return null;
}

export function isUserDmMember(dm, authUserId) {
  for (const member of dm.members) {
    if (member.authUserId === authUserId) {
      return true;
    }
  }
  return false;
}

export function getDmIndex(data, dmId) {
  let dmIndex = 0;
  for (const dm of data.dms) {
    if (dm.dmId === dmId) {
      return dmIndex;
    }
    dmIndex++;
  }
}

export function getMessageFromId(data, messageId) {
  // Since messageId is very unique, loop throught every channels or dm finding the messageId
  for (const channels of data.channels) {
    for (const messages of channels.messages) {
      if (messages.messageId === messageId) {
        return messages;
      }
    }
  }
  for (const dms of data.dms) {
    for (const messages of dms.messages) {
      if (messages.messageId === messageId) {
        return messages;
      }
    }
  }
  return null;
}

export function getMessageIndexFromId(data, messageId) {
  let messageIndex = 0;
  let channelsIndex = 0;
  const channelUsed = true;
  let dmsIndex = 0;
  const dmsUsed = true;
  for (const channels of data.channels) {
    for (const messages of channels.messages) {
      if (messages.messageId === messageId) {
        return { messageIndex, channelsIndex, channelUsed };
      }
      messageIndex++;
    }
    channelsIndex++;
  }
  messageIndex = 0;
  for (const dms of data.dms) {
    for (const messages of dms.messages) {
      if (messages.messageId === messageId) {
        return { messageIndex, dmsIndex, dmsUsed };
      }
      messageIndex++;
    }
    dmsIndex++;
  }
  return null;
}

export function isOwnerChannel(data, authUserId) {
  for (const c of data.channels) {
    for (const u of c.ownerMembers) {
      if (u.authUserId === authUserId) {
        return true;
      }
    }
  }
  return false;
}

export function isDmCreator(data, authUserId) {
  for (const d of data.dms) {
    for (const u of d.dmCreator) {
      if (u.authUserId === authUserId) {
        return true;
      }
    }
  }
  return false;
}
