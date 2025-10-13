"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiEdit2,
  FiHome,
  FiMapPin,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import ClientHeader from "../../../../components/ClientHeader";

interface Address {
  id: string;
  label: string;
  type: "home" | "work" | "other";
  fullAddress: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export default function ClientAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockAddresses: Address[] = [
      {
        id: "1",
        label: "Home",
        type: "home",
        fullAddress: "123 Main St, Springfield, IL 62701",
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
        latitude: 39.7817,
        longitude: -89.6501,
        isDefault: true,
      },
      {
        id: "2",
        label: "Office",
        type: "work",
        fullAddress: "456 Business Ave, Springfield, IL 62702",
        street: "456 Business Ave",
        city: "Springfield",
        state: "IL",
        zipCode: "62702",
        latitude: 39.7817,
        longitude: -89.6501,
        isDefault: false,
      },
    ];

    setTimeout(() => {
      setAddresses(mockAddresses);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== addressId));
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <FiHome className="text-blue-500" />;
      case "work":
        return <FiBriefcase className="text-green-500" />;
      default:
        return <FiMapPin className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <>
        <ClientHeader />
        <div className="p-6 pb-20 md:pb-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ClientHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
              <p className="text-gray-600 mt-1">
                Manage your saved addresses for easy booking
              </p>
            </div>
            <button
              onClick={handleAddAddress}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="-ml-1 mr-2 h-4 w-4" />
              Add New Address
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiHome className="text-blue-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Home Addresses
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {addresses.filter((a) => a.type === "home").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiBriefcase className="text-green-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Work Addresses
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {addresses.filter((a) => a.type === "work").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiMapPin className="text-purple-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Total Addresses
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {addresses.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Saved Addresses
              </h2>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No addresses yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add your first address to make booking services easier.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleAddAddress}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                    Add Address
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {addresses.map((address) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(address.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {address.label}
                            </h3>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {address.fullAddress}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-400 capitalize">
                              {address.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="text-xs text-blue-600 hover:text-blue-500"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Address Form Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Label
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Home, Office"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      {editingAddress ? "Update" : "Add"} Address
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
