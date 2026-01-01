import { supabaseAdmin } from "./supabase";

export interface ListingData {
  listing_id: string;
  description: string;
  title: string;
  subcategory: string | null;
  category: string | null;
  price: string;
  thumbnail: string;
  coordinates: string | null;
  neighborhood: string | null;
  city: string | null;
  country: string | null;
  pictureURLs: string[];
  address_line_1?: string | null;
  address_line_2?: string | null;
}

export async function getListingById(listingId: string): Promise<ListingData | null> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured");
  }

  const adminClient = supabaseAdmin;

  // Fetch listing data from listings table
  const { data: listingData, error: listingError } = await adminClient
    .from("listings")
    .select(`
      listing_id,
      description,
      title,
      price,
      thumbnail,
      subcategory_id
    `)
    .eq("listing_id", listingId)
    .single();

  if (listingError || !listingData) {
    return null;
  }

  // Get address data
  const { data: address } = await adminClient
    .from("listing_addresses")
    .select("coordinates, neighborhood_id, address_line_1, address_line_2")
    .eq("listing_id", listingId)
    .single();

  let neighborhood = null;
  let city = null;
  let country = null;

  if (address?.neighborhood_id) {
    const { data: neighborhoodData } = await adminClient
      .from("listing_neighborhoods")
      .select("neighborhood_name, city_id")
      .eq("neighborhood_id", address.neighborhood_id)
      .single();

    neighborhood = neighborhoodData?.neighborhood_name || null;

    if (neighborhoodData?.city_id) {
      const { data: cityData } = await adminClient
        .from("listing_cities")
        .select("city_name, country_id")
        .eq("city_id", neighborhoodData.city_id)
        .single();

      city = cityData?.city_name || null;

      if (cityData?.country_id) {
        const { data: countryData } = await adminClient
          .from("countries")
          .select("country_name")
          .eq("country_id", cityData.country_id)
          .single();

        country = countryData?.country_name || null;
      }
    }
  }

  // Get subcategory and category
  let subcategory = null;
  let category = null;

  if (listingData.subcategory_id) {
    const { data: subcategoryData } = await adminClient
      .from("listing_subcategories")
      .select("subcategory_name, category_id")
      .eq("subcategory_id", listingData.subcategory_id)
      .single();

    subcategory = subcategoryData?.subcategory_name || null;

    if (subcategoryData?.category_id) {
      const { data: categoryData } = await adminClient
        .from("listing_categories")
        .select("category_name")
        .eq("category_id", subcategoryData.category_id)
        .single();

      category = categoryData?.category_name || null;
    }
  }

  // Get all photos for this listing
  const { data: photos, error: photosError } = await adminClient
    .from("listing_photos")
    .select("photo_url")
    .eq("listing_id", listingId)
    .order("photo_order", { ascending: true });

  if (photosError) {
    console.error("Error fetching listing photos:", photosError);
  }

  const pictureURLs = photos?.map((photo: any) => photo.photo_url) || [];

  return {
    listing_id: listingData.listing_id,
    description: listingData.description,
    title: listingData.title,
    subcategory,
    category,
    price: listingData.price,
    thumbnail: listingData.thumbnail,
    coordinates: address?.coordinates || null,
    neighborhood,
    city,
    country,
    pictureURLs,
    address_line_1: address?.address_line_1 || null,
    address_line_2: address?.address_line_2 || null,
  };
}

