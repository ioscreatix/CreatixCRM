/* tslint:disable */
import {
  Package,
  PackageFile
} from '../index';

declare var Object: any;
export interface PackageVersionInterface {
  "version": string;
  "changes"?: string;
  "dependencies"?: string;
  "raw"?: any;
  "id"?: any;
  "packageId"?: any;
  package?: Package;
  file?: PackageFile;
}

export class PackageVersion implements PackageVersionInterface {
  "version": string;
  "changes": string;
  "dependencies": string;
  "raw": any;
  "id": any;
  "packageId": any;
  package: Package;
  file: PackageFile;
  constructor(data?: PackageVersionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageVersion`.
   */
  public static getModelName() {
    return "PackageVersion";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageVersion for dynamic purposes.
  **/
  public static factory(data: PackageVersionInterface): PackageVersion{
    return new PackageVersion(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'PackageVersion',
      plural: 'PackageVersions',
      properties: {
        "version": {
          name: 'version',
          type: 'string'
        },
        "changes": {
          name: 'changes',
          type: 'string'
        },
        "dependencies": {
          name: 'dependencies',
          type: 'string'
        },
        "raw": {
          name: 'raw',
          type: 'any'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
      },
      relations: {
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package'
        },
        file: {
          name: 'file',
          type: 'PackageFile',
          model: 'PackageFile'
        },
      }
    }
  }
}
