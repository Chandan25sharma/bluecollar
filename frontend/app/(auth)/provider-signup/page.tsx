"use client";

import { useState } from "react";
import LocationPicker from "../../../components/LocationPicker";
import { LocationData } from "../../../lib/location";

type PersonalDetails = {
  fullName: string;
  fatherName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
};

type GovernmentID = {
  type: string;
  number: string;
  frontImage: File | null;
  backImage: File | null;
};

type Credentials = {
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
  governmentIDs: GovernmentID[];
};

type ProfessionalInfo = {
  skills: string[];
  experience: string;
  rate: string;
  availability: string;
  certificates: File[];
  workSamples: File[];
  introVideo: File | null;
};

export default function ProviderSignup() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [location, setLocation] = useState<LocationData | null>(null);

  const [personal, setPersonal] = useState<PersonalDetails>({
    fullName: "",
    fatherName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  const [credentials, setCredentials] = useState<Credentials>({
    password: "",
    confirmPassword: "",
    profilePhoto: null,
    governmentIDs: [],
  });

  const [professional, setProfessional] = useState<ProfessionalInfo>({
    skills: [],
    experience: "",
    rate: "",
    availability: "",
    certificates: [],
    workSamples: [],
    introVideo: null,
  });

  const [newID, setNewID] = useState<GovernmentID>({
    type: "",
    number: "",
    frontImage: null,
    backImage: null,
  });

  // Location handler
  const handleLocationSelect = (selectedLocation: LocationData) => {
    setLocation(selectedLocation);
    setPersonal({ ...personal, address: selectedLocation.display_name });
  };

  // Available skills for providers
  const availableSkills = [
    "Electrical",
    "Plumbing",
    "Carpentry",
    "Tailoring",
    "Painting",
    "HVAC",
    "Cleaning",
    "Cooking",
    "Tutoring",
    "Beauty Services",
    "Fitness Training",
    "IT Support",
  ];

  // Available government ID types
  const idTypes = [
    "Passport",
    "Driver's License",
    "National ID",
    "Citizenship Card",
  ];

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!personal.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!personal.fatherName.trim())
      newErrors.fatherName = "Father's name is required";
    if (!personal.dob) newErrors.dob = "Date of birth is required";
    if (!personal.gender) newErrors.gender = "Gender is required";

    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!personal.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(personal.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Email validation (optional but must be valid if provided)
    if (personal.email && !/\S+@\S+\.\S+/.test(personal.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!personal.address.trim() && !location)
      newErrors.address = "Address is required";
    if (!location) newErrors.location = "Please select your location";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (credentials.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!credentials.profilePhoto) {
      newErrors.profilePhoto = "Profile photo is required";
    }

    if (credentials.governmentIDs.length === 0) {
      newErrors.governmentIDs = "At least one government ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (professional.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    if (!professional.experience) {
      newErrors.experience = "Years of experience is required";
    } else if (parseInt(professional.experience) < 0) {
      newErrors.experience = "Experience cannot be negative";
    }

    if (!professional.rate) {
      newErrors.rate = "Rate is required";
    } else if (parseFloat(professional.rate.replace("$", "")) <= 0) {
      newErrors.rate = "Rate must be greater than 0";
    }

    if (!professional.availability.trim()) {
      newErrors.availability = "Availability is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(step + 1);
    } else if (step === 2 && validateStep2()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => setStep(step - 1);

  const addGovernmentID = () => {
    if (newID.type && newID.number && newID.frontImage) {
      setCredentials({
        ...credentials,
        governmentIDs: [...credentials.governmentIDs, newID],
      });
      setNewID({
        type: "",
        number: "",
        frontImage: null,
        backImage: null,
      });
    }
  };

  const removeGovernmentID = (index: number) => {
    const updatedIDs = [...credentials.governmentIDs];
    updatedIDs.splice(index, 1);
    setCredentials({ ...credentials, governmentIDs: updatedIDs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) return;

    // Prepare FormData for file uploads
    const formData = new FormData();
    Object.entries(personal).forEach(([key, value]) =>
      formData.append(key, value as string)
    );

    // Add location data
    if (location) {
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());
      formData.append("city", location.city);
      formData.append("state", location.state);
      formData.append("country", location.country);
    }

    formData.append("password", credentials.password);
    if (credentials.profilePhoto) {
      formData.append("profilePhoto", credentials.profilePhoto);
    }

    credentials.governmentIDs.forEach((id, index) => {
      formData.append(`governmentIDs[${index}][type]`, id.type);
      formData.append(`governmentIDs[${index}][number]`, id.number);
      if (id.frontImage)
        formData.append(`governmentIDs[${index}][frontImage]`, id.frontImage);
      if (id.backImage)
        formData.append(`governmentIDs[${index}][backImage]`, id.backImage);
    });

    Object.entries(professional).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => formData.append(key, file));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      const res = await fetch("/api/provider/signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Your account is pending approval.");
      } else {
        alert(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="bg-white rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Provider Registration
              </h1>
              <p className="text-gray-600 mt-2">
                Join our platform as a service provider
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mb-8 relative">
              <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 z-0"></div>
              {[1, 2, 3].map((s) => (
                <div key={s} className="relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= s
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s}
                  </div>
                  <div className="text-xs mt-2 text-gray-600 whitespace-nowrap">
                    {s === 1 && "Personal Info"}
                    {s === 2 && "Credentials"}
                    {s === 3 && "Professional Info"}
                  </div>
                </div>
              ))}
            </div>

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={personal.fullName}
                      onChange={(e) =>
                        setPersonal({ ...personal, fullName: e.target.value })
                      }
                      className={`border ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Name *
                    </label>
                    <input
                      type="text"
                      value={personal.fatherName}
                      onChange={(e) =>
                        setPersonal({ ...personal, fatherName: e.target.value })
                      }
                      className={`border ${
                        errors.fatherName ? "border-red-500" : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.fatherName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fatherName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={personal.dob}
                      onChange={(e) =>
                        setPersonal({ ...personal, dob: e.target.value })
                      }
                      className={`border ${
                        errors.dob ? "border-red-500" : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.dob && (
                      <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender *
                    </label>
                    <select
                      value={personal.gender}
                      onChange={(e) =>
                        setPersonal({ ...personal, gender: e.target.value })
                      }
                      className={`border ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={personal.phone}
                      onChange={(e) =>
                        setPersonal({ ...personal, phone: e.target.value })
                      }
                      className={`border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={personal.email}
                      onChange={(e) =>
                        setPersonal({ ...personal, email: e.target.value })
                      }
                      className={`border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Location *
                  </label>
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    placeholder="Enter your service area address"
                    required
                    showCurrentLocationButton
                    defaultLocation={location}
                  />
                  {(errors.address || errors.location) && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address || errors.location}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Set Credentials */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Account Credentials
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                      className={`border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={credentials.confirmPassword}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Photo *
                  </label>
                  <div
                    className={`border ${
                      errors.profilePhoto ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-4 flex flex-col items-center justify-center`}
                  >
                    {credentials.profilePhoto ? (
                      <div className="text-center">
                        <p className="text-sm text-green-600">
                          File selected: {credentials.profilePhoto.name}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setCredentials({
                              ...credentials,
                              profilePhoto: null,
                            })
                          }
                          className="mt-2 text-sm text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="w-12 h-12 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <p className="text-sm text-gray-600">
                          Upload your profile photo
                        </p>
                        <input
                          type="file"
                          onChange={(e) =>
                            setCredentials({
                              ...credentials,
                              profilePhoto: e.target.files?.[0] || null,
                            })
                          }
                          className="hidden"
                          id="profilePhoto"
                          accept="image/*"
                          required
                        />
                        <label
                          htmlFor="profilePhoto"
                          className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm cursor-pointer"
                        >
                          Select File
                        </label>
                      </>
                    )}
                  </div>
                  {errors.profilePhoto && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.profilePhoto}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Government IDs *
                  </label>
                  {errors.governmentIDs && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.governmentIDs}
                    </p>
                  )}

                  {/* Add new ID form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Add New Government ID
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          ID Type
                        </label>
                        <select
                          value={newID.type}
                          onChange={(e) =>
                            setNewID({ ...newID, type: e.target.value })
                          }
                          className="border border-gray-300 p-2 w-full rounded-lg text-sm"
                        >
                          <option value="">Select ID Type</option>
                          {idTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          ID Number
                        </label>
                        <input
                          type="text"
                          value={newID.number}
                          onChange={(e) =>
                            setNewID({ ...newID, number: e.target.value })
                          }
                          className="border border-gray-300 p-2 w-full rounded-lg text-sm"
                          placeholder="Enter ID number"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Front Image *
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            setNewID({
                              ...newID,
                              frontImage: e.target.files?.[0] || null,
                            })
                          }
                          className="w-full text-sm"
                          accept="image/*"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Back Image (Optional)
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            setNewID({
                              ...newID,
                              backImage: e.target.files?.[0] || null,
                            })
                          }
                          className="w-full text-sm"
                          accept="image/*"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addGovernmentID}
                      disabled={
                        !newID.type || !newID.number || !newID.frontImage
                      }
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add ID
                    </button>
                  </div>

                  {/* List of added IDs */}
                  {credentials.governmentIDs.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-700">
                        Added IDs
                      </h3>
                      {credentials.governmentIDs.map((id, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-blue-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {id.type}: {id.number}
                            </p>
                            <p className="text-xs text-gray-600">
                              {id.frontImage?.name}{" "}
                              {id.backImage && `, ${id.backImage.name}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGovernmentID(index)}
                            className="text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Professional Info */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Professional Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills *
                  </label>
                  <div
                    className={`border ${
                      errors.skills ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-2`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.map((skill) => (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => {
                            const updatedSkills = professional.skills.includes(
                              skill
                            )
                              ? professional.skills.filter((s) => s !== skill)
                              : [...professional.skills, skill];
                            setProfessional({
                              ...professional,
                              skills: updatedSkills,
                            });
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            professional.skills.includes(skill)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Select all that apply
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={professional.experience}
                      onChange={(e) =>
                        setProfessional({
                          ...professional,
                          experience: e.target.value,
                        })
                      }
                      className={`border ${
                        errors.experience ? "border-red-500" : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly/Service Rate ($) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 25 or 25.50"
                      value={professional.rate}
                      onChange={(e) =>
                        setProfessional({
                          ...professional,
                          rate: e.target.value,
                        })
                      }
                      className={`border ${
                        errors.rate ? "border-red-500" : "border-gray-300"
                      } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.rate && (
                      <p className="mt-1 text-sm text-red-600">{errors.rate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability *
                  </label>
                  <textarea
                    placeholder="e.g., Mon-Fri 9am-5pm, Weekends 10am-2pm"
                    value={professional.availability}
                    onChange={(e) =>
                      setProfessional({
                        ...professional,
                        availability: e.target.value,
                      })
                    }
                    className={`border ${
                      errors.availability ? "border-red-500" : "border-gray-300"
                    } p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    rows={2}
                    required
                  />
                  {errors.availability && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.availability}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificates (Optional)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setProfessional({
                          ...professional,
                          certificates: e.target.files
                            ? Array.from(e.target.files)
                            : [],
                        })
                      }
                      className="w-full"
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    {professional.certificates.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Selected files:{" "}
                          {professional.certificates
                            .map((f) => f.name)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Samples (Optional)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setProfessional({
                          ...professional,
                          workSamples: e.target.files
                            ? Array.from(e.target.files)
                            : [],
                        })
                      }
                      className="w-full"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                    {professional.workSamples.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Selected files:{" "}
                          {professional.workSamples
                            .map((f) => f.name)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intro Video (Optional)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      onChange={(e) =>
                        setProfessional({
                          ...professional,
                          introVideo: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full"
                      accept="video/*"
                    />
                    {professional.introVideo && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Selected file: {professional.introVideo.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div
              className={`flex ${
                step === 1 ? "justify-end" : "justify-between"
              } mt-8`}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Submit Registration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
