import { useState, useRef } from "react";
import { Eye, EyeClosed, ChevronDown } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "Tenant",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const inputRefs = useRef({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear specific field error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case "username":
                if (!value) return "Username is required";
                break;
            case "password":
                if (!value) return "Password is required";
                if (value.length < 8) {
                    return "Password must be at least 8 characters";
                }
                break;
            default:
                return "";
        }
        return "";
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(key => {
            if (key !== "role") {
                const error = validateField(key, formData[key]);
                if (error) {
                    newErrors[key] = error;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return { isValid, newErrors };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { isValid, newErrors } = validateForm();
        if (!isValid) {
            const firstError = Object.keys(newErrors)[0];
            if (firstError && inputRefs.current[firstError]) {
                inputRefs.current[firstError].focus();
            }
            return;
        }

        try {
            let endpoint;
            switch (formData.role) {
                case "Tenant":
                    endpoint = "http://localhost:8080/tenants/login";
                    break;
                case "Owner":
                    endpoint = "http://localhost:8080/owners/login";
                    break;
                case "Admin":
                    endpoint = "http://localhost:8080/admin/login";
                    break;
                default:
                    throw new Error("Invalid role selected");
            }

            console.log(formData.username, formData.password, endpoint);

            const response = await axios.post(endpoint, {
                username: formData.username,
                password: formData.password
            });


            if (response.data.success) {
                localStorage.setItem('userID', response.data.userId);

                switch (formData.role) {
                    case "Tenant":
                        navigate("/tenantDashboard");
                        break;
                    case "Owner":
                        navigate("/ownerDashboard");
                        break;
                    case "Admin":
                        navigate("/adminDashboard");
                        break;
                }
            } else {
                setErrors({ password: "Invalid credentials" });
                inputRefs.current.password?.focus();
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors({ password: "Invalid credentials" });
            inputRefs.current.password?.focus();
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
                        <span className="text-white text-xl border-b-2 border-orange-400 cursor-pointer">Login</span>
                        <Link to="/signup" className="text-white text-xl border-b-2 border-transparent hover:border-orange-400">Registration</Link>
                    </div>

                    <h1 className="text-3xl text-white mb-2">{getGreeting()}</h1>
                    <p className="text-gray-400 mb-8">Thank you for coming back!</p>

                    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                        {[
                            { label: "Username", name: "username", type: "text" },
                            { label: "Password", name: "password", type: showPassword ? "text" : "password" }
                        ].map((field) => (
                            <div key={field.name} className=" w-full h-fit relative p-1">
                                <div className="flex justify-between items-center bg-[#111822] px-1">
                                    <p className="text-sm text-gray-400">{field.label}</p>
                                    {errors[field.name] && (
                                        <p className="text-red-500 text-xs bg-[#111822] px-2 rounded">
                                            {errors[field.name]}
                                        </p>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        ref={el => inputRefs.current[field.name] = el}
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.label}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        onBlur={() => {
                                            const error = validateField(field.name, formData[field.name]);
                                            if (error) {
                                                setErrors(prev => ({ ...prev, [field.name]: error }));
                                            } else {
                                                setErrors(prev => ({ ...prev, [field.name]: "" }));
                                            }
                                        }}
                                        className={`bg-gray-700 placeholder:text-gray-500 text-white rounded p-3 w-full focus:outline-none pr-10 ${errors[field.name] ? "border border-red-500" : ""
                                            }`}
                                        required
                                    />
                                    {field.name === "password" && (
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                        >
                                            {showPassword ? <EyeClosed /> : <Eye />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Role Dropdown */}
                        <div className="relative">
                            <p className="bg-[#111822] text-sm text-gray-400 px-1">Role</p>
                            <div
                                className={`bg-gray-700 text-white rounded p-3 w-full relative cursor-pointer ${dropdownOpen ? "rounded-b-none" : ""
                                    }`}
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
                                    {["Tenant", "Owner", "Admin"].map(role => (
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

                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded mt-6"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>

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
