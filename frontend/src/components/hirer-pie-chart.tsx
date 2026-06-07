import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Text } from "@chakra-ui/react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface HirerPieChartProps {
    bookings: any[];
}

export default function HirerPieChart({ bookings }: HirerPieChartProps) {
    const data = () => {
        const hirerMap: { [hirer: string]: number } = {};
        bookings.forEach(booking => {
            const hirer = `${booking.hirer?.firstName} ${booking.hirer?.lastName}`;
            hirerMap[hirer] = (hirerMap[hirer] || 0) + 1;
        });
        return Object.entries(hirerMap)
            .map(([name, count]) => ({ name, count }))
            .sort((applicant, booking) => booking.count - applicant.count);
    };

    return (
        <Box>
            <Text fontWeight="bold" mb={4}>Most & Least Active Hirers</Text>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data()}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ${value}`}
                    >
                        {data().map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
}