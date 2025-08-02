import { useState, useEffect } from "react";
import Sidebar from "../utility/ownerSidebar";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OwnerDetails = () => {
    const [owner, setOwner] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const storedId = localStorage.getItem('userID');
        if (storedId !== null && storedId !== "null") {
            setUserId(storedId);
        } else {
            console.error('No userId found in localStorage');
            navigate("/signin")
        }
    }, []);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        cnic: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedId = localStorage.getItem("userID");
        if (storedId !== null && storedId !== "null") {
            setUserId(storedId);
        } else {
            console.error("No userId found in localStorage");
        }
    }, []);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:8080/owners/id/${userId}`)
                .then(res => {
                    setOwner(res.data);
                    setFormData({
                        fullName: res.data.fullName || "",
                        email: res.data.email || "",
                        cnic: res.data.cnic || ""
                    });
                })
                .catch(err => console.error(err));
        }
    }, [userId]);

    const handleEditToggle = () => {
        setEditMode(prev => !prev);
        setErrors({});
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
        if (!/^\d{13}$/.test(formData.cnic)) newErrors.cnic = "CNIC must be exactly 13 digits.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        const updatedOwner = {
            ...owner,
            fullName: formData.fullName,
            email: formData.email,
            cnic: formData.cnic
        }

        axios.put(`http://localhost:8080/owners/${userId}`, updatedOwner)
            .then(res => {
                setOwner(res.data);
                setEditMode(false);
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="flex font-[Lexend] min-h-screen">
            <Sidebar />
            <div className="w-[80vw] bg-[#E6E6E6] px-[80px] pt-[40px]">
                {/* Heading */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-[#081E4A] text-[54px] font-bold">Account Details</h1>
                        <p className="text-[15px] text-[#4D4D4D] font-light">View and edit your account details.</p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-md p-8 w-[70vw] h-[50vh] text-[#202224] relative">
                    {!editMode && (
                        <button
                            className="text-white flex items-center justify-center gap-3 bg-[#1976D2] py-1 px-4 rounded w-[100px] cursor-pointer absolute right-12"
                            onClick={handleEditToggle}
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                    )}
                    {editMode && (
                        <button
                            className="bg-[#FFAE1A] cursor-pointer text-white text-[20px] font-medium rounded-[4.5px] px-[15px] py-[3px] absolute right-12"
                            onClick={handleSave}
                        >
                            <span>Save</span>
                        </button>
                    )}

                    {/* Row 1 */}
                    <div className="flex mb-6 mt-[30px]">
                        <div className="mr-20 w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">FULL NAME</h2>
                            {editMode ? (
                                <>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="bg-[#E9E9E9] px-4 py-2 rounded w-full"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                                </>
                            ) : (
                                <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                    {owner?.fullName || "Loading..."}
                                </div>
                            )}
                        </div>
                        <div className="w-[260px] mr-20">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">USERNAME</h2>
                            <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                {owner?.userName || "Loading..."}
                            </div>
                        </div>
                        <div className="w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">ACCOUNT CREATION DATE</h2>
                            <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                {owner?.accountCreationDate || "Loading..."}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-300 my-6 mt-[50px]" />

                    {/* Row 2 */}
                    <div className="flex mt-[50px]">
                        <div className="mr-20 w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">EMAIL</h2>
                            {editMode ? (
                                <>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-[#E9E9E9] px-4 py-2 rounded w-full"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </>
                            ) : (
                                <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                    {owner?.email || "Loading..."}
                                </div>
                            )}
                        </div>
                        <div className="w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">CNIC</h2>
                            {editMode ? (
                                <>
                                    <input
                                        type="text"
                                        name="cnic"
                                        value={formData.cnic}
                                        onChange={handleChange}
                                        className="bg-[#E9E9E9] px-4 py-2 rounded w-full"
                                    />
                                    {errors.cnic && <p className="text-red-500 text-sm">{errors.cnic}</p>}
                                </>
                            ) : (
                                <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                    {owner?.cnic || "Loading..."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDetails;
