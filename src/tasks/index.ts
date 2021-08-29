import * as yaml from 'js-yaml';
import * as fs from "fs";
import { I18n, Task, Type, TypeMaterial } from "./type";
import { SqliteTask } from "./sqlite";

const TypeIdsYamlPath = '/fsd/typeIDs.yaml';

const TypeMaterialsYamlPath = '/fsd/typeMaterials.yaml';

/**
 * 解析typeIDs.yaml文件
 * @param path sde目录
 * @param tasks 参与的任务
 */
async function parseTypeIds(path: string, tasks: Task[]) {
  const doc: any = yaml.load(fs.readFileSync(path + TypeIdsYamlPath, 'utf8'));
  for (const id in doc) {
    const type = toType(+id, doc[id]);
    for(const task of tasks) {
      await task.onType(type);
    }
  }
}

function toType(id: number, type: any): Type {
  const name: I18n[] = [];
  for (const language in type.name) {
    const value = type.name[language];
    name.push({
      language, value
    });
  }
  const description: I18n[] = [];
  for (const language in type.description) {
    const value = type.name[language];
    description.push({
      language, value
    });
  }
  return {
    id,
    name,
    description,
    groupID: type.groupID,
    mass: type.mass,
    portionSize: type.portionSize,
    published: type.published,
    volume: type.volume,
    radius: type.radius,
    graphicID: type.graphicID,
    soundID: type.soundID,
    iconID: type.iconID,
    raceID: type.raceID,
    sofFactionName: type.sofFactionName,
    basePrice: type.basePrice,
    marketGroupID: type.marketGroupID,
    capacity: type.capacity,
    metaGroupID: type.metaGroupID,
    variationParentTypeID: type.variationParentTypeID,
    factionID: type.factionID,
    sofMaterialSetID: type.sofMaterialSetID
  }
}

/**
 * 解析typeMaterials.yaml文件
 * @param path sde目录
 * @param tasks 参与的任务
 */
async function parseTypeMaterials(path: string, tasks: Task[]) {
  const doc: any = yaml.load(fs.readFileSync(path + TypeMaterialsYamlPath, 'utf8'));
  for (const id in doc) {
    const item = doc[id];
    const materials = item['materials'];
    for (const material of materials) {
      for (const task of tasks) {
        await task.onTypeMaterial(toTypeMaterial(+id, material));
      }
    }
  }
}

function toTypeMaterial(typeId: number, typeMaterial: any): TypeMaterial {
  return {
    typeId,
    materialTypeID: typeMaterial.materialTypeID,
    quantity: typeMaterial.quantity
  }
}

/**
 * 开始任务
 * @param path sde所在的目录
 */
export async function startTasks(path: string) {
  const tasks = [ new SqliteTask() ];
  for (const task of tasks) {
    await task.start();
  }
  try {
    await parseTypeIds(path, tasks);
    await parseTypeMaterials(path, tasks);
  } finally {
    for (const task of tasks) {
      await task.end();
    }
  }
}