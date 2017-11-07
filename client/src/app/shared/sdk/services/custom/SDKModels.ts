/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { AccessToken } from '../../models/AccessToken';
import { UserCredential } from '../../models/UserCredential';
import { UserIdentity } from '../../models/UserIdentity';
import { RoleMapping } from '../../models/RoleMapping';
import { Role } from '../../models/Role';
import { Package } from '../../models/Package';
import { Container } from '../../models/Container';
import { PackageFile } from '../../models/PackageFile';
import { PackageVersion } from '../../models/PackageVersion';
import { Section } from '../../models/Section';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    AccessToken: AccessToken,
    UserCredential: UserCredential,
    UserIdentity: UserIdentity,
    RoleMapping: RoleMapping,
    Role: Role,
    Package: Package,
    Container: Container,
    PackageFile: PackageFile,
    PackageVersion: PackageVersion,
    Section: Section,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
