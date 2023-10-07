import { clear, authRegisterV2, userProfileV2, usersAllV1, userProfileSetnameV1, userProfileSetEmailV1, userProfileSetHandleV1 } from './helperTest';

const ERROR = { error: expect.any(String) };

// ========================================================================= //

beforeEach(clear);

describe('/clear', () => {
  test('Return empty', () => {
    expect(clear()).toStrictEqual({});
  });
});

// ========================================================================================= //
// User Profile TESTS
// ========================================================================================= //

describe('/user/profile/v2', () => {
// ERROR CASES:
  // 1. Invalid user's Token
  test('Valid authId and invalid uId', () => {
    const user = authRegisterV2('samji@gmail.com', 'abcdefg', 'Sam', 'Ji');
    expect(userProfileV2(user.token + 1, user.authUserId)).toStrictEqual(ERROR);
  });

  // 2. Invalid user's Id
  test('Invalid authId and valid uID', () => {
    const user = authRegisterV2('samji@gmail.com', 'abcdefg', 'Sam', 'Ji');
    expect(userProfileV2(user.token, user.authUserId + 1)).toStrictEqual(ERROR);
  });

  // Valid Case => Testing their profile
  test('Testing owns profile', () => {
    const user = authRegisterV2('samji@gmail.com', 'abcdefg', 'Sam', 'Ji');
    expect(userProfileV2(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'samji@gmail.com',
        nameFirst: 'Sam',
        nameLast: 'Ji',
        handleStr: 'samji',
      }
    });
  });
});

// ========================================================================================= //
// USERS ALL TESTS
// ========================================================================================= //

describe('/user/profile/setname/v1', () => {
  // ERROR CASES:
  // 1. Invalid token
  test('Invalid token - Auth Logout', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(usersAllV1(user.token + 1)).toStrictEqual(ERROR);
  });
  test('Invalid token - No token', () => {
    expect(usersAllV1('')).toStrictEqual(ERROR);
  });
  test('Invalid token - randomToken', () => {
    authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(usersAllV1('randomToken')).toStrictEqual(ERROR);
  });

  // Valid Case => Testing their profile
  test('Testing 1 user', () => {
    const user = authRegisterV2('samji@gmail.com', 'abcdefg', 'Sam', 'Ji');
    expect(usersAllV1(user.token)).toStrictEqual({
      users: [
        {
          uId: user.authUserId,
          email: 'samji@gmail.com',
          nameFirst: 'Sam',
          nameLast: 'Ji',
          handleStr: 'samji',
        }
      ]
    });
  });
  test('Testing 2 user', () => {
    const user1 = authRegisterV2('samji@gmail.com', 'abcdefg', 'Sam', 'Ji');
    const user2 = authRegisterV2('HaydenSMITH@gmail.com', '8712gh', 'Hayden', 'Smith');
    expect(usersAllV1(user1.token)).toStrictEqual({
      users: [
        {
          uId: user1.authUserId,
          email: 'samji@gmail.com',
          nameFirst: 'Sam',
          nameLast: 'Ji',
          handleStr: 'samji',
        },
        {
          uId: user2.authUserId,
          email: 'HaydenSMITH@gmail.com',
          nameFirst: 'Hayden',
          nameLast: 'Smith',
          handleStr: 'haydensmith',
        }
      ]
    });
    expect(usersAllV1(user2.token)).toStrictEqual({
      users: [
        {
          uId: user1.authUserId,
          email: 'samji@gmail.com',
          nameFirst: 'Sam',
          nameLast: 'Ji',
          handleStr: 'samji',
        },
        {
          uId: user2.authUserId,
          email: 'HaydenSMITH@gmail.com',
          nameFirst: 'Hayden',
          nameLast: 'Smith',
          handleStr: 'haydensmith',
        }
      ]
    });
  });
  test('Testing 3 user', () => {
    const user1 = authRegisterV2('samji@gmail.com', 'abcdefg', 'Sam', 'Ji');
    const user2 = authRegisterV2('HaydenSMITH@gmail.com', '8712gh', 'Hayden', 'Smith');
    const user3 = authRegisterV2('KEVINsusanto@gmail.com', '1298tg9', 'Kevin', 'SUSANTO');
    expect(usersAllV1(user1.token)).toStrictEqual({
      users: [
        {
          uId: user1.authUserId,
          email: 'samji@gmail.com',
          nameFirst: 'Sam',
          nameLast: 'Ji',
          handleStr: 'samji',
        },
        {
          uId: user2.authUserId,
          email: 'HaydenSMITH@gmail.com',
          nameFirst: 'Hayden',
          nameLast: 'Smith',
          handleStr: 'haydensmith',
        },
        {
          uId: user3.authUserId,
          email: 'KEVINsusanto@gmail.com',
          nameFirst: 'Kevin',
          nameLast: 'SUSANTO',
          handleStr: 'kevinsusanto',
        }
      ]
    });
  });
});

