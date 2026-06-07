import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Text } from "@chakra-ui/react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface HirerStackedBarChartProps {
    bookings: any[];
}

export default function HirerStackedBarChart({ bookings }: HirerStackedBarChartProps) {
    const venueKeys = [...new Set(bookings.map(booking => booking.venue?.name || "Unknown"))];

    const data = () => {
        const hirerMap: { [hirer: string]: { [venueName: string]: number } } = {};
        bookings.forEach(booking => {
            const hirer = `${booking.hirer?.firstName} ${booking.hirer?.lastName}`;
            const venueName = booking.venue?.name || "Unknown";
            if (!hirerMap[hirer]) hirerMap[hirer] = {};
            hirerMap[hirer][venueName] = (hirerMap[hirer][venueName] || 0) + 1;
        });
        return Object.entries(hirerMap).map(([hirer, venueData]) => ({
            hirer,
            ...venueData
        }));
    };

    return (
        <Box>
            <Text fontWeight="bold" mb={4}>All Hirers Across All Venues (Stacked Bar Chart)</Text>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hirer" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {venueKeys.map((venue, index) => (
                        <Bar key={venue} dataKey={venue} stackId="a" fill={COLORS[index % COLORS.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}