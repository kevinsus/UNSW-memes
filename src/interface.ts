//  ==========================================================
//  DataStore
//  ==========================================================

export interface OwnerMember {
  authUserId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
}

export interface AllMember {
  authUserId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
}

export interface Messages {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
}

export interface Dm {
  dmId: number;
  name: string;
  dmCreator: OwnerMember;
  members: AllMember[];
  messages: Messages[];
}

//  ==========================================================
//  FUNCTIONS
//  ==========================================================

export interface error {
  error: string;
}

export class emptyObject {

}

// =================== auth.ts  =================== //
export interface authRegister {
  token: string;
  authUserId: number;
}
export interface authLogin {
  token: string;
  authUserId: number;
}

// =================== users.ts  =================== //

export interface profile {
  uId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
}

export interface userProfile {
  user: profile;
}

export interface usersAll {
  users: profile[];
}

// =================== channels.ts  =================== //

export interface createChannels {
  channelId: number;
}

export interface Channels {
  channelId: number;
  name: string;
}

export interface listChannels {
  channels: Channels[];
}

export interface listAllChannels {
  channels: Channels[];
}

// =================== channel.ts  =================== //

export interface channelDetails {
  name: string;
  isPublic: boolean;
  ownerMembers: OwnerMember[];
  allMembers: AllMember[];
}

export class channelInvite {

}

export interface channelMessagesReturn {
  messageArray: Messages[];
  start: number;
  end: number;
}
// =================== dm.ts  =================== //

export interface dmCreate {
  dmId: number;
}

export interface dmList {
  dms: Dm[];
}

export interface dmLeaveInput {
  token: string;
  dmId: number;
}

export interface dmCreateInput {
  token: string;
  uIds: number[];
}

export interface dmMessageReturn {
  messages: Messages[];
  start: number;
  end: number;
}

// =================== message.ts  =================== //
export interface messageSend {
  messageId: number;
}

export interface messageSendDmInput {
  token: string;
  dmId: number;
  message: string;
}

export interface messageSendDmReturn {
  messageId: number;
}

//  ==========================================================
//  ==========================================================

export interface User {
  authUserId: number;
  email: string;
  password: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
  globalPermission: number;
}

export interface Session {
  authUserId: number;
  token: string;
}

export interface Channel {
  channelId: number;
  name: string;
  isPublic: boolean;
  ownerMembers: OwnerMember[];
  allMembers: AllMember[];
  messages: Messages[];
}

//  ==========================================================
//  ==========================================================

export interface Data {
  users: User[];
  sessions: Session[];
  channels: Channel[];
  dms: Dm[];
}
