import { clear, authLoginV2, authLogoutV1, authRegisterV2, userProfileV2 } from './helperTest';

const ERROR = { error: expect.any(String) };

// ========================================================================= //

beforeEach(clear);

describe('/clear', () => {
  test('Return empty', () => {
    expect(clear()).toStrictEqual({});
  });
});

// ========================================================================================= //
// AUTH LOGIN TESTS
// ========================================================================================= //

describe('/auth/login/v2', () => {
  // 1. Invalid Email
  test('invalid email is empty', () => {
    authRegisterV2('abcde@gmail.com', '4444444', 'test1', 'check');
    expect(authLoginV2('', '4444444')).toStrictEqual(ERROR);
  });

  test('invalid email does not exist', () => {
    authRegisterV2('test1@gmail.com', '1221221', 'test2', 'check');
    expect(authLoginV2('aaaa@gmail.com', '1221221')).toStrictEqual(ERROR);
  });

  // 2. Invalid password
  test('invalid password is empty', () => {
    authRegisterV2('test2@gmail.com', '1234321', 'test3', 'check');
    expect(authLoginV2('test2@gmail.com', '')).toStrictEqual(ERROR);
  });

  test('invalid password is incorrect', () => {
    authRegisterV2('test2@gmail.com', '11223344', 'test4', 'check');
    expect(authLoginV2('test2@gmail.com', '11231232')).toStrictEqual(ERROR);
  });

  // 3. Valid Case
  test('Valid Case', () => {
    const user1 = authRegisterV2('validcase@gmail.com', '1234321', 'testingValid', 'CASE');
    const user2 = authLoginV2('validcase@gmail.com', '1234321');
    const UserId1 = user1.authUserId;
    const UserId2 = user2.authUserId;
    expect(UserId1).toStrictEqual(UserId2);
  });
});

// ========================================================================================= //
// AUTH LOGOUT TESTS
// ========================================================================================= //

describe('/auth/logout/v1', () => {
  // 1. Invalid token
  test('Invalid token - Auth Logout', () => {
    const user = authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(authLogoutV1(user.token + 1)).toStrictEqual(ERROR);
  });
  test('Invalid token - No token', () => {
    expect(authLogoutV1('')).toStrictEqual(ERROR);
  });
  test('Invalid token - randomToken', () => {
    authRegisterV2('haydenjacobs@gmail.com', '1234321', 'Hayden', 'Jacobs');
    expect(authLogoutV1('randomToken')).toStrictEqual(ERROR);
  });

  // 2. Valid Case
  test('Valid Case - Using Register', () => {
    const userReg = authRegisterV2('validcase@gmail.com', '1234321', 'testingValid', 'CASE');
    expect(userProfileV2(userReg.token, userReg.authUserId).user.email).toStrictEqual('validcase@gmail.com');
    authLogoutV1(userReg.token);
    expect(userProfileV2(userReg.token, userReg.authUserId)).toStrictEqual(ERROR);
  });

  test('Valid Case - Using Login', () => {
    authRegisterV2('HaydenSmith@gmail.com', '98721gh', 'testingValid', 'CASE');
    const authLogin = authLoginV2('HaydenSmith@gmail.com', '98721gh');
    expect(userProfileV2(authLogin.token, authLogin.authUserId).user.email).toStrictEqual('HaydenSmith@gmail.com');
    authLogoutV1(authLogin.token);
    expect(userProfileV2(authLogin.token, authLogin.authUserId)).toStrictEqual(ERROR);
  });
});

// ========================================================================================= //
// AUTH REGISTER TESTS
// ========================================================================================= //