// ========================================================================================= //
// USERS SET NAME TESTS
// ========================================================================================= //

describe('/user/profile/setname/v1', () => {
  // ERROR CASES:
  // 1. Invalid token
  test('Invalid token', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(userProfileSetnameV1(user.token + 1, 'Hayden', 'Smith')).toStrictEqual(ERROR);
  });
  test('Invalid token - No token', () => {
    expect(userProfileSetnameV1('032987hu', 'Hayden', 'Smith')).toStrictEqual(ERROR);
  });
  test('Invalid token - randomToken', () => {
    authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(userProfileSetnameV1('randomToken', 'HAHAHA', 'HELLO')).toStrictEqual(ERROR);
  });

  // Valid Case
  test('Testing 1 user', () => {
    const user = authRegisterV2('tharanAsish@gmail.com', 'abcdefg', 'Tharan', 'Asish');

    expect(userProfileV2(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'tharanAsish@gmail.com',
        nameFirst: 'Tharan',
        nameLast: 'Asish',
        handleStr: 'tharanasish',
      }
    });

    expect(userProfileSetnameV1(user.token, 'Hayden', 'Smith')).toStrictEqual({ });

    expect(userProfileV2(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'tharanAsish@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Smith',
        handleStr: 'tharanasish',
      }
    });
  });

  test('Testing 2 users', () => {
    const user1 = authRegisterV2('tharanAsish@gmail.com', 'abcdefg', 'Tharan', 'Asish');
    const user2 = authRegisterV2('kevinSUSANTO@gmail.com', 'abcdefg', 'Kevin', 'Susanto');

    expect(usersAllV1(user1.token)).toStrictEqual({
      users: [
        {
          uId: user1.authUserId,
          email: 'tharanAsish@gmail.com',
          nameFirst: 'Tharan',
          nameLast: 'Asish',
          handleStr: 'tharanasish',
        },
        {
          uId: user2.authUserId,
          email: 'kevinSUSANTO@gmail.com',
          nameFirst: 'Kevin',
          nameLast: 'Susanto',
          handleStr: 'kevinsusanto',
        }
      ]
    });

    expect(userProfileSetnameV1(user2.token, 'Hayden', 'Smith')).toStrictEqual({ });

    expect(usersAllV1(user1.token)).toStrictEqual({
      users: [
        {
          uId: user1.authUserId,
          email: 'tharanAsish@gmail.com',
          nameFirst: 'Tharan',
          nameLast: 'Asish',
          handleStr: 'tharanasish',
        },
        {
          uId: user2.authUserId,
          email: 'kevinSUSANTO@gmail.com',
          nameFirst: 'Hayden',
          nameLast: 'Smith',
          handleStr: 'kevinsusanto',
        }
      ]
    });
  });

  test('Testing - change same name', () => {
    const user = authRegisterV2('tharanAsish@gmail.com', 'abcdefg', 'Tharan', 'Asish');

    expect(userProfileV2(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'tharanAsish@gmail.com',
        nameFirst: 'Tharan',
        nameLast: 'Asish',
        handleStr: 'tharanasish',
      }
    });

    expect(userProfileSetnameV1(user.token, 'Tharan', 'Asish')).toStrictEqual({ });

    expect(userProfileV2(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'tharanAsish@gmail.com',
        nameFirst: 'Tharan',
        nameLast: 'Asish',
        handleStr: 'tharanasish',
      }
    });
  });
});

