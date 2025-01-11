"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { cn } from "@/lib/utils"; // ShadCN utility for conditional classes

export default function SearchField() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataList, setDataList] = useState<string[]>([]); // Store data from API
  const [filteredResults, setFilteredResults] = useState<string[]>([]);

  // Fetch data from API when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/search"); // Replace with your API endpoint
        const { data } = await response.json();
        setDataList(data); // Assume API returns { data: [...] }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Handle input changes and filter the results
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      const matches = dataList.filter((item) =>
        item.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredResults(matches);
    } else {
      setFilteredResults([]);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-10">
      {/* ShadCN Input */}
      <Input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
        className="w-full"
      />

      {/* Dropdown */}
      {filteredResults.length > 0 && (
        <div className="absolute left-0 w-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md">
          <ul className="max-h-40 overflow-y-auto">
            {filteredResults.map((item, index) => (
              <li
                key={index}
                className={cn(
                  "p-2 cursor-pointer text-sm",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => {
                  setSearchTerm(item); // Fill input with selected result
                  setFilteredResults([]); // Clear dropdown
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


