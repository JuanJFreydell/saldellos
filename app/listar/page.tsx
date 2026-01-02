"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";

interface Country {
  country_id: string;
  country_name: string;
}

interface City {
  city_id: string;
  city_name: string;
}

interface Neighborhood {
  neighborhood_id: string;
  neighborhood_name: string;
}

interface Subcategory {
  subcategory_id: string;
  subcategory_name: string;
}

export default function ListarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Location data
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Loading states
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address_line_1: "",
    address_line_2: "",
    coordinates: "",
    price: "",
    country: "",
    country_id: "",
    city: "",
    city_id: "",
    neighborhood: "",
    neighborhood_id: "",
    subcategory_id: "",
    pictures: [""], // Start with one photo field
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch countries and subcategories on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchCountries();
      fetchSubcategories();
    }
  }, [status]);

  // Fetch cities when country is selected
  useEffect(() => {
    if (formData.country_id) {
      fetchCities(formData.country_id);
    } else {
      setCities([]);
      setNeighborhoods([]);
      setFormData((prev) => ({
        ...prev,
        city: "",
        city_id: "",
        neighborhood: "",
        neighborhood_id: "",
      }));
    }
  }, [formData.country_id]);

  // Fetch neighborhoods when city is selected
  useEffect(() => {
    if (formData.city_id) {
      fetchNeighborhoods(formData.city_id);
    } else {
      setNeighborhoods([]);
      setFormData((prev) => ({
        ...prev,
        neighborhood: "",
        neighborhood_id: "",
      }));
    }
  }, [formData.city_id]);

  async function fetchCountries() {
    try {
      setLoadingCountries(true);
      const response = await fetch("/api/locations/countries");
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      setCountries(data.countries || []);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to load countries");
    } finally {
      setLoadingCountries(false);
    }
  }

  async function fetchCities(countryId: string) {
    try {
      setLoadingCities(true);
      const response = await fetch(`/api/locations/cities?country_id=${countryId}`);
      if (!response.ok) throw new Error("Failed to fetch cities");
      const data = await response.json();
      setCities(data.cities || []);
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  }

  async function fetchNeighborhoods(cityId: string) {
    try {
      setLoadingNeighborhoods(true);
      const response = await fetch(`/api/locations/neighborhoods?city_id=${cityId}`);
      if (!response.ok) throw new Error("Failed to fetch neighborhoods");
      const data = await response.json();
      setNeighborhoods(data.neighborhoods || []);
    } catch (err) {
      console.error("Error fetching neighborhoods:", err);
      setError("Failed to load neighborhoods");
    } finally {
      setLoadingNeighborhoods(false);
    }
  }

  async function fetchSubcategories() {
    try {
      setLoadingSubcategories(true);
      // Fetch subcategories for "para la venta" category (no category_id needed)
      const response = await fetch("/api/locations/subcategories");
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      const data = await response.json();
      setSubcategories(data.subcategories || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError("Failed to load subcategories");
    } finally {
      setLoadingSubcategories(false);
    }
  }

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Don't render form if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "country") {
      const country = countries.find((c) => c.country_id === value);
      setFormData((prev) => ({
        ...prev,
        country: country?.country_name || "",
        country_id: value,
      }));
    } else if (name === "city") {
      const city = cities.find((c) => c.city_id === value);
      setFormData((prev) => ({
        ...prev,
        city: city?.city_name || "",
        city_id: value,
      }));
    } else if (name === "neighborhood") {
      const neighborhood = neighborhoods.find((n) => n.neighborhood_id === value);
      setFormData((prev) => ({
        ...prev,
        neighborhood: neighborhood?.neighborhood_name || "",
        neighborhood_id: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...formData.pictures];
    newPhotos[index] = value;
    setFormData((prev) => ({ ...prev, pictures: newPhotos }));
  };

  const addPhotoField = () => {
    setFormData((prev) => ({ ...prev, pictures: [...prev.pictures, ""] }));
  };

  const removePhotoField = (index: number) => {
    if (formData.pictures.length > 1) {
      const newPhotos = formData.pictures.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, pictures: newPhotos }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Filter out empty photo URLs
    const validPhotos = formData.pictures.filter((photo) => photo.trim() !== "");

    if (validPhotos.length === 0) {
      setError("At least one photo is required");
      setLoading(false);
      return;
    }

    if (!session?.user?.id) {
      setError("User session not found");
      setLoading(false);
      return;
    }

    // Get user_id from session
    try {
      const userResponse = await fetch("/api/user");
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      const ownerId = userData.user_id;

      // Prepare request body matching API expectations
      const requestBody: any = {
        owner_id: ownerId,
        title: formData.title,
        description: formData.description,
        address_line_1: formData.address_line_1,
        coordinates: formData.coordinates,
        price: formData.price,
        subcategory_id: formData.subcategory_id,
        thumbnail: validPhotos[0], // First photo is thumbnail
        pictures: validPhotos,
        country: formData.country,
      };

      // Add optional fields
      if (formData.address_line_2.trim()) {
        requestBody.address_line_2 = formData.address_line_2;
      }
      if (formData.city) {
        requestBody.city = formData.city;
      }
      if (formData.neighborhood) {
        requestBody.neighborhood = formData.neighborhood;
      }

      const response = await fetch("/api/manageListings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create listing");
      }

      setSuccess(true);
      // Reset form
      setFormData({
        title: "",
        description: "",
        address_line_1: "",
        address_line_2: "",
        coordinates: "",
        price: "",
        country: "",
        country_id: "",
        city: "",
        city_id: "",
        neighborhood: "",
        neighborhood_id: "",
        subcategory_id: "",
        pictures: [""],
      });

      // Redirect after success
      setTimeout(() => {
        router.push("/loggedUserPage");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black py-12 px-4">
      <main className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-semibold text-black dark:text-zinc-50">
          Create New Listing
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-400 text-green-700 px-4 py-3">
            Listing created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter listing title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describe your listing"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country_id}
              onChange={handleInputChange}
              required
              disabled={loadingCountries}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              City {formData.country_id ? "(optional)" : ""}
            </label>
            <select
              id="city"
              name="city"
              value={formData.city_id}
              onChange={handleInputChange}
              disabled={!formData.country_id || loadingCities}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </select>
          </div>

          {/* Neighborhood */}
          <div>
            <label
              htmlFor="neighborhood"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Neighborhood {formData.city_id ? "(optional)" : ""}
            </label>
            <select
              id="neighborhood"
              name="neighborhood"
              value={formData.neighborhood_id}
              onChange={handleInputChange}
              disabled={!formData.city_id || loadingNeighborhoods}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100"
            >
              <option value="">Select a neighborhood</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood.neighborhood_id} value={neighborhood.neighborhood_id}>
                  {neighborhood.neighborhood_name}
                </option>
              ))}
            </select>
          </div>

          {/* Address Line 1 */}
          <div>
            <label
              htmlFor="address_line_1"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Address Line 1 *
            </label>
            <input
              type="text"
              id="address_line_1"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter street address"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label
              htmlFor="address_line_2"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Address Line 2 (optional)
            </label>
            <input
              type="text"
              id="address_line_2"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          {/* Coordinates */}
          <div>
            <label
              htmlFor="coordinates"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Coordinates (lat,lng) *
            </label>
            <input
              type="text"
              id="coordinates"
              name="coordinates"
              value={formData.coordinates}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 4.7110,-74.0721"
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Price *
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter price"
            />
          </div>

          {/* Subcategory */}
          <div>
            <label
              htmlFor="subcategory_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Tipo de artículo * (Subcategoría)
            </label>
            <select
              id="subcategory_id"
              name="subcategory_id"
              value={formData.subcategory_id}
              onChange={handleInputChange}
              required
              disabled={loadingSubcategories}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100"
            >
              <option value="">Seleccione un tipo de artículo</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                  {subcategory.subcategory_name}
                </option>
              ))}
            </select>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Photo URLs * (at least one required)
            </label>
            {formData.pictures.map((photo, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => handlePhotoChange(index, e.target.value)}
                  required={index === 0}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="https://example.com/photo.jpg"
                />
                {formData.pictures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhotoField(index)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPhotoField}
              className="mt-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-colors"
            >
              Add Another Photo
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/loggedUserPage")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
