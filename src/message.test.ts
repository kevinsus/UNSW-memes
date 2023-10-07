import { clear, authRegisterV2, channelsCreateV2, messageSendV1, dmCreateV1, messageSendDmV1, messageEditV1, channelJoinV2, messageRemoveV1 } from './helperTest';

const ERROR = { error: expect.any(String) };

// ========================================================================= //

beforeEach(clear);

describe('/clear', () => {
  test('Return empty', () => {
    expect(clear()).toStrictEqual({});
  });
});

// ========================================================================================= //
// MESSAGE SEND TESTS
// ========================================================================================= //

describe('/message/send/v1', () => {
  // ERROR CASES:
  // 1. Invalid token
  test('Invalid token', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(messageSendV1(user.token + 1, 90832048, 'Hello World')).toStrictEqual(ERROR);
  });
  test('Invalid token - No token', () => {
    expect(messageSendV1('032987hu', 90832048, 'Hello World')).toStrictEqual(ERROR);
  });
  test('Invalid token - randomToken', () => {
    authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(messageSendV1('randomToken', 90832048, 'Hello World')).toStrictEqual(ERROR);
  });
  // 2. Invalid channelId
  test('Invalid channelId - Invalid Channel', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    expect(messageSendV1(user.token, channel.channelId + 1, 'Hello World! look at my message')).toStrictEqual(ERROR);
  });
  // 3. Valid channelId - User is not part of channel
  test('Invalid User in channel', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('KevinSusanto@gmail.com', '81273h', 'Kevin', 'Susanto');
    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);
    expect(messageSendV1(user2.token, channel.channelId, 'Hello World! Im not in the channel')).toStrictEqual(ERROR);
  });
  // 4. Invalid Message - Length
  test.each([
    { message: '' },
    { message: 'This research was conducted to gain an understanding of the prevalence of cyberbullying among students in Malaysian  higher learning institutions. Additionally, the present research also attempted to find out the common platforms where cyberbullying occurred and coping strategies used by cyber victims. A set of questionnaire was developed for the purpose of data collection. A total of 712 public and private college/university students participated in this research. The research findings revealed that 66% of the respondents reported having been cyberbullied; the prevalence rate for female was higher compared to male cyber users; Malays students yielded highest percentage of cyber victims compared to other ethnic groups.  Current findings also indicated that Facebook and mobile phone social apps were the most common platforms where  cyberbullying took place. The exploration of cyberbullying effects showed that most of the cyber victims became over sensitive towards their surrounding and deve' },
  ])("invalid message: '$message'", ({ message }) => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    expect(messageSendV1(user.token, channel.channelId, message)).toStrictEqual(ERROR);
  });
  // Valid Case
  test('Testing 1 - Basic Test', () => {
    const user = authRegisterV2('tharanAsish@gmail.com', 'abcdefg', 'Tharan', 'Asish');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    expect(messageSendV1(user.token, channel.channelId, 'Hello World! Im not in the channel')).toStrictEqual({
      messageId: expect.any(Number),
    });
  });
});

// ========================================================================================= //
// MESSAGE SEND DM TESTS
// ========================================================================================= //

describe('messageSendDmV1', () => {
  test('Invalid token', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = messageSendDmV1({ token: user1.token + 1, dmId: newDm.dmId, message: 'Hello World' });
    expect(result).toStrictEqual(ERROR);
  });
  test('dmid invalid', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = messageSendDmV1({ token: user1.token, dmId: newDm.dmId + 1, message: 'Hello World' });
    expect(result).toStrictEqual(ERROR);
  });
  test('Invalid User in channel', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('KevinSusanto@gmail.com', '81273h', 'Kevin', 'Susanto');
    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);
    expect(messageSendV1(user2.token, channel.channelId, 'Hello World! Im not in the channel')).toStrictEqual(ERROR);
  });
  // 4. Invalid Message - Length
  test.each([
    { message: '' },
    { message: 'This research was conducted to gain an understanding of the prevalence of cyberbullying among students in Malaysian  higher learning institutions. Additionally, the present research also attempted to find out the common platforms where cyberbullying occurred and coping strategies used by cyber victims. A set of questionnaire was developed for the purpose of data collection. A total of 712 public and private college/university students participated in this research. The research findings revealed that 66% of the respondents reported having been cyberbullied; the prevalence rate for female was higher compared to male cyber users; Malays students yielded highest percentage of cyber victims compared to other ethnic groups.  Current findings also indicated that Facebook and mobile phone social apps were the most common platforms where  cyberbullying took place. The exploration of cyberbullying effects showed that most of the cyber victims became over sensitive towards their surrounding and deve' },
  ])("invalid message: '$message'", ({ message }) => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('KevinSusanto@gmail.com', '81273h', 'Kevin', 'Susanto');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = messageSendDmV1({ token: user1.token, dmId: newDm.dmId, message: message });
    expect(result).toStrictEqual(ERROR);
  });
  test('Valid case', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('KevinSusanto@gmail.com', '81273h', 'Kevin', 'Susanto');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = messageSendDmV1({ token: user1.token, dmId: newDm.dmId, message: 'hello comp is amazing' });
    expect(result).toStrictEqual({
      messageId: expect.any(Number),
    });
  });
});

