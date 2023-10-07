import request, { HttpVerb } from 'sync-request';
import { port, url } from './config.json';
import { dmLeaveInput, dmCreateInput, messageSendDmInput, messageSendDmReturn } from './interface';

const SERVER_URL = `${url}:${port}`;

// ========================================================================= //
// All Wrapper functions

export function clear() {
  return requestHelper('DELETE', '/clear/v1', {});
}

// === auth.ts === //

export function authLoginV2(email: string, password: string) {
  return requestHelper('POST', '/auth/login/v2', { email, password });
}

export function authLogoutV1(token: string) {
  return requestHelper('POST', '/auth/logout/v1', { token });
}

export function authRegisterV2(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', '/auth/register/v2', { email, password, nameFirst, nameLast });
}

// === user.ts === //

export function userProfileV2(token: string, uId: number) {
  return requestHelper('GET', '/user/profile/v2', { token, uId });
}

export function usersAllV1(token: string) {
  return requestHelper('GET', '/users/all/v1', { token });
}

export function userProfileSetnameV1(token: string, nameFirst: string, nameLast:string) {
  return requestHelper('PUT', '/user/profile/setname/v1', { token, nameFirst, nameLast });
}

export function userProfileSetEmailV1(token: string, email: string) {
  return requestHelper('PUT', '/user/profile/setemail/v1', { token, email });
}

export function userProfileSetHandleV1(token: string, handleStr: string) {
  return requestHelper('PUT', '/user/profile/sethandle/v1', { token, handleStr });
}

// === channels.ts === //

export function channelsCreateV2(token: string, name: string, isPublic: boolean) {
  return requestHelper('POST', '/channels/create/v2', { token, name, isPublic });
}

export function channelsListV2(token: string) {
  return requestHelper('GET', '/channels/list/v2', { token });
}

export function channelsListAllV2(token: string) {
  return requestHelper('GET', '/channels/listall/v2', { token });
}

// === message.ts === //

export function messageSendV1(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/message/send/v1', { token, channelId, message });
}

export function messageSendDmV1(sendDmInput: messageSendDmInput): messageSendDmReturn {
  return requestHelper('POST', '/message/senddm/v1', sendDmInput);
}

export function messageEditV1(token: string, messageId: number, message: string) {
  return requestHelper('PUT', '/message/edit/v1', { token, messageId, message });
}

export function messageRemoveV1(token: string, messageId: number) {
  return requestHelper('DELETE', '/message/remove/v1', { token, messageId });
}

// === channel.ts === //

export function channelJoinV2(token: string, channelId: number) {
  return requestHelper('POST', '/channel/join/v2', { token, channelId });
}

export function channelInviteV2(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/invite/v2', { token, channelId, uId });
}

export function channelDetailsV2(token: string, channelId: number) {
  return requestHelper('GET', '/channel/details/v2', { token, channelId });
}

export function channelMessagesV2(token: string, channelId: number, start: number) {
  return requestHelper('GET', '/channel/messages/v2', { token, channelId, start });
}

export function channelLeaveV1(token: string, channelId: number) {
  return requestHelper('POST', '/channel/leave/v1', { token, channelId });
}

export function channelAddOwnerV1(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/addowner/v1', { token, channelId, uId });
}

export function channelRemoveOwnerV1(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/removeowner/v1', { token, channelId, uId });
}

// === dm.ts === //

export function dmCreateV1(newDmInput: dmCreateInput) {
  return requestHelper('POST', '/dm/create/v1', newDmInput);
}

export function dmListV1(token: string) {
  return requestHelper('GET', '/dm/list/v1', { token });
}

export function dmDetailsV1(token: string, dmId: number) {
  return requestHelper('GET', '/dm/details/v1', { token, dmId });
}

export function dmRemoveV1(token: string, dmId: number) {
  return requestHelper('DELETE', '/dm/remove/v1', { token, dmId });
}

export function dmLeaveV1(LeaveInput: dmLeaveInput) {
  return requestHelper('POST', '/dm/leave/v1', LeaveInput);
}

export function dmMessagesV1(token: string, dmId: number, start: number) {
  return requestHelper('GET', '/dm/messages/v1', { token, dmId, start });
}

// ========================================================================= //
// Helpers

function requestHelper(method: HttpVerb, path: string, payload: object) {
  let qs = {};
  let json = {};

  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json });
  return JSON.parse(res.getBody() as string);
}
