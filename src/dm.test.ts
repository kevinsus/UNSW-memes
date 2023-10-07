import { clear, dmCreateV1, authRegisterV2, dmListV1, dmDetailsV1, dmRemoveV1, dmLeaveV1, dmMessagesV1 } from './helperTest';

const ERROR = { error: expect.any(String) };

const DMDETAILS = {
  dmId: expect.any(Number),
  name: expect.any(String),
  dmCreator: expect.any(Object),
  members: expect.any(Array),
  messages: expect.any(Array)
};

// ========================================================================= //

beforeEach(clear);

describe('/clear', () => {
  test('Return empty', () => {
    expect(clear()).toStrictEqual({});
  });
});

// tests for dmCreateV1

describe('dmCreateV1', () => {
  test('token is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const result = dmCreateV1({ token: user1.token + 1, uIds: [user2.authUserId] });
    expect(result).toStrictEqual(ERROR);
  });
  test('duplicate uIds in the uIds list', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '781139294', 'Jafar', 'Danesh');
    const result = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user2.authUserId] });
    expect(result).toStrictEqual(ERROR);
  });
  test('presence of an invalid uId in uIds list', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '781139294', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const result = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId + 1] });
    expect(result).toStrictEqual(ERROR);
  });
  test('valid case where all requirements are met', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '781139294', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const result = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    expect(result).toStrictEqual({ dmId: expect.any(Number) });
  });
});

// tests for dmListV1

describe('dmListV1', () => {
  test('token is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = dmListV1(user1.token + 1);
    expect(result).toStrictEqual(ERROR);
  });
  test('valid case where all requirements are met, user is in a single dm', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '781139294', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmListV1(user1.token);
    expect(result).toStrictEqual(
      {
        dms: [
          {
            dmId: expect.any(Number),
            name: expect.any(String),
            dmCreator: expect.any(Object),
            members: expect.any(Array),
            messages: expect.any(Array)
          }
        ]
      }
    );
  });
  test('valid case where all requirements are met, user is in 2 dms', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '781139294', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const user4 = authRegisterV2('someone3@example.com', '67891234', 'Bonnie', 'Bay');
    const user5 = authRegisterV2('someone4@example.com', '45678190', 'Zafar', 'Danesh');
    dmCreateV1({ token: user1.token, uIds: [user4.authUserId, user5.authUserId] });
    const result = dmListV1(user1.token);
    expect(result).toStrictEqual(
      {
        dms: [
          {
            dmId: expect.any(Number),
            name: expect.any(String),
            dmCreator: expect.any(Object),
            members: expect.any(Array),
            messages: expect.any(Array)
          },
          {
            dmId: expect.any(Number),
            name: expect.any(String),
            dmCreator: expect.any(Object),
            members: expect.any(Array),
            messages: expect.any(Array)
          }
        ]
      }
    );
  });
  test('valid case where all requirements are met, user is in multiple dms', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '781139294', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const user4 = authRegisterV2('someone3@example.com', '67891234', 'Bonnie', 'Bay');
    const user5 = authRegisterV2('someone4@example.com', '45678190', 'Zafar', 'Danesh');
    dmCreateV1({ token: user1.token, uIds: [user4.authUserId, user5.authUserId] });
    const user6 = authRegisterV2('someone5@example.com', 'i2745684', 'Jack', 'Danger');
    const user7 = authRegisterV2('someone6@example.com', '734859142', 'Billy', 'Cyrus');
    dmCreateV1({ token: user1.token, uIds: [user6.authUserId, user7.authUserId] });
    const result = dmListV1(user1.token);
    expect(result).toStrictEqual(
      {
        dms: [
          {
            dmId: expect.any(Number),
            name: expect.any(String),
            dmCreator: expect.any(Object),
            members: expect.any(Array),
            messages: expect.any(Array)
          },
          {
            dmId: expect.any(Number),
            name: expect.any(String),
            dmCreator: expect.any(Object),
            members: expect.any(Array),
            messages: expect.any(Array)
          },
          {
            dmId: expect.any(Number),
            name: expect.any(String),
            dmCreator: expect.any(Object),
            members: expect.any(Array),
            messages: expect.any(Array)
          }
        ]
      }
    );
  });
});