// ========================================================================================= //
// MESSAGE EDIT TESTS
// ========================================================================================= //

describe('/message/edit/v1', () => {
  // ERROR CASES:

  // 1. Invalid token
  test('Invalid token', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const message = messageSendV1(user.token, channel.channelId, 'Hello COMP2521 students');
    expect(messageEditV1(user.token + 1, message.messageId, 'Hello World! This iteration is to much mannnn please give us break')).toStrictEqual(ERROR);
  });
  test('valid token', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const message = messageSendV1(user.token, channel.channelId, 'Hello COMP2521 students');
    expect(messageEditV1(user.token, message.messageId, 'Hello World! This iteration is to much mannnn please give us break')).not.toStrictEqual(ERROR);
  });
  // 2. Invalid Message - Length > 1000
  test.each([
    { message: 'a'.repeat(1001) },
    { message: 'b'.repeat(10001) },
  ])("invalid message length: '$message'", ({ message }) => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const messageSend = messageSendV1(user.token, channel.channelId, 'Hello COMP2521 students');
    expect(messageEditV1(user.token, messageSend.messageId, message)).toStrictEqual(ERROR);
  });
  test.each([
    { message: 'a'.repeat(0) },
    { message: 'b'.repeat(1000) },
  ])("valid message length: '$message'", ({ message }) => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const messageSend = messageSendV1(user.token, channel.channelId, 'Hello COMP2521 students');
    expect(messageEditV1(user.token, messageSend.messageId, message)).not.toStrictEqual(ERROR);
  });
  // 3. Invalid messageId - The message does not exist
  test('Invalid messageId - Does not refer to a valid message in channel', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const message = messageSendV1(user.token, channel.channelId, 'Hello World! Im not in the channel');
    expect(messageEditV1(user.token, message.messageId + 1, 'COMP2521 is Hard')).toStrictEqual(ERROR);
  });
  // 4. Invalid messageId - Th emessage is there, but the user is not
  test('Invalid messageId - Does not refer to a valid message in channel', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const message = messageSendV1(user.token, channel.channelId, 'Hello World! Im not in the channel');
    expect(messageEditV1(user.token + 1, message.messageId, 'COMP2521 is Hard')).toStrictEqual(ERROR);
  });
  // 5. Invalid message
  //    (There are 2 users; user1 = owner, user2 = member; user1 = sendmessage; user2 = edit message)
  test('Invalid message - The message was not sent by a user, and the user does not have owner permission', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('kevinsusanto@gmail.com', '1234321', 'Kevin', 'Susanto');

    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);
    channelJoinV2(user2.token, channel.channelId);

    const message = messageSendV1(user1.token, channel.channelId, 'Hello World! Im not in the channel');
    expect(messageEditV1(user2.token, message.messageId, 'COMP2521 is Hard')).toStrictEqual(ERROR);
  });
  test('Valid message - The message was not sent by the authorised user making this request, buit have owner permission', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('kevinsusanto@gmail.com', '1234321', 'Kevin', 'Susanto');

    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);
    channelJoinV2(user2.token, channel.channelId);

    const message = messageSendV1(user2.token, channel.channelId, 'Hello World! Im not in the channel');
    expect(messageEditV1(user1.token, message.messageId, 'COMP2521 is Hard')).not.toStrictEqual(ERROR);
  });

  // VALID CASES:
  test('Testing 1 - Basic Test', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', 'sdfghjk', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('kevinsusanto@gmail.com', 'wsertyuio', 'Kevin', 'Susanto');
    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);

    channelJoinV2(user2.token, channel.channelId);

    const message1 = messageSendV1(user1.token, channel.channelId, 'Hello World! Im the owner of the channel');
    const message2 = messageSendV1(user2.token, channel.channelId, 'Hello World! Im not the owner of the channel');
    const message3 = messageSendV1(user2.token, channel.channelId, 'Tharan is very mean to Asish, vice versa');

    // Editing their own message
    expect(messageEditV1(user1.token, message1.messageId, 'COMP2521 is Hard')).toStrictEqual({});
    expect(messageEditV1(user2.token, message2.messageId, 'COMP2521 does not make sense at this point')).toStrictEqual({});
    // Owner Editing members message
    expect(messageEditV1(user1.token, message3.messageId, '')).toStrictEqual({});
  });
  test('Testing 1 - Delete message using edit', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', 'sdfghjk', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);
    const message1 = messageSendV1(user1.token, channel.channelId, 'Checking delete empty string');

    // Delete message with empty string
    expect(messageEditV1(user1.token, message1.messageId, '')).toStrictEqual({});
  });
});

// ========================================================================================= //
// MESSAGE REMOVE TESTS
// ========================================================================================= //

