// import { test, expect } from './fixtures';

/**
 * Some basic system tests for login and registry of a new user.
 *
 *  @author Team Durian (Group 3), Team Mango (Group 4)
 *  @since 2024-05-2
 *  @version 2.0
 */

//test.describe('ST-1 Login', () => {
	// let userId;
	// const exampleUser: User = {
	// 	userName: 'lego',
	// 	password: 'securePass1234',
	// 	role: Role.admin
	// }

	// test.beforeAll('create a new user once before all tests in this describe', async () => {
	// 	const response = await UserApi.register_user(exampleUser)
	// 	userId = response.userId
	// })

	// test.beforeEach('navigate to root page before each test in this describe', async ({page}) => {
	// 	await page.goto('/');
	// })

	// test.afterAll('removes the created user once after all tests in this describe', async () => {
	// 	await UserApi.remove_user(userId)
	// }) 

	// test('1. Correct login should redirect to /plan', async ({ page }) => {
	// 	// 1. Fill in user name and password for the newly created user.
	// 	await page.locator('input[type="user"]').fill(exampleUser.userName)
	// 	await page.locator('input[type="password"]').fill(exampleUser.password)

	// 	// 2. Press 'Logga in' to verify that we are redirected to /plan
	// 	await page.locator('#login-button').click()
	// 	await expect(page).toHaveURL(/\**\/plan/)
	// });

	// test('2. Incorrect password for login should return 200', async ({ page }) => {
	// 	// 1. Fill in user name and wrong password.
	// 	await page.locator('input[type="user"]').fill(exampleUser.userName);
  //  	await page.locator('input[type="password"]').fill('xxx');

	// 	// 2. Press 'Logga in' to verify that we get response message. 
	// 	await page.locator('#login-button').click();
	// 	await expect(page.getByText('Felaktigt')).toBeVisible();
	// });
//});

