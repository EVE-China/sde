import * as fs from "fs";
import { Task, Type, TypeMaterial } from "../type";
import { Database } from "sqlite3";
import { PromiseDatabase } from "./help";

const ResourcePath = "resources/sql/sqlite.sql";

const DbDirectory = "dist/publish/sqlite";

const DbPath = DbDirectory + "/eve.db";

/**
 * 转义
 * @param obj 字符串
 */
 function escape(obj: string): string {
  let value = '';
  for(let i = 0; i < obj.length; i++) {
    let ch = obj.charAt(i);
    if ('"' === ch) {
      value += '\\"';
    }
    value += ch;
  }
  return value;
}

function format(value: any) {
  if (value) {
    if (typeof value === "string") {
      return escape(value);
    } else {
      return value;
    }
  }
  return "null";
}

export class SqliteTask implements Task {

  private db: PromiseDatabase;

  async start(): Promise<void> {
    // 创建目录
    if (!fs.existsSync(DbDirectory)) {
      fs.mkdirSync(DbDirectory, { recursive: true });
    }
    // 创建一个空文件
    const fd = fs.openSync(DbPath, 'w')
    fs.closeSync(fd);
    this.db = new PromiseDatabase(new Database(DbPath));
    let sql = fs.readFileSync(ResourcePath).toString();
    await this.db.exec(sql);
    console.log("sqlite: begin");
    return this.db.run("begin");
  }

  async onType(type: Type): Promise<void> {
    console.log(`sqlite: onType:${type.id}`);
    await this.db.run(`REPLACE INTO "type"("id", "groupID", "mass", "portionSize", "published", "volume", "radius", "graphicID", "soundID", "iconID", "raceID", "sofFactionName", "basePrice", "marketGroupID", "capacity", "metaGroupID", "variationParentTypeID", "factionID", "sofMaterialSetID") VALUES(
      ${type.id}, ${format(type.groupID)}, ${format(type.mass)}, ${format(type.portionSize)}, ${format(type.published)}, ${format(type.volume)}, ${format(type.radius)}, ${format(type.graphicID)}, ${format(type.soundID)}, ${format(type.iconID)}, ${format(type.raceID)}, "${format(type.sofFactionName)}", ${format(type.basePrice)}, ${format(type.marketGroupID)}, ${format(type.capacity)}, ${format(type.metaGroupID)}, ${format(type.variationParentTypeID)}, ${format(type.factionID)}, ${format(type.sofMaterialSetID)}
    );`);
    for (const item of type.name) {
      // 暂时不需要中文以外的数据
      if ("zh" !== item.language) {
        continue;
      }
      console.log(`sqlite: onType:${type.id} name:${item.value}`);
      await this.db.run(`REPLACE INTO "typeI18n"("typeId", "key", "language", "value") VALUES(
        ${type.id}, "name", "${format(item.language)}", "${format(item.value)}"
      );`);
    }
    /* 暂时不需要介绍
    for (const item of type.description) {
      console.log(`sqlite: onType:${type.id} description:${item.value}`);
      await this.db.run(`REPLACE INTO "typeI18n"("typeId", "key", "language", "value") VALUES (
        ${type.id}, "description", "${format(item.language)}", "${format(item.value)}"
      );`);
    }
    */
  }

  async onTypeMaterial(typeMaterial: TypeMaterial): Promise<void> {
    console.log(`sqlite: onTypeMaterial:${typeMaterial.typeId} ${typeMaterial.materialTypeID} ${typeMaterial.quantity}`);
    await this.db.run(`REPLACE INTO "typeMaterials"("typeID", "materialTypeID", "quantity") VALUES(
      ${typeMaterial.typeId}, ${format(typeMaterial.materialTypeID)}, ${format(typeMaterial.quantity)}
    );`);
  }

  async end(): Promise<void> {
    console.log("sqlite: commit");
    await this.db.run("commit");
    console.log("sqlite: close");
    return this.db.close();
  }
  
}