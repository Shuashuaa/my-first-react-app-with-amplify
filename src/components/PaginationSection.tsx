import { useEffect, useState } from 'react';
import { 
    Pagination, 
    PaginationContent, 
    PaginationEllipsis,
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious 
} from "@/components/ui/pagination";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const PaginationSection: React.FC<PaginationProps> = ({ 
    totalItems, 
    itemsPerPage, 
    currentPage, 
    setCurrentPage 
}) => {
  
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    let pages: number[] = [];

    for (let i = 0; i < totalPages; i++) {
        pages.push(i + 1);
    }

    const handleNextPage = () => {
        if (currentPage < pages.length) {
        setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        }
    };

    // Ellipses
    const visiblePages = 3;
    let pageStart = Math.max(0, currentPage - Math.floor(visiblePages / 2) - 1); // to show the lower page
    let pageEnd = Math.min(totalPages, pageStart + visiblePages);
    
    if (pageEnd - pageStart < visiblePages) {
        pageStart = Math.max(0, pageEnd - visiblePages);
    }

    const displayedPages = pages.slice(pageStart, pageEnd);

    const [resp, setResp] = useState('pc');
    const [buttonSize, setButtonSize] = useState('p-5');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setResp('pc');
                setButtonSize('p-5')
            } else {
                setResp('mobile');
                setButtonSize('p-6')
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        // Cleanup the event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Pagination>
            <PaginationContent>
                { resp == "pc" && (
                    <PaginationItem className={currentPage != 1 ? 'cursor-pointer' : 'cursor-default'}>
                        <PaginationPrevious onClick={handlePrevPage} className={currentPage === 1 ? "bg-neutral-200 rounded-md" : ""} />
                    </PaginationItem>
                )}

                {/* pages are far from the start */}
                {pageStart > 0 && (
                    <>
                        <PaginationItem className={currentPage != 1 ? 'cursor-pointer' : 'cursor-default'}>
                            <PaginationLink className={buttonSize} onClick={() => setCurrentPage(1)}>1</PaginationLink>
                        </PaginationItem>
                        {pageStart > 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                    </>
                )}

                {displayedPages.map((page) => (
                    <PaginationItem key={page} className={currentPage === page ? "rounded-md cursor-default" : "cursor-pointer"}>
                        {
                            currentPage === page ? 
                            <>
                                <PaginationLink className={buttonSize} isActive onClick={() => setCurrentPage(page)}>{page}</PaginationLink>
                            </>
                            :
                            <>
                                <PaginationLink className={buttonSize} onClick={() => setCurrentPage(page)}>{page}</PaginationLink>
                            </>
                        }
                    </PaginationItem>
                ))}

                {/* pages are far from the end */}
                {pageEnd < totalPages && (
                    <>
                        {pageEnd < totalPages && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                        <PaginationItem className={currentPage != totalPages ? 'cursor-pointer' : 'cursor-default'}>
                            <PaginationLink className={buttonSize} onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                        </PaginationItem>
                    </>
                )}

                {resp == "pc" && (
                <PaginationItem className={currentPage !== totalPages ? 'cursor-pointer' : 'cursor-default'}>
                    <PaginationNext onClick={handleNextPage} className={currentPage === totalPages ? "bg-neutral-200 rounded-md" : ""} />
                </PaginationItem>
                )}
                
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationSection;