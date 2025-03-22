import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { uploadData } from 'aws-amplify/storage';
// import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { ChangeEvent, useState } from "react";

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
    // selectedImage: File | null;
    // setSelectedImage: any;
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
    // selectedImage,
    // setSelectedImage
}: ProductFormProps) => {

    // Handler for file input change
    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         setSelectedImage(e.target.files[0]);
    //     }
    // };

    // image upload
    const [file, setFile] = useState<File | undefined>();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setFile(event.target.files?.[0]);
    };
  
    const handleClick = () => {
        if (!file) {
            return;
        }
        uploadData({
            path: `picture-submissions/${file.name}`,
            data: file,
        });
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
                <Label className="text-sm font-bold">Upload Product Image</Label>
                {/* <FileUploader
                    acceptedFileTypes={['image/*']}
                    path="public/"
                    maxFileCount={1}
                    isResumable
                /> */}
                <input type="file" onChange={(e) => { handleChange(e); handleClick(); }} />
                {/* <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full shadow appearance-none border border-gray-400 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                /> */}
                {/* {selectedImage && <p className="text-sm text-gray-600 mt-1">Selected Image: {selectedImage.name}</p>} */}
                
                <Button className="w-[350px] my-2" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" />
                            Loading...
                        </>
                    ) : ( editProductId ? 'Update' : 'Add' + ' Product' )}
                </Button>
            </form>
        </div>
    );
};

export default ProductForm;
