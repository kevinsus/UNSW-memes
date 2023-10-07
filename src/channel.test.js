import { channelDetailsV1 } from './channel.js';
import { channelInviteV1 } from './channel.js';
import { authRegisterV1 } from './auth.js';
import { channelsCreateV1 } from './channels.js';
import { channelJoinV1 } from './channel.js';
import { channelMessagesV1 } from './channel.js';
import { clearV1 } from './other.js';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  clearV1();
});

// Test error cases
test('ChannelId is invalid', () => {
  const user = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks');
  const result = channelDetailsV1(user.authUserId, -1);
  expect(result).toStrictEqual(ERROR);
});

describe('channelDetailsV1', () => {
  // Tests for channelDetailsV1
  test('channelId is valid but authUser is not a member of the channel', () => {
    const user = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV1('someone1@example.com', '123456789', 'Matt', 'Lank');

    const channel = channelsCreateV1(user2.authUserId, 'Dream_team', true);
    const result = channelDetailsV1(user.authUserId, channel.channelId);
    expect(result).toStrictEqual(ERROR);
  });
  // Tests for channelDetailsV1
  test('authUserId is invalid', () => {
    const userId1 = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks').authUserId;
    const channel = channelsCreateV1(userId1, 'Tosi_team', true);
    const userId2 = authRegisterV1('someone1@example.com', '924856345', 'Jafar', 'Danesh').authUserId;
    const result = channelDetailsV1(userId2, channel.channelId);

    expect(result).toStrictEqual(ERROR);
  });

  // Tests for channelDetailsV1
  test('A user from another channel tries to access another channel', () => {
    const userId1 = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks').authUserId;

    channelsCreateV1(userId1, 'Tosi_team', true);

    const userId2 = authRegisterV1('someone1@example.com', '323y8931893', 'Jafar', 'Danesh').authUserId;

    const user2ChannelId = channelsCreateV1(userId2, 'Jafar_team', true).channelId;
    const result = channelDetailsV1(userId1, user2ChannelId);

    expect(result).toStrictEqual(ERROR);
  });
  test('Two users exist, One user creates a channel. Another user has also successfuly joined that channel.', () => {
    const userId1 = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks').authUserId;
    const user1ChannelId = channelsCreateV1(userId1, 'Tosi_team', true).channelId;

    const userId2 = authRegisterV1('someone1@example.com', '3238931893', 'Jafar', 'Danesh').authUserId;
    channelJoinV1(userId2, user1ChannelId);
    const result = channelDetailsV1(userId2, user1ChannelId);
    const expVal = {
      name: 'Tosi_team',
      isPublic: true,
      ownerMembers: [{ uId: userId1, email: 'someone@example.com', nameFirst: 'Robin', nameLast: 'Banks', handleStr: 'robinbanks' }],
      allMembers: [{ uId: userId1, email: 'someone@example.com', nameFirst: 'Robin', nameLast: 'Banks', handleStr: 'robinbanks' },
        { uId: userId2, email: 'someone1@example.com', nameFirst: 'Jafar', nameLast: 'Danesh', handleStr: 'jafardanesh' }]
    };
    expect(result).toStrictEqual(expVal);
  });
  // Tests without errors
  test('Both authUserId and ChannelId is valid', () => {
    const user = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks');
    const channel = channelsCreateV1(user.authUserId, 'Robin Channel', true);
    const result = channelDetailsV1(user.authUserId, channel.channelId);
    const userData = {
      uId: user.authUserId,
      email: 'someone@example.com',
      nameFirst: 'Robin',
      nameLast: 'Banks',
      handleStr: 'robinbanks',
    };
    expect(result).toStrictEqual({
      name: 'Robin Channel',
      isPublic: true,
      ownerMembers: [userData],
      allMembers: [userData],
    });
  });
});

