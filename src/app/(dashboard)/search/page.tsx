"use client"
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const faculties = [
    {
        title: "Engineering",
        index: 0,
    },
    {
        title: "Math",
        index: 1,
    },
    {
        title: "Science",
        index: 2,
    },
    {
        title: "Health",
        index: 3,
    },
    {
        title: "Environment",
        index: 4,
    },
    {
        title: "Arts",
        index: 5,
    },
    {
        title: "Other",
        index: 6
    },
]

const departments = [
    [ 
        "AE",
        "BME",
        "CHE",
        "CIVE",
        "ECE",
        "ME",
        "MSCI",
        "MSE",
        "MTE",
        "NE",
        "SE",
        "SYDE"
    ],
    [
        "AMATH",
        "ACTSC",
        "CO",
        "CS",
        "MATH",
        "STAT"
    ],
    [
        "ASTRN",
        "BIOL",
        "CHEM",
        "EARTH",
        "OPTOM",
        "PHYS",
        "SCBUS",
        "SCI"
    ],
    [
        "HEALTH",
        "HLTH",
        "KIN",
        "PHS",
        "REC",
    ],
    [
        "ERS",
        "GEOG",
        "INTEG",
        "PLAN"
    ],
    [
        "AFM",
        "APPLS",
        "ANTH",
        "BLKST",
        "CLAS",
        "COMMST",
        "EASIA",
        "ECON",
        "EMLS",
        "ENGL",
        "FINE",
        "FR",
        "GER",
        "GBDA",
        "GSJ",
        "GGOV",
        "HIST",
        "ISS",
        "ITAL",
        "ITALST",
        "JS",
        "LS",
        "MEDVL",
        "MUSIC",
        "PACS",
        "PHIL",
        "PSCI",
        "PSYCH",
        "RS",
        "SDS",
        "SMF",
        "SOC",
        "SOCWK",
        "SWK",
        "SWREN",
        "SPAN",
        "TS"
    ],
    [
        "BET",
        "PD",
        "SAF",
        "ARCH",
        "DAC",
        "ENBUS",
        "SFM",
    ],
]

export default function SearchPage(){
    gsap.registerPlugin(useGSAP)

    useGSAP(()=>{
        const tl = gsap.timeline({ease: 'power4.inOut'})

        tl.to('.search', {
            width: '70%',
            duration: 1.25
        })

        tl.to('.faculty', {
            opacity: "100%",
            duration: 0.5,
            // delay: 1.25
        })

        tl.to('.department', {
            opacity:"100%",
            duration: 0.5,
        })

        // useEffect(() => {
            
        // })

    })

    const [faculty, setFaculty] = useState(faculties[0])
    // TODO: Use another state variable to manage index vs. label
    const [dept, setDept] = useState("Department")

    return (
        <div className="w-full">
            <div className="w-full py-3 flex items-center justify-center">
                <div className="search w-4">
                    <Input placeholder="Search" leadingIcon={<Search className="h-4" />} />
                </div>
            </div>
            <div className="w-full flex items-center justify-center py-1 mx-10 gap-4">

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="faculty opacity-0">
                        <Button variant="outline">
                            {faculty.title}
                            <ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={faculties[faculty.index].title}>
                            {
                                faculties.map((facultyOption) => 
                                    <DropdownMenuRadioItem 
                                        key={facultyOption.index} 
                                        value={facultyOption.title} 
                                        onSelect={()=>{
                                            setFaculty(faculties[facultyOption.index])
                                        }}
                                    >
                                        {facultyOption.title}
                                    </DropdownMenuRadioItem>
                                )
                            }
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="department opacity-0">
                        <Button variant="outline">
                            {dept}
                            <ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={dept} onValueChange={setDept}>
                            {
                                departments[faculty.index].map((departmentOption) => 
                                    <DropdownMenuRadioItem key={departmentOption} value={departmentOption}>{departmentOption}</DropdownMenuRadioItem>
                                )
                            }
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}