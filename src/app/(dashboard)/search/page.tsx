"use client"
import { Input } from "@/components/ui/input";
import { ChevronDown, Pin, PinOff, Plus, Search } from 'lucide-react';
import { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const faculties = [
    { title: "Engineering", index: 0 },
    { title: "Math", index: 1 },
    { title: "Science", index: 2 },
    { title: "Health", index: 3 },
    { title: "Environment", index: 4 },
    { title: "Arts", index: 5 },
    { title: "Other", index: 6 }
];

const departments = [
    ["AE", "BME", "CHE", "CIVE", "ECE", "ME", "MSCI", "MSE", "MTE", "NE", "SE", "SYDE"],
    ["AMATH", "ACTSC", "CO", "CS", "MATH", "STAT"],
    ["ASTRN", "BIOL", "CHEM", "EARTH", "OPTOM", "PHYS", "SCBUS", "SCI"],
    ["HEALTH", "HLTH", "KIN", "PHS", "REC"],
    ["ERS", "GEOG", "INTEG", "PLAN"],
    ["AFM", "APPLS", "ANTH", "BLKST", "CLAS", "COMMST", "EASIA", "ECON", "EMLS", "ENGL", "FINE", "FR", "GER", "GBDA", "GSJ", "GGOV", "HIST", "ISS", "ITAL", "ITALST", "JS", "LS", "MEDVL", "MUSIC", "PACS", "PHIL", "PSCI", "PSYCH", "RS", "SDS", "SMF", "SOC", "SOCWK", "SWK", "SWREN", "SPAN", "TS"],
    ["BET", "PD", "SAF", "ARCH", "DAC", "ENBUS", "SFM"]
];

export default function SearchPage() {
    gsap.registerPlugin(useGSAP);

    const [faculty, setFaculty] = useState(faculties[0]);
    const [dept, setDept] = useState("Department");
    const [courses, setCourses] = useState<string[] | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set());

    useGSAP(() => {
        const tl = gsap.timeline({ ease: 'power4.inOut' });
        tl.to('.search', { width: '70%', duration: 1.25 });
        tl.to('.faculty', { opacity: "100%", duration: 0.5 });
        tl.to('.department', { opacity: "100%", duration: 0.5 });
    });

    const applySearch = (value: string) => {
        if (courses) {
            // Always include all pinned items
            const allPinnedItems = Array.from(pinnedItems);

            if (value.trim() !== "") {
                // Filter non-pinned items based on the search query
                const matches = courses.filter((item) =>
                    !pinnedItems.has(item) && item.toLowerCase().startsWith(value.toLowerCase())
                );

                // Combine pinned items with matching non-pinned items
                setResults([...allPinnedItems, ...matches]);
            } else {
                // If no search query, show all items with pinned items at the top
                const unpinnedItems = courses.filter(item => !pinnedItems.has(item));
                setResults([...allPinnedItems, ...unpinnedItems]);
            }
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        applySearch(value);
    };

    const togglePin = (course: string) => {
        setPinnedItems(prevPinned => {
            const newPinned = new Set(prevPinned);
            if (newPinned.has(course)) {
                newPinned.delete(course);
            } else {
                newPinned.add(course);
            }
            return newPinned;
        });
        // Re-apply the search with the current query
        applySearch(query);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/search/courses/');
                const { data, error } = await res.json();

                if (error) {
                    console.error("ERROR ", error);
                }

                if (!data || !data[0]) {
                    console.error("No courses returned by API");
                    return;
                }

                setCourses(data || null);
                setResults(data || []);
            } catch (error) {
                console.error("Error fetching courses data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        // Re-apply search whenever pinnedItems changes
        applySearch(query);
    }, [pinnedItems, courses, query]);

    return (
        <div className="w-full">
            <div className="w-full py-3 flex items-center justify-center">
                <div className="search w-4">
                    <Input value={query.toUpperCase()} onChange={handleSearch} placeholder="Search" leadingIcon={<Search className="h-4" />} />
                </div>
            </div>
            <div className="w-full flex items-center justify-center py-1 mx-10 gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="faculty opacity-0">
                        <Button variant="outline">
                            {faculty.title}
                            <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={faculties[faculty.index].title}>
                            {faculties.map((facultyOption) => (
                                <DropdownMenuRadioItem
                                    key={facultyOption.index}
                                    value={facultyOption.title}
                                    onSelect={() => setFaculty(faculties[facultyOption.index])}
                                >
                                    {facultyOption.title}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="department opacity-0">
                        <Button variant="outline">
                            {dept}
                            <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={dept} onValueChange={setDept}>
                            {departments[faculty.index].map((departmentOption) => (
                                <DropdownMenuRadioItem key={departmentOption} value={departmentOption}>
                                    {departmentOption}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ScrollArea className="m-3">
                <div className="max-h-[84vh]">
                    {isLoading ? (
                        Array.from({ length: 10 }, (_, index) => (
                            <div key={index} className="flex items-center space-x-4 rounded-md border p-4 mb-3 h-[90px]">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none pb-1">
                                        <Skeleton className="h-4 w-[5rem]" />
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        <Skeleton className="h-3 w-1/12" />
                                    </p>
                                </div>
                                <Button variant="ghost" className="p-0">
                                    <Plus />
                                </Button>
                                <Button className="p-0" variant="ghost">
                                    <Pin />
                                </Button>
                            </div>
                        ))
                    ) : (
                        results.map((result) => (
                            <div key={result} className="flex items-center space-x-4 rounded-md border p-4 mb-3 h-[90px]">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none pb-1">
                                        {result}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        This is some description
                                    </p>
                                </div>
                                <Button variant="ghost" className="p-0">
                                    <Plus />
                                </Button>
                                <Button className="p-0" variant="ghost" onClick={() => togglePin(result)}>
                                    {pinnedItems.has(result) ? <PinOff /> : <Pin />}
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

