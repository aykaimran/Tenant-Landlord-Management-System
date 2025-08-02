
import { useState, useEffect } from "react";
import axios from "axios";
import { PencilIcon } from "@heroicons/react/24/outline";
import Sidebar from "../components/Tenantsidebar";
import { useNavigate } from "react-router-dom"; // add at the top

const TenantDetails = () => {
    const [tenant, setTenant] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTenant, setEditedTenant] = useState({});
    const [cnicError, setCnicError] = useState("");
    const [emailError, setEmailError] = useState("");

    const navigate = useNavigate(); // initialize navigation

    const userName = localStorage.getItem("userName");

    useEffect(() => {
        if (!userName) {
            navigate("/signin");
        }
    }, [userName, navigate]);
      
    useEffect(() => {
        const fetchTenantData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:8080/api/v1/tenant/username/${userName}`
                );

                if (response.data) {
                    setTenant(response.data);
                    setEditedTenant(response.data);
                } else {
                    setTenant({});
                }
            } catch (err) {
                console.error("Error:", err);
                setError("Failed to fetch data");
                setTenant({});
            } finally {
                setLoading(false);
            }
        };

        fetchTenantData();
    }, [userName]);

    const handleEditToggle = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "cnic") {
            if (value.length > 13) {
                setCnicError("CNIC cannot exceed 13 digits");
            } else if (!/^\d{0,13}$/.test(value)) {
                setCnicError("CNIC must contain only numbers");
            } else {
                setCnicError("");
            }
        }

        if (name === "email") {
            if (!/\S+@\S+\.\S+/.test(value)) {
                setEmailError("Invalid email format");
            } else {
                setEmailError("");
            }
        }

        setEditedTenant(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (editedTenant.cnic?.length !== 13 || /[^0-9]/.test(editedTenant.cnic)) {
            setCnicError("CNIC must be a 13-digit number");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(editedTenant.email)) {
            setEmailError("Invalid email format");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/api/v1/tenant/username/${userName}`,
                editedTenant
            );
            setTenant(response.data);
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving tenant details:", err);
            setError("Failed to save changes.");
        }
    };

    const handleCancel = () => {
        setEditedTenant(tenant);
        setIsEditing(false);
    };

    return (
        <div className="flex font-[Lexend] min-h-screen">
            <Sidebar />
            <div className="w-[80vw] bg-[#E6E6E6] px-[80px]">
                <div className=" pr-[50px] mt-[10px]">
                    <h1 className="text-[#081E4A] text-[54px] font-bold">Account Details</h1>
                    <p className="text-[15px] text-[#4D4D4D] font-light">View and edit your account details.</p>
                </div>
                <div className="mt-8 bg-white rounded-lg shadow-md relative w-[70vw] h-[50vh]">
                    <div className="absolute top-4 right-4">
                        {isEditing ? (
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={handleEditToggle}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center gap-2"
                            >
                                <PencilIcon className="h-4 w-4" />
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="flex mb-6 mt-[30px] w-[70vw] p-4">
                        <div className="mr-20 w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">FULL NAME</h2>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="fullName"
                                    value={editedTenant.fullName || ""}
                                    onChange={handleChange}
                                    className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90"
                                />
                            ) : (
                                <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                    {tenant.fullName || "N/A"}
                                </div>
                            )}
                        </div>
                        <div className="w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">USERNAME</h2>
                            <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                {tenant.userName || "N/A"}
                            </div>
                            {isEditing && (
                                <div className="text-red-500 text-xs mt-2">
                                    Username cannot be modified
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-300 my-6 mt-[50px]" />

                    <div className="flex mb-6 mt-[30px] w-[70vw] p-4">
                        <div className="mr-20 w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">EMAIL</h2>
                            {isEditing ? (
                                <>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editedTenant.email || ""}
                                        onChange={handleChange}
                                        className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90"
                                    />
                                    {emailError && <div className="text-red-500 text-xs mt-1">{emailError}</div>}
                                </>
                            ) : (
                                <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                    {tenant.email || "N/A"}
                                </div>
                            )}
                        </div>
                        <div className="w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">CNIC</h2>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        name="cnic"
                                        value={editedTenant.cnic || ""}
                                        onChange={handleChange}
                                        className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90"
                                    />
                                    {cnicError && <div className="text-red-500 text-xs mt-1">{cnicError}</div>}
                                </>
                            ) : (
                                <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                    {tenant.cnic || "N/A"}
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={handleCancel}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TenantDetails;
