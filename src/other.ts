import { setData } from './dataStore';
import { Data } from './interface';

export function clearV1() {
  const data: Data = {
    users: [],
    sessions: [],
    channels: [],
    dms: [],
  };

  setData(data);

  return {};
}
