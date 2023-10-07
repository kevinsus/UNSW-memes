import { clear, channelDetailsV2, channelJoinV2, authRegisterV2, channelsCreateV2, channelInviteV2, channelMessagesV2, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1 } from './helperTest';

const ERROR = { error: expect.any(String) };
const CHANNELDETAILS = {
  name: expect.any(String),
  isPublic: expect.any(Boolean),
  ownerMembers: expect.any(Array),
  allMembers: expect.any(Array),
};

// ========================================================================= //

beforeEach(clear);

describe('/clear', () => {
  test('Return empty', () => {
    expect(clear()).toStrictEqual({});
  });
});

// tests for channelJoinV2

describe('channelJoinV2', () => {
  test('channelId is invalid', () => {
    const user = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const result = channelJoinV2(user.token, -1);
    expect(result).toStrictEqual(ERROR);
  });
  test('the authorised user is already a member of the channel', () => {
    const user = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const userChannel = channelsCreateV2(user.token, 'Tosi_team', true);
    const result = channelJoinV2(user.token, userChannel.channelId);
    expect(result).toStrictEqual(ERROR);
  });
  test('The channel the user wants to join is private and the authuser is not a member of the channel and he is also not the global owner', () => {
    const user1Id = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user1Channel = channelsCreateV2(user1Id.token, 'Tosi_team', false);
    const user2Id = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const result = channelJoinV2(user2Id.token, user1Channel.channelId);
    expect(result).toStrictEqual(ERROR);
  });
  // AuthUserId is invalid
  test('authUserId is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user2Channel = channelsCreateV2(user2.token, 'Jafar_team', true);
    const result = channelJoinV2(user1.token + 1, user2Channel.channelId);
    expect(result).toStrictEqual(ERROR);
  });
  // Testing valid case where authUserId and ChannelId are valid
  test('authUserId and ChannelId are valid', () => {
    const user = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user1Channel = channelsCreateV2(user.token, 'Tosi_team', true);
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const result = channelJoinV2(user2.token, user1Channel.channelId);
    expect(result).toStrictEqual({});
  });
});

// tests for channelDetails

describe('channelDetailsV2', () => {
  // Tests for channelDetailsV2
  test('channelId is valid but authUser is not a member of the channel', () => {
    const user = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '123456789', 'Matt', 'Lank');

    const channel = channelsCreateV2(user2.authUserId, 'Dream_team', true);
    const result = channelDetailsV2(user.authUserId, channel.channelId);
    expect(result).toStrictEqual(ERROR);
  });
  // Tests for channelDetailsV2
  test('authUserId is invalid', () => {
    const userId1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks').authUserId;
    const channel = channelsCreateV2(userId1, 'Tosi_team', true);
    const userId2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh').authUserId;
    const result = channelDetailsV2(userId2, channel.channelId);

    expect(result).toStrictEqual(ERROR);
  });

  // Tests for channelDetailsV2
  test('A user from another channel tries to access another channel', () => {
    const userId1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks').authUserId;

    channelsCreateV2(userId1, 'Tosi_team', true);

    const userId2 = authRegisterV2('someone1@example.com', '323y8931893', 'Jafar', 'Danesh').authUserId;

    const user2ChannelId = channelsCreateV2(userId2, 'Jafar_team', true).channelId;
    const result = channelDetailsV2(userId1, user2ChannelId);

    expect(result).toStrictEqual(ERROR);
  });
  test('Returned object is of correct type', () => {
    const validUser1 = (authRegisterV2('validEmail123@gmail.com', 'validPassword123!', 'John', 'Snow'));
    const validChannel1 = channelsCreateV2(validUser1.token, 'COMP1531', true);
    expect(channelDetailsV2(validUser1.token, validChannel1.channelId)).toStrictEqual(CHANNELDETAILS);
  });
  // Tests without errors
});

// tests for channel invite

