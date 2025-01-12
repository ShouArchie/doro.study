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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    const [courses, setCourses] = useState<{id: string, code: string, name: string, description: string}[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{id: string, code: string, name: string, description: string}[]>([]);
    const [pinnedItems, setPinnedItems] = useState<string[]>([]);
    const resultsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ ease: 'power4.inOut' });
        tl.to('.search', { width: '70%', duration: 1.25 });
        tl.to('.faculty', { opacity: "100%", duration: 0.5 });
        tl.to('.department', { opacity: "100%", duration: 0.5 });
    });

    const applySearch = (value: string) => {
        if (courses.length > 0) {
            let filteredResults = [...courses];

            if (value.trim() !== "") {
                filteredResults = filteredResults.filter((item) => {
                    const lowerCode = item.code.toLowerCase();
                    const lowerValue = value.toLowerCase();
                    return lowerCode.includes(lowerValue);
                });
            }

            // Always include pinned items at the top in the order they were pinned
            const pinnedResults = pinnedItems
                .map(id => courses.find(course => course.id === id))
                .filter((course): course is { id: string, code: string, name: string, description: string } => course !== undefined);
            const unpinnedResults = filteredResults.filter(item => !pinnedItems.includes(item.id));

            setResults([...pinnedResults, ...unpinnedResults]);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        applySearch(value);
    };

    const animateCourseItem = (course: string, isPinning: boolean) => {
        if (resultsRef.current) {
            const courseElement = resultsRef.current.querySelector(`[data-course="${course}"]`) as HTMLElement;
            if (courseElement) {
                const pinIcon = courseElement.querySelector('.pin-icon') as HTMLElement;
                const tl = gsap.timeline();

                // Faster initial animation
                tl.to(courseElement, {
                    backgroundColor: isPinning ? 'rgba(250, 204, 21, 0.2)' : 'transparent',
                    scale: isPinning ? 1.02 : 1,
                    duration: 0.2,
                    ease: "power2.inOut"
                });

                // Faster pin icon animation
                tl.to(pinIcon, {
                    rotate: isPinning ? '45deg' : '0deg',
                    scale: isPinning ? 1.2 : 1,
                    duration: 0.15,
                    ease: "back.out(1)"
                }, "-=0.3");

                // Faster and smoother disappearing animation
                tl.to(courseElement, {
                    opacity: 0,
                    y: isPinning ? -10 : 10,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        setPinnedItems(prevPinned => {
                            if (isPinning) {
                                return [...prevPinned, course];
                            } else {
                                return prevPinned.filter(id => id !== course);
                            }
                        });

                        // Immediate state update and re-render
                        applySearch(query);

                        // Faster reappearing animation
                        gsap.to(courseElement, {
                            opacity: 1,
                            y: 0,
                            duration: 0.3,
                            scale: 1,
                            ease: "power2.out"
                        });

                        // Faster background color fade
                        gsap.to(courseElement, {
                            backgroundColor: 'transparent',
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }
                });
            }
        }
    };

    const togglePin = (course: {id: string, code: string, name: string, description: string}) => {
        const isPinning = !pinnedItems.includes(course.id);
        animateCourseItem(course.id, isPinning);
    };

    const addCourse = async (course_code: string, id: string) => {
        // const coursesData = await fetch('/api/courses/sidebar')
        // const res = await coursesData.json()

        // console.log("COURSES RETURNED: ", res)

        const payload = {
            value: { code:course_code, id:id }
        }

        const addedCourse = await fetch('/api/courses/sidebar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const response = await addedCourse.json();
        
        console.log("API POST RESPONSE: ", response)

        // const { data, error } = await response.json();

        // if (error){
        //     console.error("ERROR:", error)
        // }

        // if (!data){
        //     console.error("No courses returned by database")
        // }
    }

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/search/courses/');
                const { ids, courseCodes, courseNames, courseDescriptions, error } = await res.json();

                if (error) {
                    console.error("ERROR ", error);
                    return;
                }

                if (!courseCodes || !courseCodes[0]) {
                    console.error("No courses returned by API");
                    return;
                }

                const combinedData = ids.map((id:string, index:number) => ({
                    id: id,
                    code: courseCodes[index],
                    name: courseNames[index],
                    description: courseDescriptions[index]
                }));

                console.log("IMPORTANT INFO: ", combinedData)

                setCourses(combinedData);
                setResults(combinedData);
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        if (courses.length > 0) {
            applySearch(query);
        }
    }, [pinnedItems, query, courses]);

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
                                    <Skeleton className="h-4 w-[5rem] pb-1 leading-none" />
                                    <Skeleton className="h-3 w-1/12" />
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
                        <Accordion type="single" collapsible className="w-full">
                            {results.map((result) => (
                                <AccordionItem key={result.id} value={result.id} className="border rounded-md mb-3 overflow-hidden">
                                    <div 
                                        onClick={() => {
                                            const accordionTrigger = document.querySelector(`[data-state][value="${result.id}"]`);
                                            if (accordionTrigger) {
                                                const currentState = accordionTrigger.getAttribute('data-state');
                                                accordionTrigger.setAttribute('data-state', currentState === 'open' ? 'closed' : 'open');
                                            }
                                        }}
                                    >
                                        <div data-course={result.id} className="flex items-center space-x-4 p-4">
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {result.code}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {result.name}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <AccordionTrigger 
                                                    className="p-0 h-8 w-8" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                    }}
                                                    onFocus={(e) => e.target.blur()}
                                                >
                                                </AccordionTrigger>
                                                <Button variant="ghost" className="p-0 h-8 w-8">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    className="p-0 h-8 w-8"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        togglePin(result);
                                                    }}
                                                >
                                                    <span className="pin-icon transition-transform duration-300">
                                                        {pinnedItems.includes(result.id) ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                        <AccordionContent>
                                            <div className="px-4 pb-0">
                                                <p className="text-sm text-muted-foreground">{result.description}</p>
                                            </div>
                                        </AccordionContent>
                                    </div>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