describe('channelJoinV1', () => {
  // ChannelId is invalid
  test('channelId is invalid', () => {
    const user = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks');
    const result = channelJoinV1(user.authUserId, -1);
    expect(result).toStrictEqual(ERROR);
  });
  // authorised user tries to join channel that he's a member of
  test('the authorised user is already a member of the channel', () => {
    const userId = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks').authUserId;
    const userChannelId = channelsCreateV1(userId, 'Tosi_team', true).channelId;
    const result = channelJoinV1(userId, userChannelId);

    expect(result).toStrictEqual(ERROR);
  });
  // The channel the user wants to join is private and the authUser is not a member of the channel and he's also
  // not the global owner
  test('The channel the user wants to join is private and the authuser is not a member of the channel and he is also not the global owner', () => {
    const user1Id = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks').authUserId;
    const user1ChannelId = channelsCreateV1(user1Id, 'Tosi_team', false).channelId;
    const user2Id = authRegisterV1('someone1@example.com', '924856345', 'Jafar', 'Danesh').authUserId;
    const result = channelJoinV1(user2Id, user1ChannelId);

    expect(result).toStrictEqual(ERROR);
  });
  // AuthUserId is invalid
  test('authUserId is invalid', () => {
    authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV1('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user2Channel = channelsCreateV1(user2.authUserId, 'Jafar_team', true);
    const result = channelJoinV1(-1, user2Channel.channelId);
    expect(result).toStrictEqual(ERROR);
  });
  // Testing valid case where authUserId and ChannelId are valid
  test('authUserId and ChannelId are valid', () => {
    const user = authRegisterV1('someone@example.com', '924856345', 'Robin', 'Banks');
    const user1Channel = channelsCreateV1(user.authUserId, 'Tosi_team', true);
    const user2 = authRegisterV1('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const result = channelJoinV1(user2.authUserId, user1Channel.channelId);

    expect(result).toStrictEqual({});
  });
});

// tests for channelMessagesV1

describe('channelMessagesV1', () => {
  test('channelId Not Valid (channelId Not Found)', () => {
    const user = authRegisterV1('6502@unsw.edu.au', 'thingsIwonder', 'Daniel', 'Pizza');
    const channelId = channelsCreateV1(user.authUserId, 'channel_1', true);
    const start = 2;

    expect(channelMessagesV1(user.authUserId, channelId.channelId + 1, start)).toStrictEqual(
      ERROR
    );
  });
  test('channelId Not Valid (channelId array is empty)', () => {
    const user = authRegisterV1('z4564', 'new_password.js', 'Michael', 'Cooper');
    const start = 1;

    expect(channelMessagesV1(user, 4, start)).toStrictEqual(
      ERROR
    );
  });
  test('channelId Not Valid (Channel Not Integer)', () => {
    const user = authRegisterV1('z6657@unsw.edu.au', 'ppqojnmd09878', 'Steve', 'Jobs');
    const channelId = channelsCreateV1(user, 'channel_2', true);
    const start = 1;

    expect(channelMessagesV1(user, 'fjdei9' + channelId + 'fdfd', start)).toStrictEqual(
      ERROR
    );
  });
  test('When start is greater than the Total Number of Messages', () => {
    const user = authRegisterV1('z4567@unsw.edu.au', 'djdjkldfjk', 'Andy', 'Paper');
    const channelId = channelsCreateV1(user, 'channel_3', true);
    const start = 50;

    expect(channelMessagesV1(user, channelId, start)).toStrictEqual(
      ERROR
    );
  });
  test('When channelId valid, but authUser is Not a Member', () => {
    const user = authRegisterV1('z7892@unsw.edu.au', '21uudf99aw', 'Andrew', 'Mabey');
    const channelId = channelsCreateV1(user, 'channel_4', true);
    const authUserIdNotInChannel = authRegisterV1('z2797@unsw.edu.au', 'fdwa45645', 'This', 'Kid');
    const start = 1;

    expect(channelMessagesV1(authUserIdNotInChannel, channelId, start)).toStrictEqual(
      ERROR
    );
  });
  test('When authUserId does not exist', () => {
    const user = authRegisterV1('z2847@unsw.edu.au', 'f5d525f', 'Computer', 'Keyboard');
    const channelId = channelsCreateV1(user, 'channel_5', true);
    const start = 1;

    let invalidAuthUserId = 1;
    if (invalidAuthUserId === user) {
      invalidAuthUserId += 2;
    }

    expect(channelMessagesV1(invalidAuthUserId, channelId, start)).toStrictEqual(
      ERROR
    );
  });
  test('When authUserId is not an integer', () => {
    const user = authRegisterV1('z7938@unsw.edu.au', 'qiuhiouds47894', 'White', 'Board');
    const channelId = channelsCreateV1(user, 'channel_6', true);
    const start = 1;

    expect(channelMessagesV1('string' + user, channelId, start)).toStrictEqual(
      ERROR
    );
  });
});

// tests for channelInviteV1

describe('Testing Invalid channelId (Public)', () => {
  test('channelId not Valid (channelId not found)', () => {
    const user1 = authRegisterV1('z3399@unsw.edu.au', 'qwertyuiop', 'Jane', 'Citizen');
    const user2 = authRegisterV1('z4455@unsw.edu.au', '^U-zL7uFyr`_#jX$', 'John', 'Citizen');
    const channel = channelsCreateV1(user1, 'channel_1', true);

    let invalidChannelId = 1;

    if (invalidChannelId === channel) {
      invalidChannelId += 2;
    }

    expect(channelInviteV1(user1, invalidChannelId, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('channelId not Valid (channelId array is empty)', () => {
    const user1 = authRegisterV1('z1234@unsw.edu.au', 'interesting', 'Jack', 'Bongo');
    const user2 = authRegisterV1('z8542@unsw.edu.au', '456789', 'Emily', 'String');

    expect(channelInviteV1(user1, 4, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('channelId not Valid (channelId not an integer)', () => {
    const user1 = authRegisterV1('z8789@unsw.edu.au', '123456', 'Patrick', 'String');
    const user2 = authRegisterV1('z3615@unsw.edu.au', '63987', 'Patricia', 'Bongo');
    const channel = channelsCreateV1(user1, 'channel_2', true);

    expect(channelInviteV1(user1, 'clavier' + channel + 'string', user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('channelId not Valid (channelId not found)', () => {
    const user1 = authRegisterV1('6502@unsw.edu.au', 'thingsIwonder', 'Daniel', 'Pizza');
    const user2 = authRegisterV1('z8423@unsw.edu.au', 'passwordpassword', 'Jess', 'Cooper');
    const channel = channelsCreateV1(user1, 'channel_3', false);

    let invalidChannelId = 1;
    if (invalidChannelId === channel) {
      invalidChannelId += 2;
    }

    expect(channelInviteV1(user1, invalidChannelId, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('channelId not Valid (channelId array is empty)', () => {
    const user1 = authRegisterV1('z8248@unsw.edu.au', 'cmnmeodmn007', 'Bill', 'Gates');
    const user2 = authRegisterV1('z6657@unsw.edu.au', 'ppqojnmd09878', 'Steve', 'Jobs');

    expect(channelInviteV1(user1, 4, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('channelId not Valid (channelId not an integer)', () => {
    const user1 = authRegisterV1('z4405@unsw.edu.au', 'kmnfewhij876', 'Tim', 'Cook');
    const user2 = authRegisterV1('z3186@unsw.edu.au', 'kfkldlk63987', 'Linus', 'Trovold');
    const channel = channelsCreateV1(user1, 'channel_4', false);

    expect(channelInviteV1(user1, 'clavier' + channel + '.', user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('uId not Valid (uId not found)', () => {
    const user1 = authRegisterV1('z3919@unsw.edu.au', 'thisuejumn882', 'Plato', 'Flute');
    const user2 = authRegisterV1('z8954@unsw.edu.au', 'jkfolsjklfsa001', 'Bianca', 'Kora');
    const channel = channelsCreateV1(user1, 'channel_5', true);

    let invalidId = 1;
    if (invalidId === user2) {
      invalidId += 2;
    }
    expect(channelInviteV1(user1, channel, invalidId)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('uId not Valid (uId not an integer)', () => {
    const user1 = authRegisterV1('z5132@unsw.edu.au', 'djfkfiqop720', 'Mercury', 'Board');
    const user2 = authRegisterV1('z8881@unsw.edu.au', 'jcmmmvlll274', 'Venus', 'Earth');
    const channel = channelsCreateV1(user1, 'channel_6', true);

    expect(channelInviteV1(user1, channel, 'something' + user2 + 'this')).toStrictEqual(
      { error: 'error' }
    );
  });
  test('uId not valid (uId already exists in the channel)', () => {
    const user = authRegisterV1('z6548@unsw.edu.au', 'djdkfj179', 'Andrew', 'Bell');
    const channel = channelsCreateV1(user, 'channel_7', true);

    expect(channelInviteV1(user, channel, user)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('uId not Valid (uId not found)', () => {
    const user1 = authRegisterV1('z5854@unsw.edu.au', 'qwerjnb89', 'Samuel', 'Ethan');
    const user2 = authRegisterV1('z6728@unsw.edu.au', 'gjcfgtei893554', 'Dennis', 'Ritchie');
    const channel = channelsCreateV1(user1, 'channel_8', false);

    let invalidId = 1;
    if (invalidId === user2) {
      invalidId += 2;
    }

    expect(channelInviteV1(user1, channel, invalidId)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('uId not Valid (uId not an integer)', () => {
    const user1 = authRegisterV1('z1689@unsw.edu.au', 'jfjmmesppwl99463', 'Jonana', 'Chem');
    const user2 = authRegisterV1('z4421@unsw.edu.au', 'kmasywiet79963', 'Anna', 'Torque');
    const channel = channelsCreateV1(user1, 'channel_9', false);

    expect(channelInviteV1(user1, channel, 'something' + user2 + 'end')).toStrictEqual(
      { error: 'error' }
    );
  });
  test('uId not valid (uId already exists in the channel)', () => {
    const user = authRegisterV1('z1642@unsw.edu.au', 'J3Vx1jWJ5QgW2WapDPxX', 'Emilia', 'Hills');
    const channel = channelsCreateV1(user, 'channel_10', false);

    expect(channelInviteV1(user, channel, user)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('authUserId Not a Member of Channel', () => {
    const user1 = authRegisterV1('z4724@unsw.edu.au', 'tToZfWjTJXAuubta2yJp', 'Andre', 'Andrews');
    const user2 = authRegisterV1('z8121@unsw.edu.au', '50THqkTvDi7XWCT3ZAGa', 'Amanda', 'Power');
    const channel = channelsCreateV1(user1, 'channel_11', true);
    const authUserIdNotInChannel = authRegisterV1('z5712@unsw.edu.au', 'fdjdhlap1', 'chrome', 'firefox');

    expect(channelInviteV1(authUserIdNotInChannel, channel, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('authUserId Not Found', () => {
    const user1 = authRegisterV1('z4567@unsw.edu.au', 'djdjkldfjkl', 'Andy', 'Paper');
    const user2 = authRegisterV1('z9255@unsw.edu.au', 'dkefiofeio0', 'Kevin', 'Basketball');
    const channel = channelsCreateV1(user1, 'My channel', true);

    let invalidAuthUserId = 1;
    if (invalidAuthUserId === user1) {
      invalidAuthUserId += 2;
    }

    expect(channelInviteV1(invalidAuthUserId, channel, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('authUserId Wrong Type', () => {
    const user1 = authRegisterV1('z5761@unsw.edu.au', 'djdjkldfjkl', 'Andy', 'Paper');
    const user2 = authRegisterV1('z4567@unsw.edu.au', 'dkefiofeio0', 'Kevin', 'Basketball');
    const channel = channelsCreateV1(user1, 'My channel', true);

    expect(channelInviteV1('12' + user1 + '13', channel, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('authUserId Not a Member of Channel', () => {
    const user1 = authRegisterV1('z8468@unsw.edu.au', 'ewyrtiyuy1834', 'Brian', 'Unsw');
    const user2 = authRegisterV1('z3678@unsw.edu.au', 'vcnmx009', 'Stephene', 'Windsor');
    const channel = channelsCreateV1(user1, 'New Channel', false);
    const authUserIdNotInChannel = authRegisterV1('z4255@unsw.edu.au', 'yreouw9899', 'Elizabeth', 'Picton');

    expect(channelInviteV1(authUserIdNotInChannel, channel, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('authUserId Not Found', () => {
    const user1 = authRegisterV1('z8708@unsw.edu.au', 'ugheysmnx6702', 'Mark', 'Picture');
    const user2 = authRegisterV1('z0406@unsw.edu.au', 'nmxzks9357', 'Chris', 'Soccer');
    const channel = channelsCreateV1(user1, 'My channel', false);

    let invalidAuthUserId = 1;
    if (invalidAuthUserId === user1) {
      invalidAuthUserId += 2;
    }

    expect(channelInviteV1(invalidAuthUserId, channel, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
  test('authUserId Wrong Type', () => {
    const user1 = authRegisterV1('z1695@unsw.edu.au', 'ertkfhn5787', 'May', 'Powell');
    const user2 = authRegisterV1('z4567@unsw.edu.au', 'dkefiofeio4109', 'Sean', 'Paris');
    const channel = channelsCreateV1(user1, 'Boring channel', false);

    expect(channelInviteV1('this' + user1 + 'fun', channel, user2)).toStrictEqual(
      { error: 'error' }
    );
  });
});
