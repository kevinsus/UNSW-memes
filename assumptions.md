1. authRegisterV1 => Valid email should be in the form of:
   'string'@'string'.com
   
2. authRegisterV1 => authUserId is invalid if it is not a number / negative number and the authUserId generated should all be unique numbers

3. authLoginV1 => all email and password must be unique. It will return error if email or password entered does not match with the one on dataStore.

4. channelsCreateV1 => all channelId generated should be unique numbers and should always be different from the one existed in dataStore.

5. channelsListallV1 => if the user's email is registered, but no channel has been created, we assume that the function would return { channels: [] }, which is just an empty array.

6. channelsListV1 => same as channelsListallV1, we assume if the function couldn't find the channels in the dataStore, then it will return { channels: [] }.