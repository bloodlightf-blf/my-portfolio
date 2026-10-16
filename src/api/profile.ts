// 个人信息接口
import { STORAGE_KEYS, delay, readJSON, writeJSON } from './db';
import { seedProfile } from './seed';
import type { Profile } from '@/types';

export const profileApi = {
  /** 获取个人信息 */
  async getProfile(): Promise<Profile> {
    await delay(150);
    const profile = readJSON<Profile | null>(STORAGE_KEYS.profile, null);
    if (!profile) {
      // 兜底：数据被清空时重新写入种子数据
      writeJSON(STORAGE_KEYS.profile, seedProfile);
      return { ...seedProfile, timeline: [...seedProfile.timeline] };
    }
    return profile;
  },

  /** 更新个人信息 */
  async updateProfile(profile: Profile): Promise<Profile> {
    await delay(250);
    writeJSON(STORAGE_KEYS.profile, profile);
    return profile;
  },
};
