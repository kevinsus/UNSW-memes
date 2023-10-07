import express, { json, Request, Response } from 'express';
import { echo } from './echo';

// Importing Individual's Function:

import { clearV1 } from './other';
import { channelJoinV2, channelDetailsV2, channelInviteV2, channelMessagesV2, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1 } from './channel';
import { dmCreateV1, dmListV1, dmDetailsV1, dmRemoveV1, dmLeaveV1, dmMessagesV1 } from './dm';
import { authLoginV2, authLogoutV1, authRegisterV2 } from './auth';
import { userProfileV2, usersAllV1, userProfileSetnameV1, userProfileSetEmailV1, userProfileSetHandleV1 } from './users';
import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';
import { messageSendV1, messageSendDmV1, messageEditV1, messageRemoveV1 } from './message';

import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// =================== other.ts  =================== //
app.delete('/clear/v1', (req: Request, res: Response) => {
  return res.json(clearV1());
});

// =================== auth.ts  =================== //
app.post('/auth/login/v2', (req: Request, res: Response) => {
  console.log('Login authUserId');
  const { email, password } = req.body;
  return res.json(authLoginV2(email, password));
});

app.post('/auth/logout/v1', (req: Request, res: Response) => {
  console.log('Logout authUserId');
  const { token } = req.body;
  return res.json(authLogoutV1(token));
});

app.post('/auth/register/v2', (req: Request, res: Response) => {
  console.log('Register authUserId');
  const { email, password, nameFirst, nameLast } = req.body;
  return res.json(authRegisterV2(email, password, nameFirst, nameLast));
});

// =================== users.ts  =================== //
app.get('/user/profile/v2', (req: Request, res: Response) => {
  console.log('user Profile');
  const token = req.query.token as string;
  const uId = req.query.uId as string;
  return res.json(userProfileV2(token, parseInt(uId)));
});

app.get('/users/all/v1', (req: Request, res: Response) => {
  console.log('users All');
  const token = req.query.token as string;
  return res.json(usersAllV1(token));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response) => {
  console.log('users Set First and Last Name');
  const { token, nameFirst, nameLast } = req.body;
  return res.json(userProfileSetnameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v1', (req: Request, res: Response) => {
  console.log('users Set Email');
  const { token, email } = req.body;
  return res.json(userProfileSetEmailV1(token, email));
});

app.put('/user/profile/sethandle/v1', (req: Request, res: Response) => {
  console.log('users Set HandleStr');
  const { token, handleStr } = req.body;
  return res.json(userProfileSetHandleV1(token, handleStr));
});

// =================== channels.ts  =================== //
app.post('/channels/create/v2', (req: Request, res: Response) => {
  console.log('Creating Channel');
  const { token, name, isPublic } = req.body;
  return res.json(channelsCreateV2(token, name, isPublic));
});

app.get('/channels/list/v2', (req: Request, res: Response) => {
  console.log('Listing Channel');
  const token = req.query.token as string;
  return res.json(channelsListV2(token));
});

app.get('/channels/listall/v2', (req: Request, res: Response) => {
  console.log('Listing All Channel');
  const token = req.query.token as string;
  return res.json(channelsListAllV2(token));
});

// =================== message.ts  =================== //
app.post('/message/send/v1', (req: Request, res: Response) => {
  console.log('Message send');
  const { token, channelId, message } = req.body;
  return res.json(messageSendV1(token, channelId, message));
});

app.post('/message/senddm/v1', (req: Request, res: Response) => {
  console.log('Message send dm');
  const { token, dmId, message } = req.body;
  return res.json(messageSendDmV1({ token: token, dmId: dmId, message: message }));
});

app.put('/message/edit/v1', (req: Request, res: Response) => {
  console.log('Message edit');
  const { token, messageId, message } = req.body;
  return res.json(messageEditV1(token, messageId, message));
});

app.delete('/message/remove/v1', (req: Request, res: Response) => {
  console.log('Message delete');
  const token = req.query.token as string;
  const messageId = req.query.messageId as string;
  return res.json(messageRemoveV1(token, parseInt(messageId)));
});

// =================== channel.ts  =================== //
app.post('/channel/join/v2', (req: Request, res: Response) => {
  console.log('channel join');
  const { token, channelId } = req.body;
  return res.json(channelJoinV2(token, channelId));
});

app.post('/channel/invite/v2', (req: Request, res: Response) => {
  console.log('channel invite');
  const { token, channelId, uId } = req.body;
  return res.json(channelInviteV2(token, channelId, uId));
});

app.get('/channel/details/v2', (req: Request, res: Response) => {
  console.log('channel details');
  const token = req.query.token as string;
  const channelId = req.query.channelId as string;
  return res.json(channelDetailsV2(token, parseInt(channelId)));
});

app.get('/channel/messages/v2', (req: Request, res: Response) => {
  console.log('channel messages');
  const token = req.query.token as string;
  const channelId = req.query.channelId as string;
  const start = req.query.start as string;
  return res.json(channelMessagesV2(token, parseInt(channelId), parseInt(start)));
});

app.post('/channel/leave/v1', (req: Request, res: Response) => {
  console.log('channel leave');
  const { token, channelId } = req.body;
  return res.json(channelLeaveV1(token, channelId));
});

app.post('/channel/addowner/v1', (req: Request, res: Response) => {
  console.log('add owner to channel');
  const { token, channelId, uId } = req.body;
  return res.json(channelAddOwnerV1(token, channelId, uId));
});

app.post('/channel/removeowner/v1', (req: Request, res: Response) => {
  console.log('remove owner from channel');
  const { token, channelId, uId } = req.body;
  return res.json(channelRemoveOwnerV1(token, channelId, uId));
});

// =================== dm.ts  =================== //

app.post('/dm/create/v1', (req: Request, res: Response) => {
  console.log('create a dm');
  const { token, uIds } = req.body;
  return res.json(dmCreateV1({ token: token, uIds: uIds }));
});

app.get('/dm/list/v1', (req: Request, res: Response) => {
  console.log('dm list');
  const token = req.query.token as string;
  return res.json(dmListV1(token));
});

app.get('/dm/details/v1', (req: Request, res: Response) => {
  console.log('dm details');
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  const details = dmDetailsV1(token, parseInt(dmId));
  return res.json(details);
});

app.delete('/dm/remove/v1', (req: Request, res: Response) => {
  console.log('dm remove');
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  return res.json(dmRemoveV1(token, parseInt(dmId)));
});

app.post('/dm/leave/v1', (req: Request, res: Response) => {
  console.log('leave a dm');
  const { token, dmId } = req.body;
  return res.json(dmLeaveV1({ token: token, dmId: dmId }));
});

app.get('/dm/messages/v1', (req: Request, res: Response) => {
  console.log('dm messages');
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  const start = req.query.start as string;
  return res.json(dmMessagesV1(token, parseInt(dmId), parseInt(start)));
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
