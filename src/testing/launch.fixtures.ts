import { Launch } from "@/app/core/models/launch.model";

// default launch for the tests, pass only the fields the test cares about
export function makeLaunch(overrides: Partial<Launch> = {}): Launch {
  return {
    flight_number: 1,
    mission_name: "FalconSat",
    launch_year: "2006",
    launch_date_local: "2006-03-25T10:30:00+12:00",
    launch_success: true,
    details: "A test mission.",
    rocket: { rocket_name: "Falcon 1", rocket_type: "Merlin A" },
    launch_site: { site_name_long: "Kwajalein Atoll Omelek Island" },
    links: {
      mission_patch: "https://example.test/patch.png",
      mission_patch_small: "https://example.test/patch-small.png",
      article_link: "https://example.test/article",
      wikipedia: "https://example.test/wiki",
      video_link: "https://example.test/video",
    },
    ...overrides,
  };
}
