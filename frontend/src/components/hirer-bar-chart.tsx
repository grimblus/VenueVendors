import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Text } from "@chakra-ui/react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface HirerBarChartProps {
    bookings: any[];
}

export default function HirerBarChart({ bookings }: HirerBarChartProps) {
    const hirerKeys = [...new Set(bookings.map(booking =>
        `${booking.hirer?.firstName} ${booking.hirer?.lastName}`
    ))];

    const data = () => {
        const venueMap: { [venue: string]: { [hirer: string]: number } } = {};
        bookings.forEach(booking => {
            const venue = booking.venue?.name || "Unknown";
            const hirer = `${booking.hirer?.firstName} ${booking.hirer?.lastName}`;
            if (!venueMap[venue]) venueMap[venue] = {};
            venueMap[venue][hirer] = (venueMap[venue][hirer] || 0) + 1;
        });
        return Object.entries(venueMap).map(([venue, hirers]) => ({
            venue,
            ...hirers
        }));
    };

    return (
        <Box>
            <Text fontWeight="bold" mb={4}>Hirers per Venue (Bar Chart)</Text>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="venue" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {hirerKeys.map((hirer, index) => (
                        <Bar key={hirer} dataKey={hirer} fill={COLORS[index % COLORS.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}