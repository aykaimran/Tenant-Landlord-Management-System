import { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/adminSidebar";
import axios from "axios";
import { Pencil, Trash2, Eye, ChevronLeft, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminMngTenants = () => {
    const [tenants, setTenants] = useState([]);
    const [viewedTenant, setViewedTenant] = useState(null);
    const [tenantToDelete, setTenantToDelete] = useState(null);
    const [tenantProperties, setTenantProperties] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        axios.get("http://localhost:8080/tenants")
            .then(response => {
                setTenants(response.data);
            })
            .catch(error => {
                console.error("Error fetching tenants:", error);
            });
    }, []);

    const handleDelete = (tenant) => {
        axios.delete(`http://localhost:8080/tenants/${tenant.id}`)
            .then(() => {
                setTenants(prev => prev.filter(t => t.id !== tenant.id));
                setTenantToDelete(null);
                if (viewedTenant?.id === tenant.id) {
                    setViewedTenant(null);
                }
                axios.post("http://localhost:8080/blacklist", {
                    cnic: tenant.cnic
                })
                    .catch(error => {
                        console.error("Error creating blacklist:", error);
                    });
            })
            .catch(error => {
                console.error("Error deleting tenant:", error);
            });
    };

    const handleEdit = (tenant) => {
        setViewedTenant(tenant);
        setEditMode(true);
        setFormErrors({}); // Clear previous errors when entering edit mode
        axios.get(`http://localhost:8080/propertyAssignments/tenant/${tenant.id}`)
            .then(response => {
                const propertyAssignments = response.data;
                const propertyRequests = propertyAssignments.map(property =>
                    axios.get(`http://localhost:8080/properties/${property.propertyID}`)
                );

                Promise.all(propertyRequests)
                    .then(responses => {
                        const propertiesWithDetails = responses.map((response, index) => {
                            const property = response.data;
                            return {
                                ...propertyAssignments[index],
                                propertyName: property.propertyName,
                                ownerName: property.ownerName
                            };
                        });
                        setTenantProperties(propertiesWithDetails);
                    })
                    .catch(error => {
                        console.error("Error fetching property details:", error);
                    });
            })
            .catch(error => {
                console.error("Error fetching tenant properties:", error);
            });
    };

    const handleView = (tenant) => {
        setViewedTenant(tenant);
        setEditMode(false);

        axios.get(`http://localhost:8080/propertyAssignments/tenant/${tenant.id}`)
            .then(response => {
                const propertyAssignments = response.data;
                const propertyRequests = propertyAssignments.map(property =>
                    axios.get(`http://localhost:8080/properties/${property.propertyID}`)
                );

                Promise.all(propertyRequests)
                    .then(responses => {
                        const propertiesWithDetails = responses.map((response, index) => {
                            const property = response.data;
                            return {
                                ...propertyAssignments[index],
                                propertyName: property.propertyName,
                                ownerName: property.ownerName
                            };
                        });
                        setTenantProperties(propertiesWithDetails);
                    })
                    .catch(error => {
                        console.error("Error fetching property details:", error);
                    });
            })
            .catch(error => {
                console.error("Error fetching tenant properties:", error);
            });
    };

    const handleBack = () => {
        setViewedTenant(null);
        setEditMode(false);
    };

    const validateForm = () => {
        const errors = {};
        const cnicRegex = /^[0-9]{13}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!viewedTenant.cnic?.trim()) {
            errors.cnic = "CNIC is required";
        } else if (!cnicRegex.test(viewedTenant.cnic)) {
            errors.cnic = "CNIC must be exactly 13 digits";
        }

        if (!viewedTenant.email?.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(viewedTenant.email)) {
            errors.email = "Invalid email format";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return; // Don't proceed if validation fails
        }

        setIsSubmitting(true);

        const formData = new FormData(formRef.current);
        const updatedTenant = {
            ...viewedTenant,
            fullName: formData.get('fullName'),
            cnic: formData.get('cnic'),
            email: formData.get('email')
        };

        axios.put(`http://localhost:8080/tenants/${viewedTenant.id}`, updatedTenant)
            .then(response => {
                setTenants(prev => prev.map(t => t.id === viewedTenant.id ? updatedTenant : t));
                setViewedTenant(updatedTenant);
                setEditMode(false);
            })
            .catch(error => {
                console.error("Error updating tenant:", error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const filteredTenants = tenants.filter(tenant =>
        tenant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const TenantBox = ({ label, name, value }) => {
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
            setViewedTenant(prev => ({
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

    // Rest of your component remains exactly the same
    return (
        <div className="flex font-[Lexend]">
            <Sidebar />
            <div className="w-[80vw] bg-[#E6E6E6] relative">
                <div className="flex justify-between items-center w-[75vw]">
                    <div className="pl-[80px] pr-[50px] mt-[10px]">
                        <h1 className="text-[#081E4A] text-[54px] font-bold">Manage Tenants</h1>
                        <p className="text-[15px] text-[#4D4D4D] font-light">View, edit, or delete tenants.</p>
                    </div>
                    <div className="relative w-[300px]">
                        <input
                            type="text"
                            placeholder="Search tenants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-400 rounded px-10 py-2 w-full"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                    </div>
                </div>
                <div className="mx-[80px] mt-8 bg-white rounded-lg shadow-md overflow-hidden relative w-[70vw] h-[50vh]">
                    {viewedTenant && (
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
                                        <TenantBox label="Tenant ID" name="id" value={viewedTenant?.id} />
                                        <TenantBox
                                            label="FULL NAME"
                                            name="fullName"
                                            value={viewedTenant?.fullName}
                                            isFirstEditable={editMode}
                                        />
                                        <TenantBox label="USERNAME" name="userName" value={viewedTenant?.userName} />
                                        <TenantBox
                                            label="CNIC"
                                            name="cnic"
                                            value={viewedTenant?.cnic}
                                        />
                                        <TenantBox
                                            label="EMAIL"
                                            name="email"
                                            value={viewedTenant?.email}
                                        />
                                    </div>

                                    <hr className="border-gray-300" />

                                    <div className="space-y-2">
                                        <h2 className="text-[20px] font-semibold text-[#081E4A]">Assigned Properties</h2>
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-h-[150px]">
                                            <div className="grid grid-cols-4 bg-gray-100 p-3 font-medium text-gray-700 sticky top-0 z-10">
                                                <div className="col-span-1">Property ID</div>
                                                <div className="col-span-1">Property Name</div>
                                                <div className="col-span-1">Owner ID</div>
                                                <div className="col-span-1">Owner Name</div>
                                            </div>

                                            <div className="overflow-y-auto max-h-[100px]">
                                                {tenantProperties.length > 0 ? (
                                                    tenantProperties.map((property) => (
                                                        <div
                                                            key={property.assignmentID}
                                                            className="grid grid-cols-4 p-3 border-b border-gray-200 text-gray-700 text-[15px]"
                                                        >
                                                            <div>{property.propertyID}</div>
                                                            <div>{property.propertyName}</div>
                                                            <div>{property.ownerID}</div>
                                                            <div>{property.ownerName}</div>
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

                    {tenants.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-[#081E4A] text-[28px] font-medium">
                            No Tenants Found
                        </div>
                    ) : (
                        <>

                            <div className="grid grid-cols-14 bg-gray-100 p-4 font-medium text-gray-700 sticky top-0 z-10">
                                <div className="col-span-2">TENANT ID</div>
                                <div className="col-span-2">USERNAME</div>
                                <div className="col-span-3">EMAIL</div>
                                <div className="col-span-3">CNIC</div>
                                <div className="col-span-4 flex justify-end gap-12 pr-12">
                                    <span>VIEW</span>
                                    <span>EDIT</span>
                                    <span>DELETE</span>
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[40vh]">
                                {filteredTenants.map((tenant) => (
                                    <div key={tenant.id} className="grid grid-cols-14 p-4 border-b border-gray-200 items-center">
                                        <div className="col-span-2 font-medium">{tenant.id}</div>
                                        <div className="col-span-2">{tenant.userName}</div>
                                        <div className="col-span-3">{tenant.email}</div>
                                        <div className="col-span-3">{tenant.cnic}</div>
                                        <div className="col-span-4 flex justify-end gap-2 pr-4">
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1245A8] py-1 px-3 rounded cursor-pointer w-[112px]"
                                                onClick={() => handleView(tenant)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1976D2] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => handleEdit(tenant)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#C42211] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => setTenantToDelete(tenant)}
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
                    <h1 className="text-[36px]">Total Tenants</h1>
                    <h1 className="text-[32px]">{tenants.length}</h1>
                </div>

                {tenantToDelete && (
                    <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 z-[999] flex items-center justify-center">
                        <div className="bg-white p-8 rounded-xl w-[480px] flex flex-col gap-6 shadow-lg relative">
                            <h2 className="text-[24px] font-semibold text-[#081E4A]">Confirm Deletion</h2>
                            <p className="text-gray-600 text-[18px]">Do you really want to delete <strong>{tenantToDelete.userName}</strong>?</p>
                            <div className="flex gap-4 mt-4 w-[100%] justify-end">
                                <button
                                    onClick={() => setTenantToDelete(null)}
                                    className="bg-[#1976D2] hover:bg-[#125BA3] text-white px-[20px] py-2 cursor-pointer rounded-[4.5px] flex gap-[10px]"
                                >
                                    Cancel
                                    <X />
                                </button>
                                <button
                                    onClick={() => handleDelete(tenantToDelete)}
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

export default AdminMngTenants;