describe('channelInviteV2 tests', () => {
  test('channelId not Valid (channelId not found)', () => {
    const user1 = authRegisterV2('z3399@unsw.edu.au', 'qwertyuiop', 'Jane', 'Citizen');
    const user2 = authRegisterV2('z4455@unsw.edu.au', '^U-zL7uFyr`_#jX$', 'John', 'Citizen');
    const channel = channelsCreateV2(user1.token, 'our_channel', true);
    expect(channelInviteV2(user1.token, channel.channelId + 1, user2.authUserId)).toStrictEqual(ERROR);
  });
  test('channelId not Valid (channelId array is empty)', () => {
    const user1 = authRegisterV2('z1234@unsw.edu.au', 'interesting', 'Jack', 'Bongo');
    const user2 = authRegisterV2('z8542@unsw.edu.au', '456789', 'Emily', 'String');
    expect(channelInviteV2(user1.token, 4, user2)).toStrictEqual(ERROR);
  });
  test('channelId not Valid (channelId not an integer)', () => {
    const user1 = authRegisterV2('z8789@unsw.edu.au', '123456', 'Patrick', 'String');
    const user2 = authRegisterV2('z3615@unsw.edu.au', '63987', 'Patricia', 'Bongo');
    let channel = channelsCreateV2(user1, 'channel_2', true);

    expect(channelInviteV2(user1.token, channel += 3, user2)).toStrictEqual(ERROR);
  });
  test('channelId not Valid (channelId not found)', () => {
    const user1 = authRegisterV2('6502@unsw.edu.au', 'thingsIwonder', 'Daniel', 'Pizza');
    const user2 = authRegisterV2('z8423@unsw.edu.au', 'passwordpassword', 'Jess', 'Cooper');
    const channel = channelsCreateV2(user1, 'channel_3', false);
    let invalidChannelId = 1;
    if (invalidChannelId === channel) {
      invalidChannelId += 2;
    }
    expect(channelInviteV2(user1.token, invalidChannelId, user2)).toStrictEqual(ERROR);
  });
  test('channelId not Valid (channelId array is empty)', () => {
    const user1 = authRegisterV2('z8248@unsw.edu.au', 'cmnmeodmn007', 'Bill', 'Gates');
    const user2 = authRegisterV2('z6657@unsw.edu.au', 'ppqojnmd09878', 'Steve', 'Jobs');
    expect(channelInviteV2(user1.token, 4, user2)).toStrictEqual(ERROR);
  });
  test('channelId not Valid (channelId not an integer)', () => {
    const user1 = authRegisterV2('z4405@unsw.edu.au', 'kmnfewhij876', 'Tim', 'Cook');
    const user2 = authRegisterV2('z3186@unsw.edu.au', 'kfkldlk63987', 'Linus', 'Trovold');
    let channel = channelsCreateV2(user1, 'channel_4', false);
    expect(channelInviteV2(user1.token, channel += 5, user2)).toStrictEqual(ERROR);
  });
  test('uId not Valid (uId not found)', () => {
    const user1 = authRegisterV2('z3919@unsw.edu.au', 'thisuejumn882', 'Plato', 'Flute');
    const user2 = authRegisterV2('z8954@unsw.edu.au', 'jkfolsjklfsa001', 'Bianca', 'Kora');
    const channel = channelsCreateV2(user1, 'channel_5', true);
    let invalidId = 1;
    if (invalidId === user2) {
      invalidId += 2;
    }
    expect(channelInviteV2(user1.token, channel, invalidId)).toStrictEqual(ERROR);
  });
  test('uId not Valid (uId not an integer)', () => {
    const user1 = authRegisterV2('z5132@unsw.edu.au', 'djfkfiqop720', 'Mercury', 'Board');
    let user2 = authRegisterV2('z8881@unsw.edu.au', 'jcmmmvlll274', 'Venus', 'Earth');
    const channel = channelsCreateV2(user1, 'channel_6', true);
    expect(channelInviteV2(user1.token, channel, user2 += 1)).toStrictEqual(ERROR);
  });
  test('uId not valid (uId already exists in the channel)', () => {
    const user = authRegisterV2('z6548@unsw.edu.au', 'djdkfj179', 'Andrew', 'Bell');
    const channel = channelsCreateV2(user, 'channel_7', true);
    expect(channelInviteV2(user.token, channel, user)).toStrictEqual(ERROR);
  });
  test('uId not Valid (uId not found)', () => {
    const user1 = authRegisterV2('z5854@unsw.edu.au', 'qwerjnb89', 'Samuel', 'Ethan');
    const user2 = authRegisterV2('z6728@unsw.edu.au', 'gjcfgtei893554', 'Dennis', 'Ritchie');
    const channel = channelsCreateV2(user1, 'channel_8', false);
    let invalidId = 1;
    if (invalidId === user2) {
      invalidId += 2;
    }
    expect(channelInviteV2(user1.token, channel, invalidId)).toStrictEqual(ERROR);
  });
  test('uId not Valid (uId not an integer)', () => {
    const user1 = authRegisterV2('z1689@unsw.edu.au', 'jfjmmesppwl99463', 'Jonana', 'Chem');
    let user2 = authRegisterV2('z4421@unsw.edu.au', 'kmasywiet79963', 'Anna', 'Torque');
    const channel = channelsCreateV2(user1, 'channel_9', false);
    expect(channelInviteV2(user1.token, channel, user2 += 10)).toStrictEqual(ERROR);
  });
  test('uId not valid (uId already exists in the channel)', () => {
    const user = authRegisterV2('z1642@unsw.edu.au', 'J3Vx1jWJ5QgW2WapDPxX', 'Emilia', 'Hills');
    const channel = channelsCreateV2(user, 'channel_10', false);
    expect(channelInviteV2(user.token, channel, user)).toStrictEqual(ERROR);
  });
  test('authUserId Not a Member of Channel', () => {
    const user1 = authRegisterV2('z4724@unsw.edu.au', 'tToZfWjTJXAuubta2yJp', 'Andre', 'Andrews');
    const user2 = authRegisterV2('z8121@unsw.edu.au', '50THqkTvDi7XWCT3ZAGa', 'Amanda', 'Power');
    const channel = channelsCreateV2(user1, 'channel_11', true);
    const authUserIdNotInChannel = authRegisterV2('z5712@unsw.edu.au', 'fdjdhlap1', 'chrome', 'firefox');
    expect(channelInviteV2(authUserIdNotInChannel.token, channel, user2)).toStrictEqual(ERROR);
  });
  test('authUserId Not Found', () => {
    const user1 = authRegisterV2('z4567@unsw.edu.au', 'djdjkldfjkl', 'Andy', 'Paper');
    const user2 = authRegisterV2('z9255@unsw.edu.au', 'dkefiofeio0', 'Kevin', 'Basketball');
    const channel = channelsCreateV2(user1.token, 'My channel', true);

    expect(channelInviteV2(user1.token + 1, channel, user2)).toStrictEqual(ERROR);
  });
  test('authUserId Wrong Type', () => {
    let user1 = authRegisterV2('z5761@unsw.edu.au', 'djdjkldfjkl', 'Andy', 'Paper');
    const user2 = authRegisterV2('z4567@unsw.edu.au', 'dkefiofeio0', 'Kevin', 'Basketball');
    const channel = channelsCreateV2(user1.token, 'My channel', true);

    expect(channelInviteV2(user1 += 6, channel, user2)).toStrictEqual(ERROR);
  });
  test('authUserId Not a Member of Channel', () => {
    const user1 = authRegisterV2('z8468@unsw.edu.au', 'ewyrtiyuy1834', 'Brian', 'Unsw');
    const user2 = authRegisterV2('z3678@unsw.edu.au', 'vcnmx009', 'Stephene', 'Windsor');
    const channel = channelsCreateV2(user1, 'New Channel', false);
    const authUserIdNotInChannel = authRegisterV2('z4255@unsw.edu.au', 'yreouw9899', 'Elizabeth', 'Picton');

    expect(channelInviteV2(authUserIdNotInChannel.token, channel, user2)).toStrictEqual(ERROR);
  });
  test('authUserId Not Found', () => {
    const user1 = authRegisterV2('z8708@unsw.edu.au', 'ugheysmnx6702', 'Mark', 'Picture');
    const user2 = authRegisterV2('z0406@unsw.edu.au', 'nmxzks9357', 'Chris', 'Soccer');
    const channel = channelsCreateV2(user1, 'My channel', false);

    expect(channelInviteV2(user1.token + 1, channel, user2)).toStrictEqual(ERROR);
  });
  test('authUserId Wrong Type', () => {
    const user1 = authRegisterV2('z1695@unsw.edu.au', 'ertkfhn5787', 'May', 'Powell');
    const user2 = authRegisterV2('z4567@unsw.edu.au', 'dkefiofeio4109', 'Sean', 'Paris');
    const channel = channelsCreateV2(user1, 'Boring channel', false);

    expect(channelInviteV2(user1.token += 1, channel, user2)).toStrictEqual(ERROR);
  });
});

