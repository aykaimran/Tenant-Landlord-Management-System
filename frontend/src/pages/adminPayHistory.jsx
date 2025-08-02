import { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/adminSidebar";
import axios from "axios";
import { Pencil, Trash2, Eye, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminMngPayments = () => {
    const [payments, setPayments] = useState([]);
    const [viewedPayment, setViewedPayment] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const formRef = useRef(null);
    const [paymentToDelete, setPaymentToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [property, setProperty] = useState([]);

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
        axios.get("http://localhost:8080/payments")
            .then(response => {
                setPayments(response.data);
            })
            .catch(error => {
                console.error("Error fetching payments:", error);
            });
    }, []);

    const handleView = (payment) => {
        axios.get(`http://localhost:8080/properties/${payment.propertyID}`)
            .then(response => {
                setProperty(response.data);
            })
            .catch(error => {
                console.error("Error fetching property:", error);
            });
        setViewedPayment(payment);
        setEditMode(false);
        setFormErrors({});
    };

    const handleBack = () => {
        setViewedPayment(null);
        setEditMode(false);
    };

    const handleDelete = (payment) => {
        axios.delete(`http://localhost:8080/payments/${payment.paymentID}`)
            .then(() => {
                setPayments(prev => prev.filter(p => p.paymentID !== payment.paymentID));
                setPaymentToDelete(null);
                if (viewedPayment?.paymentID === payment.paymentID) {
                    setViewedPayment(null);
                }
            })
            .catch(error => {
                console.error("Error deleting payment:", error);
            });
    };

    const handleEdit = (payment) => {
        axios.get(`http://localhost:8080/properties/${payment.propertyID}`)
            .then(response => {
                setProperty(response.data);
            })
            .catch(error => {
                console.error("Error fetching property:", error);
            });
        setViewedPayment(payment);
        setEditMode(true);
        setFormErrors({});
    };

    const validateForm = () => {
        const formData = new FormData(formRef.current);
        const status = formData.get('paymentStatus')?.toLowerCase();
        const isValid = status === "pending" || status === "paid";

        if (!isValid) {
            setFormErrors({ paymentStatus: "Status must be either 'Pending' or 'Paid'" });
        } else {
            setFormErrors({});
        }

        return isValid;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        const formData = new FormData(formRef.current);
        const updatedPayment = {
            ...viewedPayment,
            paymentStatus: formData.get('paymentStatus'),
        };

        axios.put("http://localhost:8080/payments/updateStatus", updatedPayment)
            .then(response => {
                setPayments(prev => prev.map(p =>
                    p.paymentID === viewedPayment.paymentID ? updatedPayment : p
                ));
                setViewedPayment(updatedPayment);
                setEditMode(false);
            })
            .catch(error => {
                console.error("Error updating payment:", error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const PaymentBox = ({ label, name, value }) => {
        const isReadOnly = [
            "userName",
            "paymentID",
            "paymentDate",
            "amount",
            "propertyID",
            "propertyName",
            "tenantUserName",
            "ownerUserName",
        ].includes(name);

        const isError = formErrors[name];
        const [localValue, setLocalValue] = useState(value || "");

        // Sync local value when prop changes
        useEffect(() => {
            setLocalValue(value || "");
        }, [value]);

        const handleChange = (e) => {
            const newValue = e.target.value;
            setLocalValue(newValue);

            // Clear error if user starts typing
            if (isError && newValue.trim()) {
                setFormErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        };

        const handleBlur = () => {
            // Update parent state when leaving the field
            setViewedPayment(prev => ({
                ...prev,
                [name]: localValue
            }));
        };

        return (
            <div className="flex flex-col w-[170px]">
                <label className="text-[14px] font-semibold text-gray-600 mb-1">{label}</label>
                {editMode ? (
                    <input
                        name={name}
                        type="text"
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`px-4 py-2 rounded w-full text-[15px] text-gray-800 bg-[#F2F2F2] focus:outline-none border ${isError ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                <div className="pl-[80px] pr-[50px] mt-[10px]">
                    <h1 className="text-[#081E4A] text-[54px] font-bold">Manage Payments</h1>
                    <p className="text-[15px] text-[#4D4D4D] font-light">View, edit, or delete payments.</p>
                </div>

                <div className="mx-[80px] mt-8 bg-white rounded-lg shadow-md overflow-hidden relative w-[70vw] h-[50vh]">
                    {viewedPayment && (
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
                                    <div className="flex flex-wrap gap-[35px]">
                                        <PaymentBox label="PAYMENT ID" name="paymentID" value={viewedPayment?.paymentID} />
                                        <PaymentBox label="PAYMENT DATE" name="paymentDate" value={viewedPayment?.paymentDate} />
                                        <PaymentBox label="AMOUNT" name="amount" value={viewedPayment?.amount} />
                                        <PaymentBox label="PAYMENT STATUS" name="paymentStatus" value={viewedPayment?.paymentStatus} />
                                    </div>
                                    <div className="flex flex-wrap gap-[35px]">
                                        <PaymentBox label="PROPERTY ID" name="propertyID" value={viewedPayment?.propertyID} />
                                        <PaymentBox label="PROPERTY NAME" name="propertyName" value={property?.propertyName} />
                                    </div>
                                    <div className="flex flex-wrap gap-[35px]">
                                        <PaymentBox label="TENANT USERNAME" name="tenantUserName" value={viewedPayment?.tenantUserName} />
                                        <PaymentBox label="OWNER USERNAME" name="ownerUserName" value={viewedPayment?.ownerUserName} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}


                    {payments.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-[#081E4A] text-[28px] font-medium">
                            No payment records
                        </div>
                    ) : (
                        <>

                            <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700 sticky top-0 z-10">
                                <div className="col-span-2">PAYMENT ID</div>
                                <div className="col-span-2">AMOUNT</div>
                                <div className="col-span-2">STATUS</div>
                                <div className="col-span-2">DATE</div>
                                <div className="col-span-4 flex justify-end gap-17 pr-14">
                                    <span>VIEW</span>
                                    <span>EDIT</span>
                                    <span>DELETE</span>
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[40vh]">
                                {payments.map((payment) => (
                                    <div key={payment.paymentID} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center">
                                        <div className="col-span-2 font-medium">{payment.paymentID}</div>
                                        <div className="col-span-2">${payment.amount}</div>
                                        <div className={`col-span-2 ${payment.paymentStatus === 'Completed' ? 'text-green-600' :
                                            payment.paymentStatus === 'Pending' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {payment.paymentStatus}
                                        </div>
                                        <div className="col-span-2 text-gray-600">
                                            {new Date(payment.paymentDate).toLocaleDateString()}
                                        </div>
                                        <div className="col-span-4 flex justify-end gap-2 pr-4">
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1245A8] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => handleView(payment)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1976D2] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => handleEdit(payment)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#C42211] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => setPaymentToDelete(payment)}
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
                    <h1 className="text-[36px]">Total Payments</h1>
                    <h1 className="text-[32px]">{payments.length}</h1>
                </div>

                {paymentToDelete && (
                    <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 z-[999] flex items-center justify-center">
                        <div className="bg-white p-8 rounded-xl w-[480px] flex flex-col gap-6 shadow-lg relative">
                            <h2 className="text-[24px] font-semibold text-[#081E4A]">Confirm Deletion</h2>
                            <p className="text-gray-600 text-[18px]">Do you really want to delete payment for Property <strong>{paymentToDelete.propertyName}</strong>?</p>
                            <div className="flex gap-4 mt-4 w-[100%] justify-end">
                                <button
                                    onClick={() => setPaymentToDelete(null)}
                                    className="bg-[#1976D2] hover:bg-[#125BA3] text-white px-[20px] py-2 cursor-pointer rounded-[4.5px] flex gap-[10px]"
                                >
                                    Cancel
                                    <X />
                                </button>
                                <button
                                    onClick={() => handleDelete(paymentToDelete)}
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

export default AdminMngPayments;