import { Box, Text, Stack, HStack, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import HirerBarChart from "./hirer-bar-chart";
import HirerPieChart from "./hirer-pie-chart";
import HirerStackedBarChart from "./hirer-stacked-bar-chart";

interface VendorChartsProps {
    vendorId: number;
}

export default function VendorCharts({ vendorId }: VendorChartsProps) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3001/api/bookings/vendor-stats/${vendorId}`)
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [vendorId]);

    if (loading) {
        return null;
    }

    const allBookings = bookings.filter(booking => {
        const date = new Date(booking.dateCreated);
        const now = new Date();
        return true;
    });

    if (bookings.length === 0) {
        return <Text color="gray.500" mt={6}>No owned venues to display charts for.</Text>;
    }

    return (
        <Stack gap={8} mt={8}>
           <HirerBarChart bookings={allBookings} />
            <HirerStackedBarChart bookings={allBookings} />
            <HirerPieChart bookings={allBookings} />
        </Stack>
    );
}