// tests for channelMessagesV2

describe('channelMessagesV2', () => {
  test('channelId Not Valid (channelId Not Found)', () => {
    const user = authRegisterV2('6502@unsw.edu.au', 'thingsIwonder', 'Daniel', 'Pizza');
    const channelId = channelsCreateV2(user.authUserId, 'channel_1', true);
    const start = 2;
    expect(channelMessagesV2(user.token, channelId.channelId + 1, start)).toStrictEqual(ERROR);
  });
  test('channelId Not Valid (channelId array is empty)', () => {
    const user = authRegisterV2('z4564', 'new_password.js', 'Michael', 'Cooper');
    const start = 1;
    expect(channelMessagesV2(user.token, 4, start)).toStrictEqual(ERROR);
  });
  test('When start is greater than the Total Number of Messages', () => {
    const user = authRegisterV2('z4567@unsw.edu.au', 'djdjkldfjk', 'Andy', 'Paper');
    const channelId = channelsCreateV2(user, 'channel_3', true);
    const start = 50;
    expect(channelMessagesV2(user.token, channelId, start)).toStrictEqual(ERROR);
  });
  test('When channelId valid, but authUser is Not a Member', () => {
    const user = authRegisterV2('z7892@unsw.edu.au', '21uudf99aw', 'Andrew', 'Mabey');
    const channelId = channelsCreateV2(user, 'channel_4', true);
    const authUserIdNotInChannel = authRegisterV2('z2797@unsw.edu.au', 'fdwa45645', 'This', 'Kid');
    const start = 1;
    expect(channelMessagesV2(authUserIdNotInChannel.token, channelId, start)).toStrictEqual(ERROR);
  });
  test('When authUserId does not exist', () => {
    const user = authRegisterV2('z2847@unsw.edu.au', 'f5d525f', 'Computer', 'Keyboard');
    const channelId = channelsCreateV2(user, 'channel_5', true);
    const start = 1;
    expect(channelMessagesV2(user.token + 1, channelId, start)).toStrictEqual(ERROR);
  });
});

