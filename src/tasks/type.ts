export interface Task {

  start(): Promise<void>;

  onType(type: Type): Promise<void>;

  onTypeMaterial(typeMaterial: TypeMaterial): Promise<void>;

  end(): Promise<void>;
}

/**
 * 多语言
 */
export class I18n {

  language: string;

  value: string;

}

export class Type {

  id: number;

  name: I18n[];

  description: I18n[];

  groupID: number;

  mass: number;

  portionSize: number;

  published: boolean;

  volume: number;

  radius: number;

  graphicID: number;

  soundID: number;

  iconID: number;

  raceID: number;

  sofFactionName: string;

  basePrice: number;

  marketGroupID: number;

  capacity: number;

  metaGroupID: number;

  variationParentTypeID: number;

  factionID: number;

  sofMaterialSetID: number;
}

export class TypeMaterial {

  typeId: number;

  materialTypeID: number;

  quantity: number;

}