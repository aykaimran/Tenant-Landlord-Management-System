import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, LabelList } from "recharts";

const COLORS = ["#3C21F7", "#1B0C83", "#7E5BFF"];

const AdminPieChart = () => {
    const [pieData, setPieData] = useState([]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    style={{
                        background: '#B8B8B8',
                        color: '#1B0C83',
                        // border: '1px solid #ccc',
                        borderRadius: '7px',
                        padding: '5px 5px',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}
                >
                    <p style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        fetch("http://localhost:8080/properties/areacount")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const formattedData = data.map((item) => ({
                        name: item.area,
                        value: Number(item.count),
                    }));
                    setPieData(formattedData);
                } else {
                    setPieData([]); // Safe fallback
                }
            })
            .catch((error) => {
                console.log("Error Fetching data from http://localhost:8080/properties/areacount", error);
                setPieData([]); // In case of fetch error
            });
    }, []);
    
    console.log(pieData);
    if (!pieData.length) return <p className="text-center">No data available for chart <br/> <i className="text-blue-800">(0 Properties)</i></p>;

    const total = pieData.reduce((acc, item) => acc + item.value, 0);

    return (
        <PieChart width={220} height={230}>
            <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={75}
                dataKey="value"
                // label
                labelLine={false}
            >
                {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList
                    dataKey="value"
                    position="outside"
                    fontSize={12}
                    stroke="none"
                    fill="#000"
                    fontWeight="bold" // Make text bold
                />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
        </PieChart>
    );
};

export default AdminPieChart;
