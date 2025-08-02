import { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import axios from "axios";

const monthsTemplate = [
    { month: "Jan", rent: 0 },
    { month: "Feb", rent: 0 },
    { month: "Mar", rent: 0 },
    { month: "Apr", rent: 0 },
    { month: "May", rent: 0 },
    { month: "Jun", rent: 0 },
    { month: "Jul", rent: 0 },
    { month: "Aug", rent: 0 },
    { month: "Sep", rent: 0 },
    { month: "Oct", rent: 0 },
    { month: "Nov", rent: 0 },
    { month: "Dec", rent: 0 },
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-indigo-600 text-white text-sm px-2 py-1 rounded shadow">
                {payload[0].value}
            </div>
        );
    }
    return null;
};

export default function Histogram() {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("Aug");
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState(null);

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
            async function fetchData() {
                try {
                    const response = await axios.get(`http://localhost:8080/payments/monthlyRents/${userId}`);
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        const updatedData = monthsTemplate.map((item) => {
                            const match = response.data.find((dbItem) => dbItem.month === item.month);
                            return match ? { ...item, rent: match.totalAmount } : item;
                        });
                        setData(updatedData);
                    } else {
                        console.warn("No valid monthly data received.");
                        setData(monthsTemplate); // Reset to all zero rents
                    }
                } catch (error) {
                    console.error("Error fetching monthly rents:", error);
                    setData(monthsTemplate); // Also reset to safe template on error
                }
            }

            fetchData();
        }
    }, [userId]);

    if (!data.length) {
        return (
            <div className="bg-white rounded-xl p-5 shadow-md w-full flex items-center justify-center h-[40vh]">
                <p className="text-gray-500 text-lg">No monthly rent data available.</p>
            </div>
        );
    }

    return (

        <div className="bg-white rounded-xl px-5 pt-5 shadow-md w-full h-[40vh]">
            <div className="flex justify-between items-center mb-[10px]">
                <h2 className="text-3xl font-bold text-gray-900">Monthly Rents</h2>
                <div className="relative inline-block text-left">
                    <button
                        onClick={() => setOpen(!open)}
                        className="inline-flex justify-center items-center px-4 py-3 text-sm font-medium  bg-[#F6F6F6] text-[#1A2B88] rounded-[12px] shadow-sm cursor-pointer hover:bg-[#e0e0e0] focus:outline-none"
                    >
                        {selectedMonth}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </button>
                    {open && (
                        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1 text-sm max-h-[230px] overflow-y-scroll">
                                {data.map((entry) => (
                                    <div
                                        key={entry.month}
                                        onClick={() => {
                                            setSelectedMonth(entry.month);
                                            setOpen(false);
                                        }}
                                        className={`px-4 py-2  cursor-pointer hover:bg-gray-100 ${selectedMonth === entry.month ? "bg-indigo-100 font-semibold" : ""
                                            }`}
                                    >
                                        {entry.month}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full h-[32vh]">
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart
                        data={data}
                        barSize={55}
                        margin={{ top: 30, right: 10, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 16, fill: "#1f2937" }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${value}`}
                            tick={{ fontSize: 16, fill: "#1f2937" }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                        <Bar
                            dataKey="rent"
                            radius={[8, 8, 8, 8]}
                            fill="#5932EA"
                            label={({ x, y, width, value, index }) => {
                                const isSelected = data[index].month === selectedMonth;
                                if (!isSelected) return null;

                                const digitCount = `${value}`.length;
                                const minRectWidth = 40;
                                const maxRectWidth = 80;
                                const minDigits = 1;
                                const maxDigits = 4;

                                // Interpolate width based on digit count (1 to 4 digits)
                                const clampedDigits = Math.min(Math.max(digitCount, minDigits), maxDigits);
                                const scale = (clampedDigits - minDigits) / (maxDigits - minDigits);
                                const rectWidth = minRectWidth + scale * (maxRectWidth - minRectWidth);

                                const rectX = x + width / 2 - rectWidth / 2;

                                return (
                                    <>
                                        <rect
                                            x={rectX}
                                            y={y - 30}
                                            width={rectWidth}
                                            height={22}
                                            fill="#1A2B88"
                                            rx={4}
                                        />
                                        <text
                                            x={x + width / 2}
                                            y={y - 15}
                                            fill="#FFFFFF"
                                            textAnchor="middle"
                                            fontSize="16px"
                                            fontWeight="bold"
                                        >
                                            {value}
                                        </text>
                                    </>
                                );
                            }}

                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}