// 项目接口：增删改查
import { STORAGE_KEYS, delay, readJSON, writeJSON, uid } from './db';
import { seedProjects } from './seed';
import type { Project } from '@/types';

/** 新建 / 更新项目时传入的数据（id 与 createdAt 由接口层维护） */
export type ProjectInput = Omit<Project, 'id' | 'createdAt'>;

export const projectsApi = {
  /** 获取项目列表 */
  async list(): Promise<Project[]> {
    await delay(150);
    const projects = readJSON<Project[] | null>(STORAGE_KEYS.projects, null);
    if (!projects) {
      writeJSON(STORAGE_KEYS.projects, seedProjects);
      return [...seedProjects];
    }
    return projects;
  },

  /** 新增项目 */
  async create(input: ProjectInput): Promise<Project> {
    await delay(200);
    const projects = await projectsApi.list();
    const project: Project = {
      ...input,
      id: uid(),
      createdAt: new Date().toISOString(),
    };
    writeJSON(STORAGE_KEYS.projects, [project, ...projects]);
    return project;
  },

  /** 更新项目 */
  async update(id: string, input: ProjectInput): Promise<Project> {
    await delay(200);
    const projects = await projectsApi.list();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('项目不存在');
    const updated: Project = { ...projects[index], ...input, id };
    projects[index] = updated;
    writeJSON(STORAGE_KEYS.projects, projects);
    return updated;
  },

  /** 删除项目 */
  async remove(id: string): Promise<void> {
    await delay(200);
    const projects = await projectsApi.list();
    writeJSON(
      STORAGE_KEYS.projects,
      projects.filter((p) => p.id !== id),
    );
  },
};
