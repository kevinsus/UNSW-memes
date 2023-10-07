```javascript
let data = {
  // TODO: insert your data structure that contains 
  // users + channels here

  // USERS
  users: [
    {
      authUserId: 1,
      email: 'example@gmail.com',
      password: '1234321',
      nameFirst: 'Hayden',
      nameLast: 'Jacobs',
      handleStr: 'haydenjacobs',
      globalPermission: 1,
    }
  ],

  // Session
  sessions: [
    {
      authUserId: 0,
      token: '918273hhuj2'
    }, 
    {
      authUserId: 0,
      token: '978127lh'
    }, 
    {
      authUserId: 1,
      token: '81293nvyhs'
    }, 
  ],

  // CHANNELS
  channels: [
    {
      channelId: 1,
      name: 'My Channel',
      isPublic: true,
      ownerMembers: [
        {
          authUserId: 1,
          email: 'example@gmail.com',
          password: '1234321',
          nameFirst: 'Hayden',
          nameLast: 'Jacobs',
          handleStr: 'haydenjacobs',
        }
      ],
      allMembers: [
        {
          authUserId: 0,
          email: 'example1@gmail.com',
          password: '1234321',
          nameFirst: 'Hayden',
          nameLast: 'Jacobs',
          handleStr: 'haydenjacobs', 
        }
      ],
      message: [
        {
          messageId: 1, 
          uId: 1, 
          message: 'Hello World', 
          timeSent: 123, 
        }  
      ]

    }
  ],
}

```

[Optional] short description: 