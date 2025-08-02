import { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/ownerSidebar";
import axios from "axios";
import { Pencil, Trash2, Eye, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OwnerMngPayments = () => {
    const [payments, setPayments] = useState([]);
    const [viewedPayment, setViewedPayment] = useState(null);
    const [userId, setUserId] = useState(null);
    const [property, setProperty] = useState(null);

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

    useEffect(() => {
        const storedId = localStorage.getItem('userID');
        if (storedId !== null && storedId !== "null") {
            setUserId(storedId);
        } else {
            console.error('No userId found in localStorage');
        }
    }, []);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:8080/payments/owner/${userId}`)
                .then(response => {
                    setPayments(response.data);
                })
                .catch(error => {
                    console.error("Error fetching payments:", error);
                });
        }
    }, [userId]);

    const handleView = (payment) => {
        axios.get(`http://localhost:8080/properties/${payment.propertyID}`)
            .then(response => {
                setProperty(response.data);
            })
            .catch(error => {
                console.error("Error fetching property:", error);
            });
        setViewedPayment(payment);
    };

    const handleBack = () => {
        setViewedPayment(null);
        setProperty(null);
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

        const [localValue, setLocalValue] = useState(value || "");

        // Sync local value when prop changes
        useEffect(() => {
            setLocalValue(value || "");
        }, [value]);


        return (
            <div className="flex flex-col w-[170px]">
                <label className="text-[14px] font-semibold text-gray-600 mb-1">{label}</label>
                <div className="bg-[#E9E9E9] px-4 py-2 rounded w-full text-[15px] text-gray-800">
                    {value || "—"}
                </div>
            </div>
        );
    };

    return (
        <div className="flex font-[Lexend]">
            <Sidebar />
            <div className="w-[80vw] bg-[#E6E6E6] relative">
                <div className="pl-[80px] pr-[50px] mt-[10px]">
                    <h1 className="text-[#081E4A] text-[54px] font-bold">Payments History</h1>
                    <p className="text-[15px] text-[#4D4D4D] font-light">View payments.</p>
                </div>

                <div className="mx-[80px] mt-8 bg-white rounded-lg shadow-md overflow-hidden relative w-[70vw] h-[50vh]">
                    {viewedPayment && (
                        <div className="absolute top-0 bg-white bg-opacity-90 z-50 flex rounded-lg items-center justify-center px-6 w-[70vw] h-[50vh]">
                            <form className="p-6 rounded-lg w-full max-w-[1000px] space-y-8 relative">
                                <div className="flex justify-between items-center absolute top-4 left-4 w-full pr-[40px]">
                                    <div
                                        onClick={handleBack}
                                        className="w-[43px] h-[43px] cursor-pointer rounded-full bg-[#D9D9D9] flex items-center justify-center"
                                    >
                                        <ChevronLeft className="text-black" />
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
                                <div className="col-span-2">TENANT</div>
                                <div className="col-span-2">DATE</div>
                                <div className="col-span-2">STATUS</div>
                                <div className="col-span-2 flex justify-end gap-17 pr-14">
                                    <span>VIEW</span>
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[322px]">
                                {payments.map((payment) => (
                                    <div key={payment.paymentID} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center">
                                        <div className="col-span-2 font-medium">{payment.paymentID}</div>
                                        <div className="col-span-2">${payment.amount}</div>
                                        <div className="col-span-2">{payment.tenantUserName}</div>
                                        <div className="col-span-2 text-gray-600">
                                            {new Date(payment.paymentDate).toLocaleDateString()}
                                        </div>
                                        <div className={`col-span-2 ${payment.paymentStatus === 'Completed' ? 'text-green-600' :
                                            payment.paymentStatus === 'Pending' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {payment.paymentStatus}
                                        </div>
                                        <div className="col-span-2 flex justify-end gap-2 pr-4">
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1245A8] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => handleView(payment)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
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
            </div>
        </div>
    );
};

export default OwnerMngPayments;