describe('/auth/register/v2', () => {
  // 1. Invalid Email
  test.each([
    { email: '' },
    { email: 'abcdefgh' },
    { email: 'ABCDEFGH' },
    { email: '123456' },
    { email: 'ABCDEFGH@com' },
    { email: '@gyg.com' },
    { email: 'ABCDEFGH@gmail.' },
  ])("invalid email: '$email'", ({ email }) => {
    expect(authRegisterV2(email, '1234321', 'abcde', 'fghij')).toStrictEqual(ERROR);
  });

  // 2. Two same email address
  test('invalid email address', () => {
    // Register the same email from 2 different users
    authRegisterV2('abcde@gmail.com', '4444444', 'hello', 'world');
    expect(authRegisterV2('abcde@gmail.com', '5555555', 'abcde', 'fghij')).toStrictEqual(ERROR);
  });

  // 3. Password length < 6 characters
  test.each([
    { password: '' },
    { password: '1' },
    { password: '12' },
    { password: '123' },
    { password: '1234' },
    { password: '12345' },
    { password: 'aaaaa' },
  ])("invalid password: '$password'", ({ password }) => {
    expect(authRegisterV2('abcde@gmail.com', password, 'abcde', 'fghij')).toStrictEqual(ERROR);
  });

  // 4. nameFirst < 1 || nameFirst > 50 will give an error
  test.each([
    { nameFirst: '' },
    { nameFirst: 'uvuvwevwevweonyetenyevweugwemuhwemosashasthirdtyeightcharacters' },
    { nameFirst: 'uvuvwevwevweonyetenyevweugwemuhwemosashasthirdtyeig' },
  ])("invalid nameFirst: '$nameFirst'", ({ nameFirst }) => {
    expect(authRegisterV2('abcde@gmail.com', '1234321', nameFirst, 'fghij')).toStrictEqual(ERROR);
  });

  // 5. nameLast < 1 || nameLast > 50 will give an error
  test.each([
    { nameLast: '' },
    { nameLast: 'uvuvwevwevweonyetenyevweugwemuhwemosashasthirdtyeightcharacters' },
    { nameLast: 'uvuvwevwevweonyetenyevweugwemuhwemosashasthirdtyeig' },
  ])("invalid nameLast: '$nameLast'", ({ nameLast }) => {
    expect(authRegisterV2('abcde@gmail.com', '1234321', 'abcde', nameLast)).toStrictEqual(ERROR);
  });

  // TESTING VALID CASE - GENERAL
  test('Valid Case - General', () => {
    const user = authRegisterV2('test1@gmail.com', '1234321', 'HELLO', 'World');
    expect(user).toStrictEqual(
      {
        token: expect.any(String),
        authUserId: expect.any(Number),
      }
    );
  });

  // TESTING FAILED RERUN TEST
  test('testDuplicateHandlesGeneratedCorrectly[abc-def0-abcdef0-abc-def-abcdef1]', () => {
    authRegisterV2('test1@gmail.com', '8239823', 'abc', 'def');
    authRegisterV2('test2@gmail.com', '7921639', 'abc', 'def0');
    const user = authRegisterV2('test3@gmail.com', '9162893', 'abc', 'def');
    const handle = userProfileV2(user.token, user.authUserId).user.handleStr;
    expect(user).toStrictEqual(
      {
        token: expect.any(String),
        authUserId: expect.any(Number),
      }
    );
    expect(handle).toEqual('abcdef1');
  });

  // TESTING VALID CASE - Using userProfileV2
  describe('Valid Case Checks - Every Types', () => {
    test('Valid Case - Basic Checks', () => {
      const user = authRegisterV2('haydenSMITH@email.com', 'password1', 'Hayden', 'Smith');
      const emailStr = userProfileV2(user.token, user.authUserId).user.email;
      const firstName = userProfileV2(user.token, user.authUserId).user.nameFirst;
      const lastName = userProfileV2(user.token, user.authUserId).user.nameLast;
      const handle = userProfileV2(user.token, user.authUserId).user.handleStr;

      expect(emailStr).toEqual('haydenSMITH@email.com');
      expect(firstName).toEqual('Hayden');
      expect(lastName).toEqual('Smith');
      expect(handle).toEqual('haydensmith');
    });

    test('Valid Case - handleStr (two same handleStr)', () => {
      const user1 = authRegisterV2('blah1@email.com', 'password1', 'abcdefghij', 'klmnopqrs');
      const handle1 = userProfileV2(user1.token, user1.authUserId).user.handleStr;
      expect(handle1).toEqual('abcdefghijklmnopqrs');

      const user2 = authRegisterV2('blah2@email.com', 'password1', 'abcdefghij', 'klmnopqrs');
      const handle2 = userProfileV2(user2.token, user2.authUserId).user.handleStr;
      expect(handle2).toEqual('abcdefghijklmnopqrs0');
    });

    test('Valid Case - handleStr (length > 20char)', () => {
      const user = authRegisterV2('blah1@email.com', 'password1', 'HelloworldThisisNewfunction', 'forTestingtheHandlestr');
      const handle = userProfileV2(user.token, user.authUserId).user.handleStr;
      expect(handle).toEqual('helloworldthisisnewf');
    });
  });
});
