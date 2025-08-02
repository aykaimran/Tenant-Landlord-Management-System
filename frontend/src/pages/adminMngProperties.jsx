import { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/adminSidebar";
import axios from "axios";
import { Pencil, Trash2, Eye, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminMngProperties = () => {
    const [properties, setProperties] = useState([]);
    const [rentAssignments, setRentAssignments] = useState([]);
    const [viewedProperty, setViewedProperty] = useState(null);
    const [rentAssignmentToUp, setRentAssignmentToUp] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef(null);
    const [tenantValid, setTenantValid] = useState(false);
    const [assignedTennatLocal, setAssignedTennatLocal] = useState(null);
    const [propertyAssignmentToUp, setPropertyAssignmentToUp] = useState(null);
    const [assignedTennat, setAssignedTennat] = useState([]);

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
        fetchProperties();
        fetchRentAssignments();
    }, []);

    const fetchProperties = () => {
        axios.get("http://localhost:8080/properties")
            .then(response => {
                setProperties(response.data);
            })
            .catch(error => {
                console.error("Error fetching properties:", error);
            });
    };

    const fetchRentAssignments = () => {
        axios.get("http://localhost:8080/rentAssignments")
            .then(response => {
                setRentAssignments(response.data);
            })
            .catch(error => {
                console.error("Error fetching rent assignments:", error);
            });
    };

    const getRentAssignment = (propertyId) => {
        console.log(rentAssignments.find(assignment => assignment.propertyID === propertyId));
        return rentAssignments.find(assignment => assignment.propertyID === propertyId);

    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0];
    };

    const handleView = (property) => {
        const assignment = rentAssignments.find(a => a.propertyID === property.propertyID);

        setViewedProperty(property);
        setRentAssignmentToUp(assignment);
        console.log(rentAssignmentToUp);
        setAssignedTennatLocal(property.tenantName);
        setEditMode(false);
        setFormErrors({});
        setTenantValid(null);
        console.log(property);

        // In handleView and handleEdit, update the propertyAssignmentToUp setting:
        axios.get(`http://localhost:8080/propertyAssignments/property/${property.propertyID}`)
            .then(response => {
                // Take the first assignment if the response is an array
                const assignment = Array.isArray(response.data) ? response.data[0] : response.data;
                setPropertyAssignmentToUp(assignment);
            })
            .catch(error => {
                console.error("Error fetching property assignments:", error);
            });

        axios.get(`http://localhost:8080/tenants/userName/${assignment.tenantID}`)
            .then(response => {
                setAssignedTennat(response.data);
            })
            .catch(error => {
                console.error("Error fetching rent assignement tenant:", error);
            });
    };

    const handleEdit = (property) => {
        const assignment = rentAssignments.find(a => a.propertyID === property.propertyID);

        setViewedProperty(property);
        setRentAssignmentToUp(assignment);
        setAssignedTennatLocal(property.tenantName);
        setEditMode(true);
        setFormErrors({});
        setTenantValid(null);


        // In handleView and handleEdit, update the propertyAssignmentToUp setting:
        axios.get(`http://localhost:8080/propertyAssignments/property/${property.propertyID}`)
            .then(response => {
                // Take the first assignment if the response is an array
                const assignment = Array.isArray(response.data) ? response.data[0] : response.data;
                setPropertyAssignmentToUp(assignment);
            })
            .catch(error => {
                console.error("Error fetching property assignments:", error);
            });

        axios.get(`http://localhost:8080/tenants/userName/${assignment.tenantID}`)
            .then(response => {
                setAssignedTennat(response.data);
            })
            .catch(error => {
                console.error("Error fetching rent assignement tenant:", error);
            });
    };

    const handleBack = () => {
        setViewedProperty(null);
        setRentAssignmentToUp(null);
        setEditMode(false);
        setTenantValid(null);
    };

    const validateForm = () => {
        const errors = {};
        const formData = new FormData(formRef.current);

        if (!formData.get('propertyName')?.trim()) {
            errors.propertyName = "Property name is required";
        }
        if (!formData.get('ownerName')?.trim()) {
            errors.ownerName = "Owner name is required";
        }
        if (!formData.get('area')?.trim()) {
            errors.area = "Area is required";
        }
        if (!formData.get('location')?.trim()) {
            errors.location = "Location is required";
        }

        const numericFields = ['numOfRooms', 'numOfBedRooms', 'numOfBaths', 'fixedRent'];
        numericFields.forEach(field => {
            const value = formData.get(field);
            if (!value) {
                errors[field] = "This field is required";
            } else if (!/^\d+$/.test(value)) {
                errors[field] = "Must be a number";
            } else if (parseInt(value) <= 0) {
                errors[field] = "Must be greater than 0";
            }
        });

        const startDate = formData.get('startDate');
        const dueDate = formData.get('dueDate');
        if (startDate && dueDate) {
            const start = new Date(startDate);
            const end = new Date(dueDate);
            if (start > end) {
                errors.startDate = "Start date must be before end date";
                errors.dueDate = "End date must be after start date";
            }
        } else {
            if (!startDate) {
                errors.startDate = "Start date is required";
            }
            if (!dueDate) {
                errors.dueDate = "End date is required";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleDelete = async (propertyID) => {
        try {

            await axios.delete(`http://localhost:8080/rentAssignments/property/${propertyID}`);
            await axios.delete(`http://localhost:8080/propertyAssignments/property/${propertyID}`);
            await axios.delete(`http://localhost:8080/payments/property/${propertyID}`);
            await axios.delete(`http://localhost:8080/properties/${propertyID}`);

            setProperties(prev => prev.filter(p => p.propertyID !== propertyID));
            setRentAssignments(prev => prev.filter(r => r.propertyID !== propertyID));
            setPropertyToDelete(null);
        } catch (error) {
            console.error("Error deleting:", error.response || error.message);
        }
    };

    const handleTenantExist = async (tenantName) => {
        if (tenantName.trim() === "") {
            return null;
        }

        try {
            const response = await axios.get(`http://localhost:8080/tenants/checkUsername/${tenantName}`);
            return response.data;
        } catch (error) {
            console.error("Error checking tenant username:", error);
            return false;
        }
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        const formData = new FormData(formRef.current);

        const tenantName = formData.get('tenantName');
        const isValidTenant = await handleTenantExist(tenantName);
        setTenantValid(isValidTenant);
        setAssignedTennatLocal(tenantName);
        if (!isValidTenant) {
            setTenantValid(false);
            return;
        }
        setTenantValid(true);

        const newTenantResponse = await axios.get(`http://localhost:8080/tenants/id/${tenantName}`);
        const newTenantId = newTenantResponse.data;
        setIsSubmitting(true);

        const updatedProperty = {
            ...viewedProperty,
            propertyName: formData.get('propertyName'),
            ownerName: formData.get('ownerName'),
            area: formData.get('area'),
            location: formData.get('location'),
            numOfRooms: parseInt(formData.get('numOfRooms')),
            numOfBedRooms: parseInt(formData.get('numOfBedRooms')),
            numOfBaths: parseInt(formData.get('numOfBaths')),
            fixedRent: parseInt(formData.get('fixedRent')),
            tenantName: formData.get('tenantName')
        };

        axios.put(`http://localhost:8080/properties/${viewedProperty.propertyID}`, updatedProperty)
            .then(response => {
                setProperties(prev => prev.map(p => p.propertyID === viewedProperty.propertyID ? updatedProperty : p));
                setViewedProperty(updatedProperty);
                setEditMode(false);
                setFormErrors({});
                setTenantValid(null);
            })
            .catch(error => {
                console.error("Error updating property:", error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
        // Get the current dates from state (they should be up-to-date)
        const startDate = rentAssignmentToUp?.startDate;
        const dueDate = rentAssignmentToUp?.dueDate;
        if (rentAssignmentToUp) {
            const rentAssignmentToUpdate = {
                ...rentAssignmentToUp,
                startDate: startDate,
                dueDate: dueDate
            };
            axios.put(`http://localhost:8080/rentAssignments/${rentAssignmentToUp.assignmentID}`, rentAssignmentToUpdate)
                .then(response => {
                    setRentAssignments(prev => prev.map(r =>
                        r.assignmentID === rentAssignmentToUp.assignmentID ? rentAssignmentToUpdate : r
                    ));
                    setRentAssignmentToUp(rentAssignmentToUpdate);

                })
                .catch(error => {
                    console.error("Error updating rent assignment:", error);
                });
        }


        const assignment = Array.isArray(propertyAssignmentToUp)
            ? propertyAssignmentToUp[0]
            : propertyAssignmentToUp;

        if (!assignment || !assignment.assignmentID) {
            console.error("Invalid property assignment data");
            return;
        }
        // Update property assignment if it exists
        await axios.put(
            `http://localhost:8080/propertyAssignments/updateTenant/${assignment.assignmentID}`,
            { tenantID: newTenantId }  // Simplified payload
        );
    };

    const PropertyBox = ({ label, name, value }) => {
        const inputRef = useRef(null);
        const isReadOnly = [
            "propertyID",
            "ownerName",
        ].includes(name);
        const isError = formErrors[name];
        const isNumeric = ['numOfRooms', 'numOfBedRooms', 'numOfBaths', 'fixedRent'].includes(name);
        const isDateField = ['startDate', 'dueDate'].includes(name);
        const [localValue, setLocalValue] = useState(value || "");

        useEffect(() => {
            setLocalValue(value || "");
        }, [value, name]);


        const handleChange = async (e) => {
            const newValue = e.target.value;
            setLocalValue(newValue);
            if (name == "assignedTennat") {
                await setAssignedTennatLocal(localValue);
            }
            // Update parent state for dates
            if (name === 'startDate' || name === 'dueDate') {
                if (rentAssignmentToUp) {
                    setRentAssignmentToUp(prev => ({
                        ...prev,
                        [name]: newValue
                    }));
                }
            }
            if (isError) {
                setFormErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        };

        const handleBlur = () => {
            if (name === 'startDate' || name === 'dueDate') {
                validateForm();
            }
        };

        return (
            <div className="flex flex-col w-[230px]">
                <label className="text-[14px] font-semibold text-gray-600 mb-1">{label}</label>
                {editMode ? (
                    <>
                        <input
                            ref={inputRef}
                            name={name}
                            type={isDateField ? "date" : (isNumeric ? "number" : "text")}
                            value={localValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`px-4 py-2 rounded w-full text-[15px] text-gray-800 bg-[#F2F2F2] focus:outline-none border ${(name === 'tenantName' && tenantValid === false) ? 'border-red-500' :
                                isError ? 'border-red-500' : 'border-gray-300'
                                }`}
                            readOnly={isReadOnly}
                            tabIndex={isReadOnly ? -1 : 0}
                            min={isNumeric ? "1" : undefined}
                        />
                        {isError && !isDateField && (
                            <p className="text-red-500 text-xs mt-1">{formErrors[name]}</p>
                        )}
                    </>
                ) : (
                    <div className="bg-[#E9E9E9] px-4 py-2 rounded w-full text-[15px] text-gray-800">
                        {isDateField ? formatDate(value) : value || "—"}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex font-[Lexend] relative">
            <Sidebar />
            <div className="w-[80vw] bg-[#E6E6E6] relative">
                <div className="pl-[80px] pr-[50px] mt-[10px]">
                    <h1 className="text-[#081E4A] text-[54px] font-bold">Manage Properties</h1>
                    <p className="text-[15px] text-[#4D4D4D] font-light">View, edit, or delete properties.</p>
                </div>
                <div className="mx-[80px] mt-8 bg-white rounded-lg shadow-md relative w-[70vw] h-[50vh]">
                    {viewedProperty && (
                        <div className="absolute top-0 bg-white bg-opacity-90 z-50 flex rounded-lg items-center justify-center px-6 w-[70vw] h-[50vh]">
                            <form ref={formRef} autoComplete="off" className="p-6 rounded-lg w-full space-y-8 relative">
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
                                        <PropertyBox label="PROPERTY ID" name="propertyID" value={viewedProperty.propertyID} />
                                        <PropertyBox label="PROPERTY NAME" name="propertyName" value={viewedProperty.propertyName} />
                                        <PropertyBox label="OWNER NAME" name="ownerName" value={viewedProperty.ownerName} />
                                        <PropertyBox label="AREA" name="area" value={viewedProperty.area} />
                                    </div>
                                    <div className="flex flex-wrap justify-between">
                                        <PropertyBox label="LOCATION" name="location" value={viewedProperty.location} />
                                        <PropertyBox label="NO OF ROOMS" name="numOfRooms" value={viewedProperty.numOfRooms} />
                                        <PropertyBox label="NO OF BED ROOMS" name="numOfBedRooms" value={viewedProperty.numOfBedRooms} />
                                        <PropertyBox label="NO OF BATHS" name="numOfBaths" value={viewedProperty.numOfBaths} />
                                    </div>
                                    <hr className="border-gray-300" />
                                    <div className="flex flex-wrap justify-between">
                                        <PropertyBox
                                            label="RENT START DATE"
                                            name="startDate"
                                            value={rentAssignmentToUp?.startDate}
                                        />
                                        <PropertyBox
                                            label="RENT END DATE"
                                            name="dueDate"
                                            value={rentAssignmentToUp?.dueDate}
                                        />
                                        <PropertyBox label="FIXED RENT AMOUNT" name="fixedRent" value={viewedProperty.fixedRent} />
                                        <PropertyBox label="ASSIGNED TENANT" name="tenantName" value={assignedTennatLocal} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                    {properties.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-[#081E4A] text-[28px] font-medium">
                            No Properties Found
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700 sticky top-0 z-10 rounded-t-lg h-[56px]">
                                <div className="col-span-2">PROPERTY ID</div>
                                <div className="col-span-3">PROPERTY NAME</div>
                                <div className="col-span-4">Location</div>
                                <div className="col-span-3 flex justify-end gap-[50px] pr-[50px]">
                                    <span>VIEW</span>
                                    <span>EDIT</span>
                                    <span>DELETE</span>
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[40vh]">
                                {properties.map((property) => (
                                    <div key={property.propertyID} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center">
                                        <div className="col-span-2 font-medium">{property.propertyID}</div>
                                        <div className="col-span-3">{property.propertyName}</div>
                                        <div className="col-span-4 text-gray-600">{property.location}</div>
                                        <div className="col-span-3 flex justify-end gap-[10px] pr-[14px]">
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1245A8] py-1 px-4 rounded w-[112px] cursor-pointer"
                                                onClick={() => handleView(property)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1976D2] py-1 px-4 rounded w-[112px] cursor-pointer"
                                                onClick={() => handleEdit(property)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#C42211] py-1 px-4 rounded w-[112px] cursor-pointer"
                                                onClick={() => setPropertyToDelete(property)}
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
                    <h1 className="text-[36px]">Total Properties</h1>
                    <h1 className="text-[32px]">{properties.length}</h1>
                </div>
                {propertyToDelete && (
                    <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 z-[999] flex items-center justify-center">
                        <div className="bg-white p-8 rounded-xl w-[480px] flex flex-col gap-6 shadow-lg relative">
                            <h2 className="text-[24px] font-semibold text-[#081E4A]">Confirm Deletion</h2>
                            <p className="text-gray-600 text-[18px]">Do you really want to delete <strong>{propertyToDelete.propertyName}</strong>?</p>
                            <div className="flex gap-4 mt-4 w-[100%] justify-end">
                                <button
                                    onClick={() => setPropertyToDelete(null)}
                                    className="bg-[#1976D2] hover:bg-[#125BA3] text-white px-[20px] py-2 cursor-pointer rounded-[4.5px] flex gap-[10px]"
                                >
                                    Cancel
                                    <X />
                                </button>
                                <button
                                    onClick={() => handleDelete(propertyToDelete.propertyID)}
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

export default AdminMngProperties;