// tests for dmDetailsV1

describe('dmDetailsV1', () => {
  test('token is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmDetailsV1(user1.token + 1, newDm.dmId);
    expect(result).toStrictEqual(ERROR);
  });
  test('dmId is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmDetailsV1(user1.token, newDm.dmId + 1);
    expect(result).toStrictEqual(ERROR);
  });
  test('user is not a member of the dm', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = dmDetailsV1(user3.token, newDm.dmId);
    expect(result).toStrictEqual(ERROR);
  });
  test('valid case where all requirements are met', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmDetailsV1(user1.token, newDm.dmId);
    expect(result).toStrictEqual(DMDETAILS);
  });
});

// tests for dmRemoveV1

describe('dmRemoveV1', () => {
  test('token is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmRemoveV1(user1.token + 1, newDm.dmId);
    expect(result).toStrictEqual(ERROR);
  });
  test('dmId is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmRemoveV1(user1.token, newDm.dmId + 1);
    expect(result).toStrictEqual(ERROR);
  });
  test('user trying to remove dm is not a member of the dm', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = dmRemoveV1(user3.token, newDm.dmId);
    expect(result).toStrictEqual(ERROR);
  });
  test('user trying to remove dm is a member but not the owner', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmRemoveV1(user2.token, newDm.dmId);
    expect(result).toStrictEqual(ERROR);
  });
  test('valid case where all requirements are met', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmRemoveV1(user1.token, newDm.dmId);
    expect(result).toStrictEqual({});
  });
});

// tests for dmLeaveV1

describe('dmLeavev1', () => {
  test('token is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmLeaveV1({ token: user2.token + 1, dmId: newDm.dmId });
    expect(result).toStrictEqual(ERROR);
  });
  test('dmId is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmLeaveV1({ token: user3.token, dmId: newDm.dmId + 1 });
    expect(result).toStrictEqual(ERROR);
  });
  test('user trying to leave dm is not a member of the dm', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = dmLeaveV1({ token: user3.token, dmId: newDm.dmId });
    expect(result).toStrictEqual(ERROR);
  });
  test('valid case where all requirements are met', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmLeaveV1({ token: user3.token, dmId: newDm.dmId });
    expect(result).toStrictEqual({});
  });
});

// tests for dmMessagesV1

describe('dmMessagesV1', () => {
  test('token is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = dmMessagesV1(user1.token + 1, newDm.dmId, 0);
    expect(result).toStrictEqual(ERROR);
  });
  test('dmId is invalid', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmMessagesV1(user3.token, newDm.dmId + 1, 0);
    expect(result).toStrictEqual(ERROR);
  });
  test('user trying to get the dm messages is not a member of the dm', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId] });
    const result = dmMessagesV1(user3.token, newDm.dmId, 0);
    expect(result).toStrictEqual(ERROR);
  });
  /* test('start is greater than the total number of messages in the dm', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmMessagesV1(user1.token, newDm.dmId, newDm.message.length + 10);
    expect(result).toStrictEqual(ERROR);
  });
  test('Valid Case', () => {
    const user1 = authRegisterV2('someone@example.com', '924856345', 'Robin', 'Banks');
    const user2 = authRegisterV2('someone1@example.com', '924856345', 'Jafar', 'Danesh');
    const user3 = authRegisterV2('someone2@example.com', '29387343', 'Jake', 'Han');
    const newDm = dmCreateV1({ token: user1.token, uIds: [user2.authUserId, user3.authUserId] });
    const result = dmMessagesV1(user1.token, newDm.dmId, newDm.message.length/2);
    expect(result).toStrictEqual({messages: expect.any(Array), start: Number, end: Number});
  }); */
});
