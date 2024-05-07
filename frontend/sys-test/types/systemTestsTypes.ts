/**
 * TypeScript type for a user in the system. Consist of a user name, password and role.
 * 
 * Example of creating an admin user:
 * const exampleUser: User = {
			userName: 'userName',
			password: 'password',
			role: Role.admin
		}
 */
export type Account = {
  username: string,
  password: string,
  role: Role,
  userId?: string,
};

/**
 * Enum for the different types of roles. 
 */
export enum Role {
  user = 0,
  admin = 1,
  editor = 2,
}