// tests for channelLeaveV1

describe('channelLeaveV1', () => {
  test('channelId is invalid while user token is valid', () => {
    const user = authRegisterV2('leavingperson1@example.com', '9248146145', 'Rob', 'Banks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    const result = channelLeaveV1(user.token, userChannel.channelId + 1);
    expect(result).toStrictEqual(ERROR);
  });
  test('the authorised user is not a member of the channel', () => {
    const user = authRegisterV2('leavingperson2@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('leavingperson3@example.com', '988444133', 'Bob', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    const result = channelLeaveV1(user2.token, userChannel.channelId);
    expect(result).toStrictEqual(ERROR);
  });
  test('The user token is invalid while channelId is valid', () => {
    const user = authRegisterV2('leavingperson4@example.com', '9248146145', 'Rob', 'Banks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user.token, userChannel.channelId);
    const result = channelLeaveV1(user.token + 1, userChannel.channelId);
    expect(result).toStrictEqual(ERROR);
  });
  test('user token and channelId are valid and the user is a member of the channel', () => {
    const user = authRegisterV2('leavingperson5@example.com', '9248146145', 'Rob', 'Banks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user.token, userChannel.channelId);
    const result = channelLeaveV1(user.token, userChannel.channelId);
    expect(result).toStrictEqual({});
  });
});

// tests for channelAddOwnerV1

describe('channelAddOwnerV1', () => {
  test('channelId is invalid', () => {
    const user = authRegisterV2('person1@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('person2@example.com', '7881192444', 'Bob', 'Jenkins');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    const result = channelAddOwnerV1(user.token, userChannel.channelId + 1, user2.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('the user being made owner is not a member of the channel', () => {
    const user = authRegisterV2('person3@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('person4@example.com', '988444133', 'Bob', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    const result = channelAddOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('the uid of the user being made a new owner is invalid', () => {
    const user = authRegisterV2('person5@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('person6@example.com', '1234567', 'Bob', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    const result = channelAddOwnerV1(user.token, userChannel.channelId, user2.authUserId + 1);
    expect(result).toStrictEqual(ERROR);
  });
  test('the token of the user adding a new owner is invalid', () => {
    const user = authRegisterV2('person7@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('person8@example.com', '1234567', 'Bob', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    const result = channelAddOwnerV1(user.token + 1, userChannel.channelId, user2.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('the user trying to make someone an owner is not an owner themselves', () => {
    const user = authRegisterV2('person9@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('person10@example.com', '1234567', 'Bob', 'Janks');
    const user3 = authRegisterV2('person11@example.com', '7654321', 'Barb', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'ERRORCHANNEL', true);
    channelJoinV2(user2.token, userChannel.channelId);
    channelJoinV2(user3.token, userChannel.channelId);
    const result = channelAddOwnerV1(user2.token, userChannel.channelId, user3.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('trying to make someone owner who is already an owner', () => {
    const user = authRegisterV2('person12@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('person13@example.com', '1234567', 'Bob', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    channelAddOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    const result = channelAddOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('user has a valid ID and is a member of a valid channel', () => {
    const user = authRegisterV2('person14@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('person15@example.com', '7881192444', 'Bob', 'Jenkins');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    const result = channelAddOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    expect(result).toStrictEqual({});
  });
});

// tests for channelRemoveOwnerV1

describe('channelRemoveOwnerV1', () => {
  test('channelId is invalid', () => {
    const user = authRegisterV2('removeperson1@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('removeperson2@example.com', '7881192444', 'Bob', 'Jenkins');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    const result = channelRemoveOwnerV1(user.token, userChannel.channelId + 1, user2.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('the user being removed from owner is not a member of the channel', () => {
    const user = authRegisterV2('removeperson3@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('removeperson4@example.com', '988444133', 'Bob', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    const result = channelRemoveOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('the user being removed from owner is not an owner', () => {
    const user = authRegisterV2('removeperson5@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('removeperson6@example.com', '988444133', 'Bob', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    const result = channelRemoveOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('the uid of the user being removed from owner is invalid', () => {
    const user = authRegisterV2('removeperson7@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('removeperson8@example.com', '1234567', 'Bob', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    channelAddOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    const result = channelRemoveOwnerV1(user.token, userChannel.channelId, user2.authUserId + 1);
    expect(result).toStrictEqual(ERROR);
  });
  test('the token of the user removing an owner is invalid', () => {
    const user = authRegisterV2('removeperson9@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('removeperson10@example.com', '1234567', 'Bob', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    channelAddOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    const result = channelRemoveOwnerV1(user.token + 1, userChannel.channelId, user2.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('the user trying to remove an owner is not an owner themselves', () => {
    const user = authRegisterV2('removeperson11@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('removeperson12@example.com', '1234567', 'Bob', 'Janks');
    const user3 = authRegisterV2('removeperson13@example.com', '7654321', 'Barb', 'Janks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    channelJoinV2(user3.token, userChannel.channelId);
    channelAddOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    const result = channelRemoveOwnerV1(user3.token, userChannel.channelId, user.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('Trying to remove the only owner of the channel', () => {
    const user = authRegisterV2('removeperson14@example.com', '9248146145', 'Rob', 'Banks');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    const result = channelRemoveOwnerV1(user.token, userChannel.channelId, user.authUserId);
    expect(result).toStrictEqual(ERROR);
  });
  test('valid case where all requirements are met', () => {
    const user = authRegisterV2('removeperson15@example.com', '9248146145', 'Rob', 'Banks');
    const user2 = authRegisterV2('removeperson16@example.com', '7881192444', 'Bob', 'Jenkins');
    const userChannel = channelsCreateV2(user.token, 'worst_channel', true);
    channelJoinV2(user2.token, userChannel.channelId);
    channelAddOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    const result = channelRemoveOwnerV1(user.token, userChannel.channelId, user2.authUserId);
    expect(result).toStrictEqual({});
  });
});
