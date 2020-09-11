import { DbConnection } from "./DbConnectionInterface";
import { AuthUser } from "./AuthUserInterfaces";

export interface ResolverContext {
  db?: DbConnection;
  authorization?: string;
  authUser?: AuthUser;
}