export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

const PLACE_TYPE_PRIORITY = [
  "locality",
  "postal_town",
  "administrative_area_level_3",
  "sublocality_level_1",
  "administrative_area_level_2",
] as const;

function componentWithType(
  components: AddressComponent[],
  type: string,
): AddressComponent | undefined {
  return components.find((c) => c.types.includes(type));
}

export function generalLocationFromAddressComponents(
  components: AddressComponent[] | undefined,
): string | null {
  if (!components?.length) {
    return null;
  }

  let placeName: string | null = null;
  for (const type of PLACE_TYPE_PRIORITY) {
    const match = componentWithType(components, type);
    if (match) {
      placeName = match.long_name;
      break;
    }
  }

  if (!placeName) {
    return null;
  }

  const state = componentWithType(components, "administrative_area_level_1");
  if (state?.short_name) {
    return `${placeName}, ${state.short_name}`;
  }

  return placeName;
}