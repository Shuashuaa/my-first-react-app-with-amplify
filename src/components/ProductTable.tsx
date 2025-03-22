// add everything on the table as searchable

import { useState, useEffect } from "react";
import { useDebounce } from "./hooks";

import PaginationSection from "./PaginationSection";
import FilterInput from "./FilterInput";
import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
interface Product {
    id: number;
    userId: string;
    sample_product_name: string;
    sample_product_price: string;
    created_at: string;
}
interface ProductTableProps {
    userDetails: { username?: string; givenName?: string; loginId?: string } | null;
    data: Product[];
    handleEdit: (task: Product) => void;
    deleteProduct: (id: number, index: number) => void;
}

const ProductTable = ({ userDetails, data, handleEdit, deleteProduct 
}: ProductTableProps) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [filterQuery, setFilterQuery] = useState("");
    const debouncedSearch = useDebounce(filterQuery);

    // mobile responsive
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(5);
            } else {
                setItemsPerPage(4);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        // Cleanup the event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // if filterQuery Changes value the pagination page will go back to 1
    useEffect(() => {
        setCurrentPage(1)
    },[filterQuery, userDetails?.username])
    
    const lastItemIndex = currentPage * itemsPerPage; // 1 * 5 = 5 | 2 * 5 = 10
    const firstItemIndex = lastItemIndex - itemsPerPage; // 5 - 5 = 0 | 10 - 5 = 5

    // Filter the data based on the filter query
    const filteredItems = data
    .filter((task) => task.sample_product_name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    .filter(t => userDetails?.username ? t.userId === userDetails.username : true);

    const currentItems = filteredItems
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(firstItemIndex, lastItemIndex); // (0,5) | (5,10)

    return (
        <div className="list mt-5">

            {/* Filter Input */}
            <div className="md:flex justify-between mb-4">
                <h1 className="text-2xl mb-2">List of Products</h1>
                <div className="relative w-full md:w-[230px]">
                    <FilterInput 
                        filterQuery={filterQuery} 
                        setFilterQuery={setFilterQuery} 
                    />
                </div>
            </div>

        <div className="w-full md:w-[500px] mb-3">
            <table className="w-[350px] md:w-[500px] shadow">
                <thead className="bg-white border border-gray-600 z-10">
                    <tr className="*:px-1 text-gray-600 *:md:text-sm *:text-[12px]">
                        <th className="border border-gray-300">No</th>
                        <th className="w-[120px] border border-gray-300">Product Name</th>
                        <th className="border border-gray-300">Product Price</th>
                        <th className="border border-gray-300">Created Date</th>
                        <th className="border border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map((task, index) => (
                        <tr key={task.id} className="border border-gray-300 *:p-1 hover:bg-gray-100 *:text-sm">
                            <td className="border border-gray-300 p-2 text-center">{firstItemIndex + index + 1}</td>
                            <td className="border border-gray-300 p-2">{task.sample_product_name}</td>
                            <td className="border border-gray-300 p-2 text-center">
                                ₱{parseFloat(task.sample_product_price).toLocaleString()}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">{new Date(task.created_at).toISOString().split("T")[0]}</td>
                            <td className="grid gap-2">
                                
                                { itemsPerPage == 5 ?
                                <div className="grid sm:grid-cols-2">
                                    <Button disabled={userDetails?.username ? false : true} className="shadow border text-gray-700 bg-green-300 rounded-md hover:bg-green-400" onClick={() => handleEdit(task)}>
                                        Edit
                                    </Button>
                                    <Button disabled={userDetails?.username ? false : true} className="shadow border text-gray-700 bg-red-300 rounded-md hover:bg-red-400" onClick={() => deleteProduct(task.id, firstItemIndex + index + 1)}>
                                        Delete
                                    </Button>
                                </div>
                                :
                                <>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button className="bg-gray-300 text-black">...</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p>{task.sample_product_name}</p>
                                            <div className="grid grid-cols-2">
                                                <Button className="shadow border text-gray-700 bg-green-300 rounded-md hover:bg-green-400" onClick={() => handleEdit(task)}>
                                                Edit
                                                </Button>
                                                <Button className="shadow border text-gray-700 bg-red-300 rounded-md hover:bg-red-400" onClick={() => deleteProduct(task.id, firstItemIndex + index + 1)}>
                                                Delete
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <PaginationSection 
            totalItems={filteredItems.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
        />
        </div>
    );
};

export default ProductTable;