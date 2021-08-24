-- 蓝图
CREATE TABLE "blueprint" (
  "id"                  INTEGER,
  "maxProductionLimit"  INTEGER,
  PRIMARY KEY("id")
);
CREATE TABLE "blueprintActivity" (
  "id"    INTEGER,
  "type"  INTEGER, -- 0 拷贝 1 发明 2 制造 3 材料研究 4 时间研究 5 反应
  "time"  INTEGER,
  PRIMARY KEY("id", "type")
);
CREATE TABLE "blueprintMaterial" (
  "id"           INTEGER,
  "activityType" INTEGER,
  "typeID"       INTEGER,
  "quantity"     INTEGER,
  PRIMARY KEY("id", "activityType", "typeID")
);
CREATE TABLE "blueprintSkill" (
  "id"           INTEGER,
  "activityType" INTEGER,
  "typeID"       INTEGER,
  "level"        INTEGER,
  PRIMARY KEY("id", "activityType", "typeID")
);
CREATE TABLE "blueprintProduct" (
  "id"           INTEGER,
  "activityType" INTEGER,
  "probability"  REAL,
  "typeID"       INTEGER,
  "quantity"     INTEGER,
  PRIMARY KEY("id", "activityType", "typeID")
);

-- type
CREATE TABLE "type" (
  "id"                      INTEGER,
  "groupID"                 INTEGER,
  "mass"                    REAL,
  "portionSize"             INTEGER,
  "published"               BOOLEAN,
  "volume"                  REAL,
  "radius"                  REAL,
  "graphicID"               INTEGER,
  "soundID"                 INTEGER,
  "iconID"                  INTEGER,
  "raceID"                  INTEGER,
  "sofFactionName"          TEXT,
  "basePrice"               REAL,
  "marketGroupID"           REAL,
  "capacity"                REAL,
  "metaGroupID"             INTEGER,
  "variationParentTypeID"   INTEGER,
  "factionID"               INTEGER,
  "sofMaterialSetID"        INTEGER,
  PRIMARY KEY("id")
);
CREATE TABLE "typeI18n" (
	"typeId"       INTEGER,
	"key"      TEXT, -- name, description
	"language" TEXT, -- zh
	"value"	   TEXT,
	PRIMARY KEY("typeId", "key", "language")
);
-- TODO type_masteries
CREATE TABLE "typeMaterials" (
  typeID         INTEGER,
  materialTypeID INTEGER,
  quantity       INTEGER,
	PRIMARY KEY(typeId, materialTypeID)
);
-- TODO type_traits