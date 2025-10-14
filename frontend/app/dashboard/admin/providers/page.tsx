"use client";

import { useEffect, useState } from "react";
import {
  FiCheck,
  FiDollarSign,
  FiEye,
  FiMail,
  FiPhone,
  FiX,
} from "react-icons/fi";
import AdminHeader from "../../../../components/AdminHeader";
import { adminAPI } from "../../../../lib/api";

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  rate: number;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED" | "RESUBMITTED";
  location?: {
    address: string;
    city: string;
    state: string;
  };
  documents?: {
    govIdUrl?: string;
    businessLicenseUrl?: string;
    insuranceDocUrl?: string;
  };
  createdAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationAction, setVerificationAction] = useState<
    "approve" | "reject"
  >("approve");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchProviders();
  }, [page, statusFilter]);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getAllProviders(
        page,
        10,
        statusFilter === "verified"
      );

      if (response.data) {
        setProviders(response.data.providers || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);

      // Mock data for demonstration
      const mockProviders: Provider[] = [
        {
          id: "1",
          name: "John Smith",
          email: "john@electricpro.com",
          phone: "+1234567890",
          skills: ["Electrical", "Wiring"],
          rate: 150,
          verificationStatus: "PENDING",
          location: {
            address: "123 Main St",
            city: "New York",
            state: "NY",
          },
          documents: {
            govIdUrl: "/docs/john-id.pdf",
            businessLicenseUrl: "/docs/john-license.pdf",
            insuranceDocUrl: "/docs/john-insurance.pdf",
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah@plumbfix.com",
          phone: "+1234567891",
          skills: ["Plumbing", "Repair"],
          rate: 120,
          verificationStatus: "APPROVED",
          location: {
            address: "456 Oak Ave",
            city: "Los Angeles",
            state: "CA",
          },
          createdAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Mike Wilson",
          email: "mike@cleanpro.com",
          phone: "+1234567892",
          skills: ["Cleaning", "Maintenance"],
          rate: 80,
          verificationStatus: "REJECTED",
          location: {
            address: "789 Pine St",
            city: "Chicago",
            state: "IL",
          },
          rejectionReason: "Incomplete documentation",
          createdAt: new Date().toISOString(),
        },
      ];
      setProviders(mockProviders);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyProvider = async (
    providerId: string,
    approved: boolean,
    reason?: string
  ) => {
    try {
      await adminAPI.verifyProvider(providerId, {
        adminId: "current-admin-id",
        approved,
        reason,
      });

      // Update local state
      setProviders(
        providers.map((provider) =>
          provider.id === providerId
            ? {
                ...provider,
                verificationStatus: approved ? "APPROVED" : "REJECTED",
                rejectionReason: reason,
                verifiedAt: approved ? new Date().toISOString() : undefined,
              }
            : provider
        )
      );

      setShowVerificationModal(false);
      setSelectedProvider(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error verifying provider:", error);
      alert("Error updating provider status");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      RESUBMITTED: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminHeader />
        <div className="p-6 pb-20 md:pb-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminHeader />
      <div className="p-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Provider Management
            </h1>
            <p className="text-gray-600">Verify and manage service providers</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="RESUBMITTED">Resubmitted</option>
              </select>
            </div>
          </div>

          {/* Providers List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Provider
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Skills
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Rate
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider) => (
                    <tr
                      key={provider.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {provider.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {provider.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="flex items-center gap-1">
                            <FiMail size={14} />
                            {provider.email}
                          </p>
                          <p className="flex items-center gap-1">
                            <FiPhone size={14} />
                            {provider.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {provider.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <FiDollarSign size={14} />
                          {provider.rate}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(provider.verificationStatus)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedProvider(provider);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                          {provider.verificationStatus === "PENDING" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedProvider(provider);
                                  setVerificationAction("approve");
                                  setShowVerificationModal(true);
                                }}
                                className="text-green-600 hover:text-green-800"
                                title="Approve"
                              >
                                <FiCheck size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProvider(provider);
                                  setVerificationAction("reject");
                                  setShowVerificationModal(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                                title="Reject"
                              >
                                <FiX size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-gray-600 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Provider Details Modal */}
          {showDetailsModal && selectedProvider && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Provider Details
                    </h2>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedProvider.name}
                      </h3>
                      {getStatusBadge(selectedProvider.verificationStatus)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <p className="text-gray-900">
                          {selectedProvider.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <p className="text-gray-900">
                          {selectedProvider.phone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Skills
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedProvider.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hourly Rate
                      </label>
                      <p className="text-gray-900">${selectedProvider.rate}</p>
                    </div>

                    {selectedProvider.location && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <p className="text-gray-900">
                          {selectedProvider.location.address},{" "}
                          {selectedProvider.location.city},{" "}
                          {selectedProvider.location.state}
                        </p>
                      </div>
                    )}

                    {selectedProvider.rejectionReason && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Rejection Reason
                        </label>
                        <p className="text-red-600">
                          {selectedProvider.rejectionReason}
                        </p>
                      </div>
                    )}

                    {selectedProvider.documents && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Documents
                        </label>
                        <div className="space-y-2">
                          {selectedProvider.documents.govIdUrl && (
                            <a
                              href={selectedProvider.documents.govIdUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-800"
                            >
                              Government ID
                            </a>
                          )}
                          {selectedProvider.documents.businessLicenseUrl && (
                            <a
                              href={
                                selectedProvider.documents.businessLicenseUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-800"
                            >
                              Business License
                            </a>
                          )}
                          {selectedProvider.documents.insuranceDocUrl && (
                            <a
                              href={selectedProvider.documents.insuranceDocUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-800"
                            >
                              Insurance Document
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Modal */}
          {showVerificationModal && selectedProvider && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {verificationAction === "approve" ? "Approve" : "Reject"}{" "}
                      Provider
                    </h2>
                    <button
                      onClick={() => setShowVerificationModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4">
                    Are you sure you want to {verificationAction}{" "}
                    {selectedProvider.name}?
                  </p>

                  {verificationAction === "reject" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (required)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                        placeholder="Explain why this provider is being rejected..."
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowVerificationModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        handleVerifyProvider(
                          selectedProvider.id,
                          verificationAction === "approve",
                          verificationAction === "reject"
                            ? rejectionReason
                            : undefined
                        )
                      }
                      disabled={
                        verificationAction === "reject" &&
                        !rejectionReason.trim()
                      }
                      className={`px-4 py-2 rounded-lg text-white ${
                        verificationAction === "approve"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      } disabled:opacity-50`}
                    >
                      {verificationAction === "approve" ? "Approve" : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
