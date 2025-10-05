"use client";

import { useEffect, useRef, useState } from "react";
import { addressesAPI } from "../lib/api";

interface Address {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  zipCode?: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  onSelectAddress?: (address: Address) => void;
  selectable?: boolean;
}

export default function AddressManager({
  onSelectAddress,
  selectable = false,
}: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    label: "",
    address: "",
    latitude: 0,
    longitude: 0,
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);

  useEffect(() => {
    fetchAddresses();
    loadGoogleMapsScript();
  }, []);

  const loadGoogleMapsScript = () => {
    if (window.google) {
      initAutocomplete();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => initAutocomplete();
    document.head.appendChild(script);
  };

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    const auto = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
    });

    auto.addListener("place_changed", () => {
      const place = auto.getPlace();
      if (!place.geometry) return;

      const extractComponent = (type: string) => {
        const component = place.address_components?.find((c: any) =>
          c.types.includes(type)
        );
        return component?.long_name || "";
      };

      setFormData((prev) => ({
        ...prev,
        address: place.formatted_address || "",
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        city: extractComponent("locality"),
        state: extractComponent("administrative_area_level_1"),
        zipCode: extractComponent("postal_code"),
      }));
    });

    setAutocomplete(auto);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressesAPI.getAddresses();
      setAddresses(response.data);

      // Auto-select default if in selectable mode
      if (selectable && response.data.length > 0) {
        const defaultAddr = response.data.find((a: Address) => a.isDefault);
        if (defaultAddr) {
          setSelectedId(defaultAddr.id);
          onSelectAddress?.(defaultAddr);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address || !formData.label) {
      alert("Please enter both label and address");
      return;
    }

    try {
      if (editingId) {
        await addressesAPI.updateAddress(editingId, formData);
      } else {
        await addressesAPI.createAddress(formData);
      }

      await fetchAddresses();
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      await addressesAPI.deleteAddress(id);
      await fetchAddresses();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressesAPI.setDefaultAddress(id);
      await fetchAddresses();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to set default address");
    }
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label,
      address: address.address,
      latitude: address.latitude,
      longitude: address.longitude,
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      isDefault: address.isDefault,
    });
    setShowAddForm(true);
  };

  const handleSelect = (address: Address) => {
    if (!selectable) return;
    setSelectedId(address.id);
    onSelectAddress?.(address);
  };

  const resetForm = () => {
    setFormData({
      label: "",
      address: "",
      latitude: 0,
      longitude: 0,
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">
          {selectable ? "Select Service Location" : "My Addresses"}
        </h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (e.g., Home, Office)
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Home"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Address with Google Autocomplete */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                ref={inputRef}
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Start typing your address..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Start typing to see suggestions from Google Maps
              </p>
            </div>

            {/* Additional Info (auto-filled) */}
            {formData.city && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    readOnly
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    readOnly
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    readOnly
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            )}

            {/* Set as Default */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Set as default address
              </span>
            </label>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                {editingId ? "Update Address" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Addresses Yet
            </h3>
            <p className="text-gray-600">
              Add your first address to get started
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => handleSelect(address)}
              className={`p-5 border-2 rounded-xl transition-all ${
                selectable ? "cursor-pointer" : ""
              } ${
                selectedId === address.id
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 hover:border-blue-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Label & Default Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {address.label}
                    </h4>
                    {address.isDefault && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        ⭐ Default
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  <p className="text-gray-600 mb-3 flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{address.address}</span>
                  </p>

                  {/* Location Details */}
                  {(address.city || address.state) && (
                    <div className="flex gap-4 text-sm text-gray-500">
                      {address.city && <span>🏙️ {address.city}</span>}
                      {address.state && <span>📍 {address.state}</span>}
                      {address.zipCode && <span>📮 {address.zipCode}</span>}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!selectable && (
                  <div className="flex gap-2 ml-4">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Set as default"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Selection Radio */}
                {selectable && (
                  <div className="ml-4">
                    <input
                      type="radio"
                      checked={selectedId === address.id}
                      onChange={() => {}}
                      className="w-6 h-6 text-blue-600"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
