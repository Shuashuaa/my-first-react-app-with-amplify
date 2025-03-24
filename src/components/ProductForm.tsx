import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { uploadData, getProperties, StorageError } from 'aws-amplify/storage';
import '@aws-amplify/ui-react/styles.css';
import { useRef } from "react";
import Swal from "sweetalert2";

interface ProductFormProps {
    sampleProductName: string;
    formNameResult: string;
    sampleProductPrice: string;
    formPriceResult: string;
    setSampleProductName: any;
    setSampleProductPrice: any;
    handleSubmit: any;
    editProductId: string | null;
    loading: boolean;
    file: File | null;
    setFile: any;
}

const ProductForm = ({
    sampleProductName,
    formNameResult,
    sampleProductPrice,
    formPriceResult,
    setSampleProductName,
    setSampleProductPrice,
    handleSubmit,
    editProductId,
    loading,
    file,
    setFile,
}: ProductFormProps) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] ?? null);
    };

    const handleClick = async (): Promise<boolean> => {
        
        if (!file || !sampleProductName || !sampleProductPrice) {
            console.error("Missing required fields.");
            return false;
        }
    
        const filePath = `photos/${file.name}`;
    
        try {
            await getProperties({ path: filePath });
            console.error("File already exists.");
            Swal.fire({
                toast: true,
                icon: 'error',
                position: 'top-end',
                title: "File already exists.",
                timerProgressBar: true,
                timer: 3000,
                showCancelButton: false,
                showConfirmButton: false,
            });
            return false;
        } catch (error) {
            if (error instanceof StorageError && error.name === "NotFound") {
                try {
                    await uploadData({
                        path: filePath,
                        data: file,
                        options: {
                            contentType: file.type,
                        },
                    });
                    console.log("File uploaded successfully.");
                    handleReset();
                    return true;

                } catch (uploadError) {
                    console.error("Upload failed:", uploadError);
                    return false;
                }
            } else {
                console.error("Error checking file existence:", error);
                return false;
            }
        }
    };

    const handleReset = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear file input field
        }
    };

    return (
        <div>
            <h1 className='text-2xl mb-2'>{editProductId ? 'Edit Product' : 'Add a New Product'}</h1>
            <form className='flex flex-col gap-1 text-left' onSubmit={handleSubmit}>
                <Label className="text-sm font-bold">Enter a Product Name</Label>
                <Input
                    value={sampleProductName} 
                    onChange={(e) => setSampleProductName(e.target.value)}
                    className="w-full shadow appearance-none border border-gray-400 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Name" 
                />
                {formNameResult && <p className="text-red-400 text-sm">{formNameResult}</p>}
                
                <Label className="text-sm font-bold">Enter a Product Price</Label>
                <Input 
                    value={sampleProductPrice}
                    onChange={(e) => setSampleProductPrice(e.target.value)}
                    className="w-full shadow appearance-none border border-gray-400 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    placeholder="Price" 
                />
                {formPriceResult && <p className="text-red-400 text-sm">{formPriceResult}</p>}

                {/* Image Upload Input */}
                <Label htmlFor="file_input" className="text-sm font-bold">Upload an Image</Label>
                <input id="file_input" type="file" ref={fileInputRef} onChange={handleChange} />

                <Button 
                    className="w-[350px] my-2" 
                    disabled={loading} 
                    onClick={async (e) => {
                        e.preventDefault();

                        // If editing an existing product, run handleClick for images
                        if (editProductId) {
                            handleSubmit(e);
                            return;
                        }

                        // If adding a new product (editProductId is null), restrict handleClick
                        const success = await handleClick();
                        if (success) {
                            handleSubmit(e);
                        }
                    }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" />
                            Loading...
                        </>
                    ) : (editProductId ? 'Update' : 'Add Product')}
                </Button>

                {file && (
                    <Button variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                )}
            </form>
        </div>
    );
};

export default ProductForm;
