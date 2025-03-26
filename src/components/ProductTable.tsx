// add everything on the table as searchable
// import { list } from 'aws-amplify/storage';

import { useState, useEffect } from "react";
import { useDebounce } from "./hooks";

import PaginationSection from "./PaginationSection";
import FilterInput from "./FilterInput";
import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Product {
    id: number;
    userId: string;
    sample_product_name: string;
    sample_product_price: string;
    product_image: string;
    created_at: string;
}
interface ProductTableProps {
    userDetails: { username?: string; givenName?: string; loginId?: string } | null;
    data: Product[];
    handleEdit: (task: Product) => void;
    deleteProduct: (id: number, task: any, index: number) => void;
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
                setItemsPerPage(6);
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
    .filter((task) => {
        return (
            task.sample_product_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            task.sample_product_price.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            task.userId.toString().includes(debouncedSearch)
        );
    })
    .filter(t => userDetails?.username ? t.userId === userDetails.username : true); // if the user exists

    const currentItems = filteredItems
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(firstItemIndex, lastItemIndex); // (0,5) | (5,10)
    
    // const [imageList, setImageList] = useState<any>([]);
    // const loadNextPage = async () => {
    //     const response = await list({
    //       path: 'photos/',
    //     });
    //     if (response) {
    //         console.log(response)
    //         setImageList((prevItems: any) => [
    //             ...prevItems,
    //             ...response.items,  
    //           ]);
    //     }
        // render list items from response.items
    // };

    return (
        <div className="list mb-10 xl:mt-0">

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

            <div className="w-full md:w-full mb-3">
                {/* <button onClick={loadNextPage}>hi!</button>
                {imageList.map((item: any) => (
                    <div key={item.eTag}> 
                        <img
                            src={`https://amplify-d2htcnpo66lqyx-ma-amplifyteamdrivebucket28-vu8nmztglqdy.s3.ap-southeast-2.amazonaws.com/${item.path}`}
                            alt={item.path}
                        />
                    </div>
                ))} */}
                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 min-h-[140px] 
                w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible"
                ></div> */}
                <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-2 gap-4 min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
                    {currentItems
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map((task, index) => (
                        <figure key={task.id || index} className="relative w-[300px] h-[300px] shadow-md rounded-xl group">
                            <img className="object-cover object-center w-full h-full rounded-xl"
                            src={`https://amplify-d2htcnpo66lqyx-ma-amplifyteamdrivebucket28-vu8nmztglqdy.s3.ap-southeast-2.amazonaws.com/photos/${task.product_image}`} 
                            alt={task.product_image}/> 

                            <div className="absolute top-5 right-5">
                                                                
                                {/* { itemsPerPage == 6 ?
                                <div className="flex flex-col">
                                    <Button 
                                     userDetails?.username ? false : true
                                        disabled={!userDetails?.username} 
                                        className="shadow border text-gray-700 bg-green-300 rounded-md hover:bg-green-400" 
                                        onClick={() => handleEdit(task)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        disabled={userDetails?.username ? false : true} 
                                        className="shadow border text-gray-700 bg-red-300 rounded-md hover:bg-red-400" 
                                        onClick={() => deleteProduct(task.id, task, firstItemIndex + index + 1)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                                : */}
                                <div className="flex justify-center">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button className="bg-gray-300 text-black rounded-3xl bg-white/50 backdrop-blur-sm">...</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p>{task.sample_product_name}</p>
                                            <div className="grid grid-cols-2">
                                                <Button 
                                                    disabled={userDetails?.username ? false : true}
                                                    className="shadow border text-gray-700 bg-green-300 rounded-md hover:bg-green-400" 
                                                    onClick={() => handleEdit(task)}>
                                                Edit
                                                </Button>
                                                <Button 
                                                    disabled={userDetails?.username ? false : true}
                                                    className="shadow border text-gray-700 bg-red-300 rounded-md hover:bg-red-400" 
                                                    onClick={() => deleteProduct(task.id, task, firstItemIndex + index + 1)}>
                                                Delete
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {/* } */}
                            </div>
                            <figcaption className="absolute bottom-8 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/70 py-2 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm 
                            transition-all duration-500 delay-300 opacity-100 
                            group-hover:opacity-0 group-hover:pointer-events-none 
                            hover:opacity-100 hover:pointer-events-auto"
                            >
                                <div>
                                    <h5 className="text-medium font-semibold text-slate-800">
                                        {task.sample_product_name}
                                    </h5>
                                    <div className="flex justify-between">
                                        <p className="text-slate-600">
                                            ₱{parseFloat(task.sample_product_price).toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">
                                        added by: {`${task.userId.slice(0, 4)}...`}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {new Date(task.created_at).toISOString().split("T")[0]}
                                    </p>
                                </div>
                                {/* <p className="text-[11px] font-medium text-slate-800">
                                    {new Date(task.created_at).toISOString().split("T")[0]}
                                </p> */}
                            </figcaption>
                        </figure>
                    ))}
                </div>
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