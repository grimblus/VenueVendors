import { Box, Text, Stack, HStack, Button, Spinner, Center } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import HirerBarChart from "./hirer-bar-chart";
import HirerPieChart from "./hirer-pie-chart";
import HirerStackedBarChart from "./hirer-stacked-bar-chart";
import HirerLineChart from "./hirer-line-chart";

type TimeFilter = "week" | "month" | "lastMonth" | "all";

interface VendorChartsProps {
    vendorId: number;
}

export default function VendorCharts({ vendorId }: VendorChartsProps) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!vendorId) return;
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

    // show spinner while loading or not yet mounted
    if (!mounted || loading) {
        return (
            <Center mt={8} flexDirection="column" gap={4}>
                <Spinner size="xl" color="blue.500" />
                <Text color="gray.500">Loading analytics...</Text>
            </Center>
        );
    }

    const filterByTime = (bookings: any[]): any[] => {
        const now = new Date();
        return bookings.filter(booking => {
            const date = new Date(booking.dateCreated);
            if (timeFilter === "week") {
                const weekAgo = new Date(now);
                weekAgo.setDate(now.getDate() - 7);
                return date >= weekAgo;
            } else if (timeFilter === "month") {
                return date.getMonth() === now.getMonth() && 
                       date.getFullYear() === now.getFullYear();
            } else if (timeFilter === "lastMonth") {
                const lastMonth = new Date(now);
                lastMonth.setMonth(now.getMonth() - 1);
                return date.getMonth() === lastMonth.getMonth() && 
                       date.getFullYear() === lastMonth.getFullYear();
            }
            return true;
        });
    };

    const filteredBookings = filterByTime(bookings);

    if (bookings.length === 0) {
        return <Text color="gray.500" mt={6}>No owned venues to display charts for.</Text>;
    }

    return (
        <Stack gap={8} mt={8}>
            {/* Time filter buttons */}
            <HStack gap={2}>
                <Text fontWeight="bold">Show stats for:</Text>
                <Button 
                    size="sm" 
                    colorPalette={timeFilter === "week" ? "blue" : "gray"} 
                    onClick={() => setTimeFilter("week")}
                >
                    This Week
                </Button>
                <Button 
                    size="sm" 
                    colorPalette={timeFilter === "month" ? "blue" : "gray"} 
                    onClick={() => setTimeFilter("month")}
                >
                    This Month
                </Button>
                <Button 
                    size="sm" 
                    colorPalette={timeFilter === "lastMonth" ? "blue" : "gray"} 
                    onClick={() => setTimeFilter("lastMonth")}
                >
                    Last Month
                </Button>
                <Button 
                    size="sm" 
                    colorPalette={timeFilter === "all" ? "blue" : "gray"} 
                    onClick={() => setTimeFilter("all")}
                >
                    All Time
                </Button>
            </HStack>

            <HirerBarChart bookings={filteredBookings} />
            <HirerStackedBarChart bookings={filteredBookings} />
            <HirerPieChart bookings={filteredBookings} />
            <HirerLineChart bookings={filteredBookings} />
        </Stack>
    );
}