describe('/message/remove/v1', () => {
  // ERROR CASES:

  // 1. Invalid token
  test('Invalid token', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const message = messageSendV1(user.token, channel.channelId, 'Hello COMP2521 students');
    const result = messageRemoveV1(user.token + 1, message.messageId);
    expect(result).toStrictEqual(ERROR);
  });
  test('valid token', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const message = messageSendV1(user.token, channel.channelId, 'Hello COMP2521 students');
    const result = messageRemoveV1(user.token, message.messageId);
    expect(result).not.toStrictEqual(ERROR);
  });

  // 2. Invalid messageId - The message does not exist -- CHANNEL ONLY
  test('Invalid messageId - Does not refer to a valid message in channel', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const message = messageSendV1(user.token, channel.channelId, 'Hello World! Im not in the channel');
    const result = messageRemoveV1(user.token, message.messageId + 1);
    expect(result).toStrictEqual(ERROR);
  });
  // 4. Invalid messageId - The message is there, but the user is not -- CHANNEL ONLY
  test('Invalid messageId - Does not refer to a valid message in channel', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'TEAM_CRINGE', true);
    const message = messageSendV1(user.token, channel.channelId, 'Hello World! Im not in the channel');
    const result = messageRemoveV1(user.token + 1, message.messageId);
    expect(result).toStrictEqual(ERROR);
  });

  // 5. Invalid message -- CHANNEL ONLY
  test('Invalid message - Channel member remove message of channel owner', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('kevinsusanto@gmail.com', '1234321', 'Kevin', 'Susanto');
    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);

    channelJoinV2(user2.token, channel.channelId);

    const message = messageSendV1(user1.token, channel.channelId, 'Hello World! Im not in the channel');
    const result = messageRemoveV1(user2.token, message.messageId);
    expect(result).toStrictEqual(ERROR);
  });
  test('Valid message - Channel owner remove message of a member', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('kevinsusanto@gmail.com', '1234321', 'Kevin', 'Susanto');
    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);

    channelJoinV2(user2.token, channel.channelId);

    const message = messageSendV1(user2.token, channel.channelId, 'Hello World! Im not in the channel');
    const result = messageRemoveV1(user1.token, message.messageId);
    expect(result).not.toStrictEqual(ERROR);
  });
  test('Invalid message - Channel member remove message of other channel member', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('kevinsusanto@gmail.com', '1234321', 'Kevin', 'Susanto');
    const user3 = authRegisterV2('tharanMohammad@gmail.com', '1234321', 'Mohammad', 'Tharan');
    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);

    channelJoinV2(user2.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);

    const message = messageSendV1(user3.token, channel.channelId, 'Hello World! Im not in the channel');
    const result = messageRemoveV1(user2.token, message.messageId);
    expect(result).toStrictEqual(ERROR);
  });

  // VALID CASES:
  test('Testing 1 - Basic Test', () => {
    const user1 = authRegisterV2('haydenjacobs@gmail.com', 'sdfghjk', 'Hayden', 'Jacobs');
    const user2 = authRegisterV2('kevinsusanto@gmail.com', 'wsertyuio', 'Kevin', 'Susanto');
    const user3 = authRegisterV2('TharanisNOOB@gmail.com', '345678', 'Lau', 'Jiao');
    const channel = channelsCreateV2(user2.token, 'TEAM_CRINGE', true);

    channelJoinV2(user1.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);

    const message1 = messageSendV1(user1.token, channel.channelId, 'Hello World! Im the owner of the channel');
    const message2 = messageSendV1(user2.token, channel.channelId, 'Hello World! Im not the owner of the channel');
    const message3 = messageSendV1(user3.token, channel.channelId, 'Tharan is very mean to Asish, vice versa');
    const message4 = messageSendV1(user2.token, channel.channelId, 'loll, this is a joke');

    // Remove their own message
    const result1 = messageRemoveV1(user1.token, message1.messageId);
    const result2 = messageRemoveV1(user2.token, message2.messageId);
    const result3 = messageRemoveV1(user3.token, message3.messageId);
    const result4 = messageRemoveV1(user3.token, message4.messageId);
    const result5 = messageRemoveV1(user2.token, message4.messageId);

    expect(result1).toStrictEqual({});
    expect(result2).toStrictEqual({});
    expect(result3).toStrictEqual({});

    expect(result4).toStrictEqual(ERROR);
    expect(result5).toStrictEqual({});
  });
  test('Testing 2 - Global owner of a channel member remove message of channel member', () => {
    const userGlobal = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const user1 = authRegisterV2('kevinsusanto@gmail.com', '1234321', 'Kevin', 'Susanto');
    const user2 = authRegisterV2('tharanMohammad@gmail.com', '1234321', 'Mohammad', 'Tharan');
    const channel = channelsCreateV2(user1.token, 'TEAM_CRINGE', true);

    channelJoinV2(userGlobal.token, channel.channelId);
    channelJoinV2(user2.token, channel.channelId);

    const message1 = messageSendV1(user1.token, channel.channelId, 'Hello World! Tharan is not good');
    const message2 = messageSendV1(user2.token, channel.channelId, 'Hello World! Im lost');
    const result1 = messageRemoveV1(userGlobal.token, message1.messageId);
    const result2 = messageRemoveV1(userGlobal.token, message2.messageId);
    expect(result1).toStrictEqual({});
    expect(result2).toStrictEqual({});
  });
});
