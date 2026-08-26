// The SpaceX API is down, so production serves the bundled mock too.
//
// The endpoint the README points at is v4, but launches.json is a v3 payload:
// v3 gives mission_name, launch_success and links.mission_patch_small, while
// v4 renames them to name, success and links.patch.small. Pointing production
// at v4 would build fine and then show an empty list, so the url that matches
// this data is https://api.spacexdata.com/v3/launches/past.
export const environment = {
  production: true,
  apiUrl: "launches.json",
};
