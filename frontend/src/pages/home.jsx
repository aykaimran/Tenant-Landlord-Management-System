import { House, Quote } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [activeSection, setActiveSection] = useState("Home");
    const [forTenants, setForTenants] = useState(false);



    const handleScroll = (sectionId) => {
        setActiveSection(sectionId);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const navigate = useNavigate();

    return (
        <>
            <div>
                {/* Navbar */}
                <div className="flex justify-between items-center px-12 py-6 font-sans">
                    {/* Logo Section */}
                    <div className="text-3xl font-bold">RENTINEL</div>

                    {/* Navigation Links */}
                    <div className="flex gap-9 justify-center items-center">
                        <ul className="flex space-x-8">
                            {["Home", "About us", "Testimonials"].map((section) => (
                                <li
                                    key={section}
                                    className={`text-base font-semibold font-[lexend] cursor-pointer ${activeSection === section
                                        ? "text-[#1245A8] underline underline-offset-4 decoration-2"
                                        : "text-gray-800"
                                        } hover:text-[#1245A8] hover:underline hover:underline-offset-4 hover:decoration-2`}
                                    onClick={() => handleScroll(section)}
                                >
                                    {section}
                                </li>
                            ))}
                        </ul>

                        {/* Buttons */}
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 text-sm font-bold text-[#1245A8] bg-[#E3ECFF] rounded-lg hover:bg-[#c6d3ef] cursor-pointer"
                                onClick={() => { navigate("/signin") }}
                            >
                                Login
                            </button>
                            <button className="px-4 py-2 text-sm font-bold text-white bg-[#345BA8] rounded-lg hover:bg-blue-800 cursor-pointer"
                                onClick={() => { navigate("/signup") }}
                            >
                                Sign-up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="Home" className="w-full h-[600px] flex justify-center items-center mt-[100px]">
                <div className="flex gap-[600px] items-center bg-white">
                    {/* Left Content */}
                    <div className="">
                        <h1 className="text-5xl font-bold text-[#081E4A] leading-tight">
                            Manage Smarter. <br /> Rent Faster.
                        </h1>
                        <p className="mt-8 text-lg font-[lexend] text-[#4C4C4C]">
                            Where property ownership meets peace of <br />
                            mind. Rentinel brings clarity and confidence <br />
                            to every step of the rental journey.
                        </p>
                        <button className="mt-8 px-6 py-3 text-white bg-[#234B9A] rounded-lg hover:bg-blue-800 text-lg font-semibold cursor-pointer"
                            onClick={() => { navigate("/signup") }}
                        >
                            Get started
                        </button>
                    </div>

                    {/* Right Image */}
                    <div className="w-[600px] h-[600px]">
                        <img src="Images/hero.png" alt="Hero" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
            <div id="About us" className="flex w-full h-[700px] justify-center items-center gap-[350px]">
                {/* Left Section with Image */}
                <div className="relative w-[350px] h-[500px]">
                    <img
                        src="Images/whatWeDo.png"
                        alt="What We Do"
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                    {/* Floating Card */}
                    <div className="absolute top-6 left-[-100px] bg-white p-4 px-6 w-[400px] shadow-md flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-[lexend] font-bold text-[#081E4A]">
                                    Looking to manage Rentals?
                                </h3>
                            </div>
                            <p className="text-sm font-[lexend] text-[#4C4C4C] mt-2">
                                Browse your properties and <br />
                                assigned Tenants.
                            </p>
                        </div>
                        <House className="text-[#1245A8] w-10 h-10" />
                    </div>
                </div>

                {/* Right Section with Text */}
                <div className="mb-40">
                    <h2 className="text-4xl font-bold text-[#081E4A] mb-4">What We Do</h2>
                    <div className="flex gap-4 mb-6 mt-6">
                        <button
                            className={`px-8 py-2 text-sm font-bold text-[#1245A8] shadow-lg rounded-lg cursor-pointer ${!forTenants ? "bg-[#F5F8FF]" : "bg-white hover:bg-gray-200"
                                }`}
                            onClick={() => {
                                setForTenants(false);
                            }}
                        >
                            For Owners
                        </button>
                        <button
                            className={`px-8 py-2 text-sm font-bold text-[#1245A8] shadow-lg rounded-lg cursor-pointer ${forTenants ? "bg-[#F5F8FF]" : "bg-white hover:bg-gray-200"
                                }`}
                            onClick={() => {
                                setForTenants(true);
                            }}
                        >
                            For Tenants
                        </button>
                    </div>
                    {!forTenants && (
                        <>
                            <h1 className="font-[lexend] font-medium text-xl mt-9" >Effortless Control Over Every Rental <br /> You Own</h1>
                            <p className="text-lg font-[lexend] text-[#4C4C4C] mt-8">
                                Experience stress-free rental management <br />
                                with Rentinel. We empower you to handle <br />
                                your rentals directly—no unnecessary steps, <br />
                                no middlemen, just simple, secure control <br />
                                over what you own.
                            </p>
                        </>
                    )}
                    {forTenants && (
                        <>
                            <h1 className="font-[lexend] font-medium text-xl mt-9">Simplify Your Rental Experience <br /> With Ease</h1>
                            <p className="text-lg font-[lexend] text-[#4C4C4C] mt-8">
                                Discover a seamless way to manage your rentals <br />
                                with Rentinel. View your assigned properties, <br />
                                track your rental payments, and pay securely—all <br />
                                in one place. No hassle, no delays, just a smarter <br />
                                way to stay in control of your rental journey. <br />
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div id="Testimonials" className="px-12 w-full h-[700px] mt-[100px]">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-[#081E4A]">Testimonials</h2>
                    <p className="text-lg font-[lexend] text-gray-900 mt-2">What The People Think About Us</p>
                </div>

                {/* Testimonials Cards */}
                <div className="flex justify-center items-center gap-16 mt-24">
                    {/* Card 1 */}
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] h-[270px] text-center relative">
                        <Quote className="text-blue-700 w-8 h-8 mx-auto mb-4 absolute left-2 rotate-180" />
                        <img
                            src="Images/person2.png"
                            alt="John Doe"
                            className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-lg font-bold text-gray-900">John Doe</h3>
                        <p className="text-sm text-gray-500">Owner</p>
                        <p className="text-sm text-gray-600 mt-4">
                            This platform is incredibly intuitive and efficient, streamlining our workflow and boosting productivity. A must-have for any team!
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] h-[300px] text-center relative">
                        <Quote className="text-green-600 w-8 h-8 mx-auto mb-4 absolute left-2 rotate-180" />
                        <img
                            src="Images/person1.png"
                            alt="Michael Johnson"
                            className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-lg font-bold text-gray-900">Michael Johnson</h3>
                        <p className="text-sm text-gray-500">Tenant</p>
                        <p className="text-sm text-gray-600 mt-4">
                            User-friendly and feature-rich, it has transformed our operations, making tasks seamless and efficient. Highly recommended for professionals!
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] h-[270px] text-center relative">
                        <Quote className="text-yellow-500 w-8 h-8 mx-auto mb-4 absolute left-2 rotate-180" />
                        <img
                            src="Images/person3.png"
                            alt="Emily Smith"
                            className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-lg font-bold text-gray-900">Emily Smith</h3>
                        <p className="text-sm text-gray-500">Owner</p>
                        <p className="text-sm text-gray-600 mt-4">
                            A game-changer for our sales team! Easy to use, reliable, and packed with great features that enhance efficiency and collaboration.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center px-12 h-[600px] bg-white gap-[300px]">
                {/* Left Content */}
                <div className="max-w-lg">
                    <h2 className="text-3xl font-bold text-[#081E4A] leading-tight">
                        Ready to Take Control of Your Rentals?
                    </h2>
                    <p className="mt-4 text-lg font-[lexend] text-[#4C4C4C]">
                        Our platform enables direct communication between renters and property managers, ensuring you get access to a wide range of options and exclusive offers.
                    </p>
                    <button className="mt-8 px-6 py-3 text-white bg-[#234B9A] rounded-lg hover:bg-blue-800 text-lg font-semibold cursor-pointer"
                        onClick={() => { navigate("/signup") }}
                    >
                        Get started
                    </button>
                </div>

                {/* Right Image */}
                <div className=" w-[500px] h-[500px]">
                    <img
                        src="Images/subfooter.png"
                        alt="Control Rentals"
                        className="w-full h-full object-cover shadow-lg"
                    />
                </div>
            </div>
            <footer className="bg-[#234B9A] font-[lexend] text-[#C4BDBD] pt-32">
                <div className="container mx-auto px-12 flex justify-between">
                    {/* Left Section */}
                    <div>
                        <h3 className="text-2xl text-white font-bold mb-4">RENTINEL</h3>
                        <p className="text-sm">
                            Discover, connect, and secure your <br />
                            dream rental property with ease through <br />
                            our platform.
                        </p>
                    </div>

                    {/* Center Section */}
                    <div>
                        <h4 className="text-lg text-white font-semibold mb-4">Links</h4>
                        <ul className="text-sm space-y-2">
                            <li className="cursor-pointer"
                                onClick={() => { handleScroll("About us") }}
                            >About Us</li>
                            <li className="cursor-pointer">FAQ</li>
                            <li className="cursor-pointer"
                                onClick={() => { navigate("/signin") }}
                            >
                                Login
                            </li>
                            <li className="cursor-pointer"
                                onClick={() => { navigate("/signup") }}
                            >Sign-Up </li>
                        </ul>
                    </div>

                    {/* Right Section */}
                    <div>
                        <h4 className="text-lg text-white font-semibold mb-4">Contact us</h4>
                        <p className="text-sm">
                            FAST-NUCES, LAHORE <br />
                            support.rentinel@gmail.com
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-400 py-3 mt-10 text-center text-sm items-start flex">
                    <span className="ml-52">© 2025, Rentinel™ TEAM#2. All Rights Reserved</span>
                </div>
            </footer>
        </>

    );
};

export default Home;
