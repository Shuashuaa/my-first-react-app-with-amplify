import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface FilterInputProps {
    filterQuery: string;
    setFilterQuery: (query: string) => void;
}

const FilterInput: React.FC<FilterInputProps> = ({ filterQuery, setFilterQuery }) => {
    return (
        <>
            <Search className="absolute left-3 top-[50%] md:top-[45%] transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
                type="text"
                placeholder="search..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full md:w-[230px] pl-10 pr-3 py-2 border border-gray-400 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            { filterQuery ? 
                <>
                    <X onClick={() => {setFilterQuery('')}} 
                        className="absolute right-3 top-[50%] md:top-[45%] transform -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-500 cursor-pointer" 
                    />
                </>
                :
                <></>
            }
            
        </>  
    );
};

export default FilterInput;