// ========================================================================================= //
// USERS SET EMAIL TESTS
// ========================================================================================= //

describe('/user/profile/setemail/v1', () => {
  // ERROR CASES:
  // 1. Invalid token
  test('Invalid token', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(userProfileSetEmailV1(user.token + 1, 'validEmail@gmail.com')).toStrictEqual(ERROR);
  });
  test('Invalid token - No token', () => {
    expect(userProfileSetEmailV1('032987hu', 'validEmail@gmail.com')).toStrictEqual(ERROR);
  });
  test('Invalid token - randomToken', () => {
    authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(userProfileSetEmailV1('randomToken', 'validEmail@gmail.com')).toStrictEqual(ERROR);
  });

  // 2. Invalid Email
  test.each([
    { email: '' },
    { email: 'abcdefgh' },
    { email: 'ABCDEFGH' },
    { email: '123456' },
    { email: 'ABCDEFGH@com' },
    { email: '@gyg.com' },
    { email: 'ABCDEFGH@gmail.' },
  ])("invalid email: '$email'", ({ email }) => {
    const user = authRegisterV2('validEmail@gmail.com', '1234321', 'abcde', 'fghij');
    expect(userProfileSetEmailV1(user.token, email)).toStrictEqual(ERROR);
  });

  test('Email has been used', () => {
    const user1 = authRegisterV2('abcde@gmail.com', '4444444', 'hello', 'world');
    const user2 = authRegisterV2('HaydenSmith@gmail.com', '9012037', 'abcde', 'fghij');
    expect(userProfileSetEmailV1(user1.token, 'HaydenSmith@gmail.com')).toStrictEqual(ERROR);
    expect(userProfileSetEmailV1(user2.token, 'abcde@gmail.com')).toStrictEqual(ERROR);
  });

  // Valid Case
  test('Testing 1 user', () => {
    const user = authRegisterV2('tharanAsish@gmail.com', 'abcdefg', 'Tharan', 'Asish');

    expect(userProfileV2(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'tharanAsish@gmail.com',
        nameFirst: 'Tharan',
        nameLast: 'Asish',
        handleStr: 'tharanasish',
      }
    });

    expect(userProfileSetEmailV1(user.token, 'HaydenSmith@gmail.com')).toStrictEqual({ });

    expect(userProfileV2(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'HaydenSmith@gmail.com',
        nameFirst: 'Tharan',
        nameLast: 'Asish',
        handleStr: 'tharanasish',
      }
    });
  });

  test('Testing 2 users', () => {
    const user1 = authRegisterV2('tharanAsish@gmail.com', 'abcdefg', 'Tharan', 'Asish');
    const user2 = authRegisterV2('kevinSUSANTO@gmail.com', 'abcdefg', 'Kevin', 'Susanto');

    expect(usersAllV1(user1.token)).toStrictEqual({
      users: [
        {
          uId: user1.authUserId,
          email: 'tharanAsish@gmail.com',
          nameFirst: 'Tharan',
          nameLast: 'Asish',
          handleStr: 'tharanasish',
        },
        {
          uId: user2.authUserId,
          email: 'kevinSUSANTO@gmail.com',
          nameFirst: 'Kevin',
          nameLast: 'Susanto',
          handleStr: 'kevinsusanto',
        }
      ]
    });

    expect(userProfileSetEmailV1(user2.token, 'HaydenSmith@gmail.com')).toStrictEqual({ });

    expect(usersAllV1(user2.token)).toStrictEqual({
      users: [
        {
          uId: user1.authUserId,
          email: 'tharanAsish@gmail.com',
          nameFirst: 'Tharan',
          nameLast: 'Asish',
          handleStr: 'tharanasish',
        },
        {
          uId: user2.authUserId,
          email: 'HaydenSmith@gmail.com',
          nameFirst: 'Kevin',
          nameLast: 'Susanto',
          handleStr: 'kevinsusanto',
        }
      ]
    });
  });
});

