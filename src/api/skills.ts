// 技能接口：增删改查
import { STORAGE_KEYS, delay, readJSON, writeJSON, uid } from './db';
import { seedSkills } from './seed';
import type { Skill } from '@/types';

/** 新建 / 更新技能时传入的数据（不含 id） */
export type SkillInput = Omit<Skill, 'id'>;

export const skillsApi = {
  /** 获取技能列表 */
  async list(): Promise<Skill[]> {
    await delay(150);
    const skills = readJSON<Skill[] | null>(STORAGE_KEYS.skills, null);
    if (!skills) {
      writeJSON(STORAGE_KEYS.skills, seedSkills);
      return [...seedSkills];
    }
    return skills;
  },

  /** 新增技能 */
  async create(input: SkillInput): Promise<Skill> {
    await delay(200);
    const skills = await skillsApi.list();
    const skill: Skill = { ...input, id: uid() };
    writeJSON(STORAGE_KEYS.skills, [skill, ...skills]);
    return skill;
  },

  /** 更新技能 */
  async update(id: string, input: SkillInput): Promise<Skill> {
    await delay(200);
    const skills = await skillsApi.list();
    const index = skills.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('技能不存在');
    const updated: Skill = { ...skills[index], ...input, id };
    skills[index] = updated;
    writeJSON(STORAGE_KEYS.skills, skills);
    return updated;
  },

  /** 删除技能 */
  async remove(id: string): Promise<void> {
    await delay(200);
    const skills = await skillsApi.list();
    writeJSON(
      STORAGE_KEYS.skills,
      skills.filter((s) => s.id !== id),
    );
  },
};
