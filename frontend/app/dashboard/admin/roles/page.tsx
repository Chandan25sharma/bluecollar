"use client";

import { useState } from "react";
import {
  FiCheck,
  FiEdit,
  FiPlus,
  FiShield,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import AdminHeader from "../../../../components/AdminHeader";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Super Admin",
      description: "Full access to all platform features",
      permissions: [
        "user.manage",
        "provider.manage",
        "booking.manage",
        "finance.manage",
        "system.manage",
      ],
      userCount: 2,
    },
    {
      id: "2",
      name: "Finance Admin",
      description: "Access to financial and payout management",
      permissions: ["finance.manage", "booking.view", "user.view"],
      userCount: 3,
    },
    {
      id: "3",
      name: "Support Admin",
      description: "Customer support and basic user management",
      permissions: ["user.view", "booking.view", "provider.view"],
      userCount: 5,
    },
  ]);

  const [permissions] = useState<Permission[]>([
    {
      id: "user.manage",
      name: "Manage Users",
      category: "Users",
      description: "Create, edit, and delete users",
    },
    {
      id: "user.view",
      name: "View Users",
      category: "Users",
      description: "View user information",
    },
    {
      id: "provider.manage",
      name: "Manage Providers",
      category: "Providers",
      description: "Verify and manage providers",
    },
    {
      id: "provider.view",
      name: "View Providers",
      category: "Providers",
      description: "View provider information",
    },
    {
      id: "booking.manage",
      name: "Manage Bookings",
      category: "Bookings",
      description: "Manage all bookings",
    },
    {
      id: "booking.view",
      name: "View Bookings",
      category: "Bookings",
      description: "View booking information",
    },
    {
      id: "finance.manage",
      name: "Manage Finance",
      category: "Finance",
      description: "Handle payouts and finances",
    },
    {
      id: "system.manage",
      name: "System Management",
      category: "System",
      description: "System configuration and settings",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  const handleCreateRole = () => {
    if (newRole.name && newRole.description) {
      const role: Role = {
        id: String(roles.length + 1),
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        userCount: 0,
      };
      setRoles([...roles, role]);
      setNewRole({ name: "", description: "", permissions: [] });
      setShowCreateModal(false);
    }
  };

  const handleDeleteRole = (id: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((role) => role.id !== id));
    }
  };

  const togglePermission = (permissionId: string) => {
    if (newRole.permissions.includes(permissionId)) {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter((p) => p !== permissionId),
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permissionId],
      });
    }
  };

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: Permission[] } = {};
    permissions.forEach((permission) => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminHeader />
      <div className="p-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Roles & Permissions
                </h1>
                <p className="text-gray-600">
                  Manage admin roles and access control
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <FiPlus size={16} />
                Create Role
              </button>
            </div>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FiShield className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {role.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {role.userCount} users
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{role.description}</p>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Permissions:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permissionId) => {
                      const permission = permissions.find(
                        (p) => p.id === permissionId
                      );
                      return (
                        <span
                          key={permissionId}
                          className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                        >
                          {permission?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Permissions Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Available Permissions
            </h2>
            {Object.entries(getPermissionsByCategory()).map(
              ([category, categoryPermissions]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900">
                          {permission.name}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {permission.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Create Role Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Create New Role
                    </h2>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role Name
                      </label>
                      <input
                        type="text"
                        value={newRole.name}
                        onChange={(e) =>
                          setNewRole({ ...newRole, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter role name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newRole.description}
                        onChange={(e) =>
                          setNewRole({
                            ...newRole,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                        placeholder="Enter role description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions
                      </label>
                      {Object.entries(getPermissionsByCategory()).map(
                        ([category, categoryPermissions]) => (
                          <div key={category} className="mb-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">
                              {category}
                            </h4>
                            <div className="space-y-2">
                              {categoryPermissions.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    checked={newRole.permissions.includes(
                                      permission.id
                                    )}
                                    onChange={() =>
                                      togglePermission(permission.id)
                                    }
                                    className="mr-2"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {permission.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateRole}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <FiCheck size={16} />
                      Create Role
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
