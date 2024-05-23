/**
 *  TypeScript types that can be used in Playwright system tests.
 *  @author Team Mango (Group 4)
 *  @since 2024-05-8
 *  @version 1.0
 */

/**
 * Account in the system. Consists of a username, password, role and user-id that is stored in the database.
 * 
 * Example of creating an admin user:
 * const exampleUser: User = {
			userName: 'userName',
			password: 'password',
			role: Role.admin,
      userId: '45'
		}
 */
export type Account = {
  username: string,
  password: string,
  role: Role,
  userId?: string,
};

// Enum for the different types of roles. This needs to be updated when permissions are implemented. 
export enum Role {
  user = 0,
  admin = 1,
  editor = 2,
}

// Activity can be either Technique or Exercise
export type Activity = {
  name?: string,
  description?: string,
  time?: number, // Subject to change, may use number of repetitions instead of duration
  tag?: string,
  mediaLink?: string
}

// Technique.
export type Technique = {
  name?: string,
  description?: string,
  time?: number,
  tag?: string,
  mediaLink?: string
}


//Tag
export type TagComponent = {
  tagName?: string, 
  tagId?: number
}

// Exercise
export type Exercise = {
  name?: string,
  description?: string,
  time?: number,
  tag?: string,
  mediaLink?: string
}

// Workout
export type Workout = {
  name?: string,
  description?: string,
  techniques?: Technique[],
  exercises?: Exercise[],
  isPrivate?: boolean,
  hasAccess?: Account[],
  tags?: string[]
}