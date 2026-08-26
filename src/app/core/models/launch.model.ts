export interface Launch {
  flight_number: number;
  mission_name: string;
  launch_date_local: string;
  launch_success: boolean | null;
  links: {
    mission_patch_small: string | null;
  };
}
