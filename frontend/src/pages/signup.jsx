import { useState, useRef, useEffect } from "react";
import { Eye, EyeClosed, ChevronDown } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
        email: "",
        password: "",
        cnic: "",
        role: "Tenant",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [existingUsers, setExistingUsers] = useState([]);
    const inputRefs = useRef({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const apiUrl = formData.role === "Owner"
                    ? "http://localhost:8080/owners"
                    : "http://localhost:8080/tenants";
                const response = await axios.get(apiUrl);
                setExistingUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [formData.role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const checkBlacklistCNIC = async (value) => {
        const response = await axios.get(`http://localhost:8080/blacklist/${value}`)
        console.log(response);
        return response.data
    }

    const validateField = async (name, value) => {
        switch (name) {
            case "fullName":
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                    return "Only letters and spaces allowed";
                }
                break;
            case "userName":
                if (existingUsers.some(user => user.userName === value)) {
                    return "Username already exists";
                }
                if (value.length < 3) {
                    return "Username must be at least 3 characters";
                }
                break;
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return "Invalid email format";
                }
                break;
            case "password":
                if (value.length < 8) {
                    return "Password must be at least 8 characters";
                }
                break;
            case "cnic":
                if (!/^\d{13}$/.test(value)) {
                    return "CNIC must be 13 digits";
                }
                const isBlacklisted = await checkBlacklistCNIC(value);
                if (isBlacklisted) {
                    return "CNIC is Blacklisted";
                }
                break;
            default:
                return "";
        }
        return "";
    };


    const validateForm = async () => {
        const newErrors = {};
        let isValid = true;

        for (const key of Object.keys(formData)) {
            if (key !== "role") {
                const error = await validateField(key, formData[key]);
                if (error) {
                    newErrors[key] = error;
                    isValid = false;
                }
            }
        }

        setErrors(newErrors); // still update state for UI
        return { isValid, newErrors }; // return for immediate use
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const { isValid, newErrors } = await validateForm();
        if (!isValid) {
            const firstError = Object.keys(newErrors)[0];
            if (firstError && inputRefs.current[firstError]) {
                inputRefs.current[firstError].focus();
            }
            return;
        }

        const accountCreationDate = new Date().toISOString().split("T")[0];
        const newUser = {
            fullName: formData.fullName,
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
            cnic: formData.cnic,
            accountCreationDate: accountCreationDate,
        };

        try {
            const apiUrl = formData.role === "Owner"
                ? "http://localhost:8080/owners"
                : "http://localhost:8080/tenants";

            const response = await axios.post(apiUrl, newUser);
            console.log("User registered successfully:", response.data);
            navigate("/signin");
        } catch (error) {
            console.error("Error during registration:", error);
            if (error.response?.data?.includes("userName")) {
                setErrors(prev => ({ ...prev, userName: "Username already exists" }));
                inputRefs.current.userName?.focus();
            }
            if (error.response?.data?.includes("email")) {
                setErrors(prev => ({ ...prev, email: "Email already exists" }));
                inputRefs.current.email?.focus();
            }
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const getGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) return "Good Morning!";
        if (hours < 18) return "Good Afternoon!";
        return "Good Evening!";
    };

    return (
        <div className="w-[100vw] h-screen flex overflow-hidden">
            <div className="w-[50vw] h-full bg-[#111822] flex flex-col justify-center items-center p-8">
                <div className="w-full max-w-md">
                    <div className="flex space-x-6 mb-10">
                        <Link to="/signin" className="text-white text-xl border-b-2 border-transparent hover:border-orange-400 cursor-pointer">Login</Link>
                        <span className="text-white text-xl border-b-2 border-orange-400">Registration</span>
                    </div>

                    <h1 className="text-3xl text-white mb-2">{getGreeting()}</h1>
                    <p className="text-gray-400 mb-8">Thank you for Joining us!</p>

                    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                        {/* Fields */}
                        {[
                            { label: "Full Name", name: "fullName", type: "text" },
                            { label: "User Name", name: "userName", type: "text" },
                            { label: "Your Email", name: "email", type: "email" },
                            { label: "password", name: "password", type: showPassword ? "text" : "password" },
                            { label: "CNIC", name: "cnic", type: "text" }
                        ].map((field) => (
                            <div key={field.name} className="bg-gray-700 w-full h-fit relative">
                                {/* Label and Error */}
                                <div className="flex justify-between items-center bg-[#111822] px-1">
                                    <p className="text-sm text-gray-400">{field.label}</p>
                                    {errors[field.name] && (
                                        <p className="text-xs text-red-400">{errors[field.name]}</p>
                                    )}
                                </div>

                                {/* Input Field */}
                                <div className="relative">
                                    <input
                                        ref={el => inputRefs.current[field.name] = el}
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.label}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        onBlur={async () => {
                                            const error = await validateField(field.name, formData[field.name]);
                                            if (error) {
                                                setErrors(prev => ({ ...prev, [field.name]: error }));
                                            }
                                        }}
                                        className={`bg-gray-700 placeholder:text-gray-500 text-white rounded p-3 w-full focus:outline-none pr-10 ${errors[field.name] ? "border border-red-500" : ""}`}
                                        required
                                    />
                                    {field.name === "password" && (
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                        >
                                            {showPassword ? <EyeClosed /> : <Eye />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Role Dropdown */}
                        <div className="relative">
                            <div className="flex justify-between items-center bg-[#111822] px-1">
                                <p className="text-sm text-gray-400">Role</p>
                            </div>
                            <div
                                className={`bg-gray-700 text-white rounded p-3 w-full relative cursor-pointer ${dropdownOpen ? "rounded-b-none" : ""}`}
                                onClick={toggleDropdown}
                            >
                                <p>{formData.role}</p>
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg cursor-pointer"
                                >
                                    <ChevronDown />
                                </button>
                            </div>
                            {dropdownOpen && (
                                <div className="absolute left-0 right-0 bg-gray-700 text-white rounded-b p-0 overflow-y-scroll z-10">
                                    {["Tenant", "Owner"].map(role => (
                                        <div
                                            key={role}
                                            onClick={() => {
                                                setFormData({ ...formData, role });
                                                setDropdownOpen(false);
                                            }}
                                            className="p-2 cursor-pointer hover:bg-gray-600"
                                        >
                                            {role}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded mt-6"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Image Section */}
            <div className="w-[50vw] h-screen relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent"></div>
                <img src="/Images/house.png" alt="" className="w-full h-full object-cover" />
                <div className="absolute bottom-8 right-8 text-white text-3xl font-bold">
                    <img src="/logo.svg" alt="" />
                </div>
            </div>
        </div>
    );
}
