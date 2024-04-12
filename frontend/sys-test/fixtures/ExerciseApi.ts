import { expect, request } from '@playwright/test';
import { UserApi } from './UserApi';


export class ExerciseApi {

  private static async make_ctx() {
    const ctx = await request.newContext({
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'token': await UserApi.get_admin_token(),
      },
    });

    return ctx;
  }

  static async add_exercise(exercise: {name: string, description: string, duration: number}): Promise<number> {
    const ctx = await ExerciseApi.make_ctx();

    const response = await ctx.post('/api/exercises/add', {
			data: exercise,
    });
    expect(response.status()).toBeLessThan(400);

    const json = await response.json();
    return json['id'];
  }

  static async delete_exercise(id: number) {
    const ctx = await ExerciseApi.make_ctx();
    await ctx.delete('/api/exercises/remove/' + id);
  }

  static async delete_all_exercises() {
    const ctx = await ExerciseApi.make_ctx();

    const exercises = await ctx.get('/api/exercises/all')
      .then(resp => resp.json())
      .catch(e => []);

    await exercises.forEach(element => {
      ExerciseApi.delete_exercise(element['id'])
    });
  }

}
