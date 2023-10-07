import { clear, authRegisterV2, channelsCreateV2, channelsListV2, channelsListAllV2 } from './helperTest';

const ERROR = { error: expect.any(String) };

// ========================================================================= //

beforeEach(clear);

describe('/clear', () => {
  test('Return empty', () => {
    expect(clear()).toStrictEqual({});
  });
});

// ========================================================================================= //
// CHANNELS CREATE TESTS
// ========================================================================================= //

describe('/channels/create/v2', () => {
  // ERROR CASES
  // 1. Invalid name length
  test.each([
    { name: '' },
    { name: 'uvuvwevwevweonyetenye' },
    { name: 'uvuvwevwevweonyetenyevweugwemuhwemosas' },
  ])("invalid length name: '$name'", ({ name }) => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(channelsCreateV2(user.token, name, true)).toStrictEqual(ERROR);
  });

  // 2. Invalid authUserId
  test('Invalid authUserId', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(channelsCreateV2(user.token + 1, 'Hayden', true)).toStrictEqual(ERROR);
  });

  // TESTING VALID CASE
  test('Valid Case', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(channelsCreateV2(user.token, 'Hayden', true)).toStrictEqual(
      {
        channelId: expect.any(Number),
      }
    );
  });

  // test('Test create channel successful ~ using channeldetails', () => {
  //   const channelName = 'Hayden';
  //   const uId = authRegisterV1('haydenjacobs@gmail.com', '1234321', channelName, 'Jacobs').authUserId;
  //   const chId = channelsCreateV2(uId, channelName, true).channelId;
  //   const deets = channelDetailsV1(uId, chId);
  //   expect(deets.name).toBe(channelName);
  // });
});

// ========================================================================================= //
// CHANNELS LIST TESTS
// ========================================================================================= //

describe('/channels/list/v2', () => {
  test('When token does not exist', () => {
    const user = authRegisterV2('andretsai@unsw.edu.au', 'fjfj8883', 'Andre', 'Tsai');
    expect(channelsListV2(user.token + 1)).toStrictEqual(ERROR);
  });

  test('When token is not an integer', () => {
    const user = authRegisterV2('andrewsun@unsw.edu.au', 'fjoepc0093', 'Andrew', 'Sun');

    expect(channelsListV2(user.token + 'string')).toStrictEqual(ERROR);
  });

  test('When token is negative', () => {
    const user = authRegisterV2('kevinsusanto@unsw.edu.au', 'poqie009', 'Kevin', 'Sustano');
    expect(channelsListV2(user.token + 1)).toStrictEqual(ERROR);
  });

  test('token does not belong to any channel', () => {
    const user1 = authRegisterV2('andrewmabey@unsw.edu.au', 'jhgffop00943', 'Andrew', 'Mabey');
    const user2 = authRegisterV2('helloworld@unsw.edu.au', 'fifik199-00', 'Hello', 'World');

    channelsCreateV2(user1.token, 'random', true);

    expect(channelsListV2(user2.token)).toStrictEqual(
      { channels: [] }
    );
  });

  test('token with one channel', () => {
    const user = authRegisterV2('namsemilimbu@unsw.edu.au', 'fjdoq873', 'Namsemi', 'Limbu');
    const channel = channelsCreateV2(user.token, 'Namsemi channel', true);

    expect(channelsListV2(user.token)).toStrictEqual({
      channels: [
        {
          channelId: channel.channelId,
          name: 'Namsemi channel'
        }
      ]
    });
  });

  test('authUser with two channels', () => {
    const user = authRegisterV2('tharansingh@unsw.edu.au', '[oq;;c00f', 'Tharan', 'Singh');
    const channel1 = channelsCreateV2(user.token, 'Tharan 1 Channel', true);
    const channel2 = channelsCreateV2(user.token, 'Tharan 2 Channel', true);

    expect(channelsListV2(user.token)).toStrictEqual({
      channels: [
        {
          channelId: channel1.channelId,
          name: 'Tharan 1 Channel',
        },
        {
          channelId: channel2.channelId,
          name: 'Tharan 2 Channel',
        }
      ]
    });
  });

  test('authUser with more than two channels', () => {
    const user = authRegisterV2('mohammadnabiei@unsw.edu.au', '2993jjdjc', 'Mohammad', 'Nabiei');
    const channel1 = channelsCreateV2(user.token, 'Mohammad 1 Channel', true);
    const channel2 = channelsCreateV2(user.token, 'Mohammad 2 Channel', true);
    const channel3 = channelsCreateV2(user.token, 'Mohammad 3 Channel', true);
    const channel4 = channelsCreateV2(user.token, 'Mohammad 4 Channel', true);

    expect(channelsListV2(user.token)).toStrictEqual({
      channels: [
        {
          channelId: channel1.channelId,
          name: 'Mohammad 1 Channel'
        },
        {
          channelId: channel2.channelId,
          name: 'Mohammad 2 Channel'
        },
        {
          channelId: channel3.channelId,
          name: 'Mohammad 3 Channel'
        },
        {
          channelId: channel4.channelId,
          name: 'Mohammad 4 Channel'
        },
      ]
    });
  });
});

// ========================================================================================= //
// CHANNELS LIST ALL TESTS
// ========================================================================================= //

describe('channelsListAllV1', () => {
  // ERROR CASES:
  // 1. Invalid token
  test('Invalid token with public channel', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(channelsListAllV2(user.token + 1)).toStrictEqual(ERROR);
  });

  test('Invalid token with private channel', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    channelsCreateV2(user.token, 'Hayden', false);
    expect(channelsListAllV2(user.token + 1)).toStrictEqual(ERROR);
  });

  // TESTING VALID CASE:
  // 1. No channels 1
  test('No channels and valid token', () => {
    const uIdBuzz = authRegisterV2('buzz.lightyear@starcommand.com', 'qazwsx@@', 'buzz', 'lightyear').token;
    const res = channelsListAllV2(uIdBuzz).channels;
    expect(res).toStrictEqual([]);
  });

  // 2. Valid token and public channels
  test('Valid token and one public channel', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'Voicechat', true);
    expect(channelsListAllV2(user.token)).toStrictEqual({
      channels: [
        {
          channelId: channel.channelId,
          name: 'Voicechat',
        }
      ]
    });
  });

  test('Valid token and multiple public channels', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'Voicechat', true);
    const channel2 = channelsCreateV2(user.token, 'Messages', true);
    expect(channelsListAllV2(user.token)).toStrictEqual({
      channels: [
        {
          channelId: channel.channelId,
          name: 'Voicechat',
        },
        {
          channelId: channel2.channelId,
          name: 'Messages',
        },
      ]
    });
  });

  // 3. Valid token and private channels
  test('Valid token and one private channel', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'Voicechat', false);
    expect(channelsListAllV2(user.token)).toStrictEqual({
      channels: [
        {
          channelId: channel.channelId,
          name: 'Voicechat',
        }
      ]
    });
  });

  test('Valid token and multiple private channels', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    const channel = channelsCreateV2(user.token, 'Voicechat', false);
    const channel2 = channelsCreateV2(user.token, 'Messages', false);
    expect(channelsListAllV2(user.token)).toStrictEqual({
      channels: [
        {
          channelId: channel.channelId,
          name: 'Voicechat',
        },
        {
          channelId: channel2.channelId,
          name: 'Messages',
        },
      ]
    });
  });
});