// ========================================================================================= //
// USERS SET HANDLESTR TESTS
// ========================================================================================= //

describe('/user/profile/sethandle/v1', () => {
  // ERROR CASES:
  // 1. Invalid token
  test('Invalid token', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(userProfileSetHandleV1(user.token + 1, 'validHandleSTREXAMPLEthatisdefinitelygoingtoWORK')).toStrictEqual(ERROR);
  });
  test('Invalid token - No token', () => {
    expect(userProfileSetHandleV1('032987hu', 'validHandleSTREXAMPLEthatisdefinitelygoingtoWORK')).toStrictEqual(ERROR);
  });
  test('Invalid token - randomToken', () => {
    authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(userProfileSetHandleV1('randomToken', 'validHandleSTREXAMPLEthatisdefinitelygoingtoWORK')).toStrictEqual(ERROR);
  });

  // 2. Invalid handleStr
  test.each([
    { handleStr: '2e' },
    { handleStr: '902ghye5gHJk2TGbHjoKi' },
    { handleStr: '( ) ` ~ ! @ # $ % ^ & * - + = | ' },
  ])("invalid handleStr: '$handleStr'", ({ handleStr }) => {
    expect(userProfileSetHandleV1('abcde@gmail.com', handleStr)).toStrictEqual(ERROR);
  });

  test('handleStr has been used', () => {
    const user1 = authRegisterV2('abcde@gmail.com', '4444444', 'hello', 'world');
    const user2 = authRegisterV2('HaydenSmith@gmail.com', '9012037', 'abcde', 'fghij');
    expect(userProfileSetHandleV1(user1.token, 'abcdefghij')).toStrictEqual(ERROR);
    expect(userProfileSetHandleV1(user2.token, 'helloworld')).toStrictEqual(ERROR);
  });

  // Valid Case
  test('Testing 1 user', () => {
    const user = authRegisterV2('tharanAsish@gmail.com', 'abcdefg', 'Tharan', 'Asish');

    expect(userProfileV2(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'tharanAsish@gmail.com',
        nameFirst: 'Tharan',
        nameLast: 'Asish',
        handleStr: 'tharanasish',
      }
    });

    expect(userProfileSetHandleV1(user.token, 'abcdefghij')).toStrictEqual({ });

    expect(userProfileV2(user.token, user.authUserId)).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: 'tharanAsish@gmail.com',
        nameFirst: 'Tharan',
        nameLast: 'Asish',
        handleStr: 'abcdefghij',
      }
    });
  });

  test('Testing 2 users', () => {
    const user1 = authRegisterV2('tharanAsish@gmail.com', 'abcdefg', 'Tharan', 'Asish');
    const user2 = authRegisterV2('kevinSUSANTO@gmail.com', 'abcdefg', 'Kevin', 'Susanto');

    expect(usersAllV1(user1.token)).toStrictEqual({
      users: [
        {
          uId: user1.authUserId,
          email: 'tharanAsish@gmail.com',
          nameFirst: 'Tharan',
          nameLast: 'Asish',
          handleStr: 'tharanasish',
        },
        {
          uId: user2.authUserId,
          email: 'kevinSUSANTO@gmail.com',
          nameFirst: 'Kevin',
          nameLast: 'Susanto',
          handleStr: 'kevinsusanto',
        }
      ]
    });

    expect(userProfileSetHandleV1(user2.token, 'helloworld')).toStrictEqual({ });

    expect(usersAllV1(user2.token)).toStrictEqual({
      users: [
        {
          uId: user1.authUserId,
          email: 'tharanAsish@gmail.com',
          nameFirst: 'Tharan',
          nameLast: 'Asish',
          handleStr: 'tharanasish',
        },
        {
          uId: user2.authUserId,
          email: 'kevinSUSANTO@gmail.com',
          nameFirst: 'Kevin',
          nameLast: 'Susanto',
          handleStr: 'helloworld',
        }
      ]
    });
  });
});
