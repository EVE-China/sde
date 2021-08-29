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
CREATE TABLE "typeMaterials" (
  typeID         INTEGER,
  materialTypeID INTEGER,
  quantity       INTEGER,
	PRIMARY KEY(typeId, materialTypeID)
);