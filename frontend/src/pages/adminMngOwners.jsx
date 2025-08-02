import { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/adminSidebar";
import axios from "axios";
import { Pencil, Trash2, Eye, ChevronLeft, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminMngOwners = () => {
    const [owners, setOwners] = useState([]);
    const [viewedOwner, setViewedOwner] = useState(null);
    const [ownerToDelete, setOwnerToDelete] = useState(null);
    const [ownerProperties, setOwnerProperties] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const formRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [userID, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedId = localStorage.getItem('userID');
        if (storedId !== null && storedId !== "null") {
            setUserId(storedId);
        } else {
            navigate("/signin");
        }
    }, [navigate]);

    useEffect(() => {
        axios.get("http://localhost:8080/owners")
            .then(response => {
                setOwners(response.data);
            })
            .catch(error => {
                console.error("Error fetching owners:", error);
            });
    }, []);

    const handleDelete = (owner) => {
        axios.delete(`http://localhost:8080/owners/${owner.userName}`)
            .then(() => {
                setOwners(prev => prev.filter(o => o.id !== owner.id));
                setOwnerToDelete(null);
                if (viewedOwner?.id === owner.id) {
                    setViewedOwner(null);
                }
                axios.post("http://localhost:8080/blacklist", {
                    cnic: owner.cnic
                })
                    .catch(error => {
                        console.error("Error creating blacklist:", error);
                    });
            })
            .catch(error => {
                console.error("Error deleting owner:", error);
            });
    };
    const filteredOwners = owners.filter(owner =>
        owner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleView = (owner) => {
        setViewedOwner(owner);
        setEditMode(false);
        setFormErrors({});

        axios.get(`http://localhost:8080/properties/owner/${owner.userName}`)
            .then(response => {
                const properties = response.data;
                setOwnerProperties(properties);

                const tenantRequests = properties.map((property) =>
                    axios.get(`http://localhost:8080/tenants/id/${property.tenantName}`)
                );

                Promise.all(tenantRequests)
                    .then(tenantResponses => {
                        const propertiesWithTenantDetails = properties.map((property, index) => ({
                            ...property,
                            tenantID: tenantResponses[index].data,
                        }));
                        setOwnerProperties(propertiesWithTenantDetails);
                    });
            })
            .catch(error => {
                console.error("Error fetching owner properties:", error);
            });
    };

    const handleEdit = (owner) => {
        setViewedOwner(owner);
        setEditMode(true);
        setFormErrors({});

        axios.get(`http://localhost:8080/properties/owner/${owner.userName}`)
            .then(response => {
                const properties = response.data;
                setOwnerProperties(properties);

                const tenantRequests = properties.map((property) =>
                    axios.get(`http://localhost:8080/tenants/id/${property.tenantName}`)
                );

                Promise.all(tenantRequests)
                    .then(tenantResponses => {
                        const propertiesWithTenantDetails = properties.map((property, index) => ({
                            ...property,
                            tenantID: tenantResponses[index].data,
                        }));
                        setOwnerProperties(propertiesWithTenantDetails);
                    });
            })
            .catch(error => {
                console.error("Error fetching owner properties:", error);
            });
    };

    const handleBack = () => {
        setViewedOwner(null);
        setEditMode(false);
    };

    const validateForm = () => {
        const errors = {};
        const cnicRegex = /^[0-9]{13}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!viewedOwner.fullName?.trim()) {
            errors.fullName = "Full name is required";
        }

        if (!viewedOwner.cnic?.trim()) {
            errors.cnic = "CNIC is required";
        } else if (!cnicRegex.test(viewedOwner.cnic)) {
            errors.cnic = "CNIC must be exactly 13 digits";
        }

        if (!viewedOwner.email?.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(viewedOwner.email)) {
            errors.email = "Invalid email format";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        const formData = new FormData(formRef.current);
        const updatedOwner = {
            ...viewedOwner,
            fullName: formData.get('fullName'),
            cnic: formData.get('cnic'),
            email: formData.get('email')
        };

        axios.put(`http://localhost:8080/owners/${viewedOwner.id}`, updatedOwner)
            .then(response => {
                setOwners(prev => prev.map(o => o.id === viewedOwner.id ? updatedOwner : o));
                setViewedOwner(updatedOwner);
                setEditMode(false);
            })
            .catch(error => {
                console.error("Error updating owner:", error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const OwnerBox = ({ label, name, value }) => {
        const isReadOnly = name === "id" || name === "userName";
        const isError = formErrors[name];
        const [localValue, setLocalValue] = useState(value || "");

        // Sync local value when prop changes
        useEffect(() => {
            setLocalValue(value || "");
        }, [value]);

        const handleChange = (e) => {
            const newValue = e.target.value;
            setLocalValue(newValue);
        };

        const handleBlur = () => {
            // Update parent state only when leaving the field
            setViewedOwner(prev => ({
                ...prev,
                [name]: localValue
            }));

            // Clear error if user starts typing
            if (isError && localValue.trim()) {
                setFormErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        };

        return (
            <div className="flex flex-col w-[170px]">
                <label className="text-[14px] font-semibold text-gray-600 mb-1">{label}</label>
                {editMode ? (
                    <input
                        name={name}
                        type={name === "cnic" ? "number" : "text"}
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={name === "cnic" ? 13 : undefined}
                        className={`px-4 py-2 rounded w-full text-[15px] text-gray-800 bg-[#F2F2F2] focus:outline-none border ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        readOnly={isReadOnly}
                        tabIndex={isReadOnly ? -1 : 0}
                    />
                ) : (
                    <div className="bg-[#E9E9E9] px-4 py-2 rounded w-full text-[15px] text-gray-800">
                        {value || "—"}
                    </div>
                )}
            </div>
        );
    };
    return (
        <div className="flex font-[Lexend]">
            <Sidebar />
            <div className="w-[80vw] bg-[#E6E6E6] relative">
                <div className="flex justify-between items-center w-[75vw]">
                    <div className="pl-[80px] mt-[10px]">
                        <h1 className="text-[#081E4A] text-[54px] font-bold">Manage Owners</h1>
                        <p className="text-[15px] text-[#4D4D4D] font-light">View, edit, or delete owners.</p>
                    </div>
                    <div className="relative w-[300px]">
                        <input
                            type="text"
                            placeholder="Search owners..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-400 rounded px-10 py-2 w-full"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                    </div>

                </div>


                <div className="mx-[80px] mt-8 bg-white rounded-lg shadow-md overflow-hidden relative w-[70vw] h-[50vh]">
                    {viewedOwner && (
                        <div className="absolute top-0 bg-white bg-opacity-90 z-50 flex rounded-lg items-center justify-center px-6 w-[70vw] h-[50vh]">
                            <form ref={formRef} className="p-6 rounded-lg w-full space-y-8 relative">
                                <div className="flex justify-between items-center absolute top-4 left-4 w-full pr-[40px]">
                                    <div
                                        onClick={handleBack}
                                        className="w-[43px] h-[43px] cursor-pointer rounded-full bg-[#D9D9D9] flex items-center justify-center"
                                    >
                                        <ChevronLeft className="text-black" />
                                    </div>
                                    <div>
                                        {editMode && (
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                disabled={isSubmitting}
                                                className="bg-[#FFAE1A] cursor-pointer text-white text-[20px] font-medium rounded-[4.5px] px-[15px] py-[3px]"
                                            >
                                                {isSubmitting ? "Saving..." : "SAVE"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-12 flex flex-col space-y-8">
                                    <div className="flex flex-wrap justify-between">
                                        <OwnerBox label="OWNER ID" name="id" value={viewedOwner?.id} />
                                        <OwnerBox label="FULL NAME" name="fullName" value={viewedOwner?.fullName} />
                                        <OwnerBox label="USERNAME" name="userName" value={viewedOwner?.userName} />
                                        <OwnerBox label="CNIC" name="cnic" value={viewedOwner?.cnic} />
                                        <OwnerBox label="EMAIL" name="email" value={viewedOwner?.email} />
                                    </div>

                                    <hr className="border-gray-300" />

                                    <div className="space-y-2">
                                        <h2 className="text-[20px] font-semibold text-[#081E4A]">Assigned Properties</h2>
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-h-[150px]">
                                            <div className="grid grid-cols-5 bg-gray-100 p-3 font-medium text-gray-700 sticky top-0 z-10">
                                                <div className="col-span-1">Property ID</div>
                                                <div className="col-span-1">Property Name</div>
                                                <div className="col-span-1">Tenant ID</div>
                                                <div className="col-span-1">Tenant Name</div>
                                            </div>

                                            <div className="overflow-y-auto max-h-[50px]">
                                                {ownerProperties.length > 0 ? (
                                                    ownerProperties.map((property) => (
                                                        <div
                                                            key={property.propertyID}
                                                            className="grid grid-cols-5 p-3 border-b border-gray-200 text-gray-700 text-[15px]"
                                                        >
                                                            <div>{property.propertyID}</div>
                                                            <div>{property.propertyName}</div>
                                                            <div>{property.tenantID}</div>
                                                            <div>{property.tenantName}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-3 text-gray-500 italic">No properties assigned.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {owners.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-[#081E4A] text-[28px] font-medium">
                            No Owners Found
                        </div>
                    ) : (
                        <>

                            <div className="grid grid-cols-14 bg-gray-100 p-4 font-medium text-gray-700 sticky top-0 z-10 h-[56px]">
                                <div className="col-span-2">OWNER ID</div>
                                <div className="col-span-2">USERNAME</div>
                                <div className="col-span-3">EMAIL</div>
                                <div className="col-span-3">CNIC</div>
                                <div className="col-span-4 flex justify-end gap-12 pr-[3vw]">
                                    <span>VIEW</span>
                                    <span>EDIT</span>
                                    <span>DELETE</span>
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[40vh]">
                                {filteredOwners.map((owner) => (
                                    <div key={owner.id} className="grid grid-cols-14 p-4 border-b border-gray-200 items-center">
                                        <div className="col-span-2 font-medium">{owner.id}</div>
                                        <div className="col-span-2">{owner.userName}</div>
                                        <div className="col-span-3">{owner.email}</div>
                                        <div className="col-span-3">{owner.cnic}</div>
                                        <div className="col-span-4 flex justify-end gap-2 pr-4">
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1245A8] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => handleView(owner)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1976D2] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => handleEdit(owner)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#C42211] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => setOwnerToDelete(owner)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="w-[24vw] flex flex-col items-center rounded-[16px] p-[10px] bg-white text-[#081E4A] font-medium ml-[80px] mt-[15px]">
                    <h1 className="text-[36px]">Total Owners</h1>
                    <h1 className="text-[32px]">{owners.length}</h1>
                </div>

                {ownerToDelete && (
                    <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 z-[999] flex items-center justify-center">
                        <div className="bg-white p-8 rounded-xl w-[480px] flex flex-col gap-6 shadow-lg relative">
                            <h2 className="text-[24px] font-semibold text-[#081E4A]">Confirm Deletion</h2>
                            <p className="text-gray-600 text-[18px]">Do you really want to delete <strong>{ownerToDelete.userName}</strong>?</p>
                            <div className="flex gap-4 mt-4 w-[100%] justify-end">
                                <button
                                    onClick={() => setOwnerToDelete(null)}
                                    className="bg-[#1976D2] hover:bg-[#125BA3] text-white px-[20px] py-2 cursor-pointer rounded-[4.5px] flex gap-[10px]"
                                >
                                    Cancel
                                    <X />
                                </button>
                                <button
                                    onClick={() => handleDelete(ownerToDelete)}
                                    className="bg-[#C42211] text-white px-[20px] py-2 cursor-pointer rounded-[4.5px] hover:bg-[#A32012] flex gap-[10px]"
                                >
                                    Delete
                                    <Trash2 />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMngOwners;