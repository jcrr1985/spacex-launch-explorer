import { Launch } from '@/app/core/models/launch.model';
import { createAction, props } from '@ngrx/store';


export const loadLaunches = createAction('[Launch List] Load Launches');
export const loadLaunchesSuccess = createAction('[Launch List] Load Success', props<{ launches: Launch[] }>());
export const loadLaunchesFailure = createAction('[Launch List] Load Failure', props<{ error: string  }>());
