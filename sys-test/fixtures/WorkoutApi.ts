import { expect, request } from '@playwright/test';
import { UserApi } from './UserApi';


export class WorkoutApi {

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

  static async add_workout(workout: {name: string, desc?: string, hidden: boolean, duration: number}): Promise<number> {
    const ctx = await WorkoutApi.make_ctx();

    workout['author'] = 1;
    workout['created'] = new Date().toISOString().split('T')[0];
    workout['changed'] = new Date().toISOString().split('T')[0];
    workout['date'] = new Date().toISOString().split('T')[0];

    const response = await ctx.post('/api/workouts/add_full_workout', {
      data: {
        workout: workout,
        activities: [],
      },
    });
    expect(response.status()).toBeLessThan(400);

    const json = await response.json();
    return json['id'];
  }

  static async delete_workout(id: number) {
    const ctx = await WorkoutApi.make_ctx();
    const response = await ctx.delete('/api/workouts/delete_full_workout/' + id);
    expect(response.status()).toBeLessThan(400);
  }

  static async delete_all_workouts() {
    const ctx = await WorkoutApi.make_ctx();

    const workouts_response = await ctx.get('/api/workouts/all');
    expect(workouts_response.status()).toBeLessThan(400);
    const workouts = await workouts_response.json();

    for(const element in workouts) {
      await WorkoutApi.delete_workout(Number.parseInt(element));
    }
  }
}