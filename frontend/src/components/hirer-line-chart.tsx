import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Text } from "@chakra-ui/react";

interface HirerLineChartProps {
    bookings: any[];
}

export default function HirerLineChart({ bookings }: HirerLineChartProps) {
    const data = () => {
        const dateMap: { [date: string]: number } = {};
        bookings.forEach(booking => {
            const date = new Date(booking.dateCreated).toLocaleDateString("en-AU");
            dateMap[date] = (dateMap[date] || 0) + 1;
        });

        return Object.entries(dateMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => {
                const [dayA, monthA, yearA] = a.date.split("/").map(Number);
                const [dayB, monthB, yearB] = b.date.split("/").map(Number);
                return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
            });
    };

    return (
        <Box>
            <Text fontWeight="bold" mb={4}>Venue Utilization Over Time</Text>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                        name="Bookings"
                        dot={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}