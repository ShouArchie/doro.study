"use client"
import { Input } from "@/components/ui/input";
import { ChevronDown, Pin, PinOff, Plus, Search } from 'lucide-react';
import { useEffect, useState, useRef } from "react";
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

    const [faculty, setFaculty] = useState("Faculty");
    const [facultyIndex, setFacultyIndex] = useState<number>(0)
    const [dept, setDept] = useState("Department");
    const [courses, setCourses] = useState<string[] | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set());
    const resultsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ ease: 'power4.inOut' });
        tl.to('.search', { width: '70%', duration: 1.25 });
        tl.to('.faculty', { opacity: "100%", duration: 0.5 });
        tl.to('.department', { opacity: "100%", duration: 0.5 });
    });

    const applySearch = (value: string) => {
        if (courses) {
            const allPinnedItems = Array.from(pinnedItems);
            if (value.trim() !== "") {
                const matches = courses.filter((item) => {
                    const lowerItem = item.toLowerCase();
                    const lowerValue = value.toLowerCase();
                    return lowerItem.includes(lowerValue); // This will match substrings anywhere in the course code
                });
                const unpinnedMatches = matches.filter(item => !pinnedItems.has(item));
                setResults([...allPinnedItems, ...unpinnedMatches]);
            } else {
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

    const animatePin = (course: string, isPinning: boolean) => {
        if (resultsRef.current) {
            const courseElement = resultsRef.current.querySelector(`[data-course="${course}"]`) as HTMLElement;
            if (courseElement) {
                const pinIcon = courseElement.querySelector('.pin-icon') as HTMLElement;
                const tl = gsap.timeline();

                tl.to(courseElement, {
                    backgroundColor: isPinning ? 'rgba(250, 204, 21, 0.2)' : 'transparent',
                    scale: isPinning ? 1.02 : 1,
                    duration: 0.3,
                    ease: "power2.inOut"
                });

                tl.to(pinIcon, {
                    rotate: isPinning ? '45deg' : '0deg',
                    scale: isPinning ? 1.2 : 1,
                    duration: 0.2,
                    ease: "back.out(2)"
                }, "-=0.3");

                tl.to(courseElement, {
                    opacity: 0,
                    y: isPinning ? -20 : 20,
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => {
                        setPinnedItems(prevPinned => {
                            const newPinned = new Set(prevPinned);
                            if (isPinning) {
                                newPinned.add(course);
                            } else {
                                newPinned.delete(course);
                            }
                            return newPinned;
                        });

                        setTimeout(() => {
                            applySearch(query);
                            tl.to(courseElement, {
                                opacity: 1,
                                y: 0,
                                duration: 0.4,
                                scale: 1,
                                ease: "power2.out"
                            });

                            gsap.to(courseElement, {
                                backgroundColor: 'transparent',
                                duration: 0.7,
                                delay: 0.3,
                                ease: "power2.out"
                            });
                        }, 0);
                    }
                });
            }
        }
    };

    const togglePin = (course: string) => {
        const isPinning = !pinnedItems.has(course);
        animatePin(course, isPinning);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/search/courses/');
                const { courseCodes, courseNames, courseDesc, error } = await res.json();

                if (error) {
                    console.error("ERROR ", error);
                    return;
                }

                if (!courseCodes || !courseCodes[0]) {
                    console.error("No courses returned by API");
                    return;
                }

                setCourses(courseCodes || null);
                setResults(courseCodes || []);
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
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
                            {faculty}
                            <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={faculties[facultyIndex].title}>
                            {faculties.map((facultyOption) => (
                                <DropdownMenuRadioItem
                                    key={facultyOption.index}
                                    value={facultyOption.title}
                                    onSelect={() => {setFacultyIndex(facultyOption.index); setFaculty(facultyOption.title)}}
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
                            {departments[facultyIndex].map((departmentOption) => (
                                <DropdownMenuRadioItem key={departmentOption} value={departmentOption}>
                                    {departmentOption}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ScrollArea className="m-3">
                <div ref={resultsRef} className="max-h-[84vh]">
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
                            <div key={result} data-course={result} className="flex items-center space-x-4 rounded-md border p-4 mb-3 h-[90px] transition-all duration-300">
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
                                    <span className="pin-icon transition-transform duration-300">
                                        {pinnedItems.has(result) ? <PinOff /> : <Pin />}
                                    </span>
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

