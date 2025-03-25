import { Amplify } from "aws-amplify";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { remove, uploadData } from 'aws-amplify/storage';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import './App.css';

// import { uploadData } from 'aws-amplify/storage';
// import { FileUploader } from '@aws-amplify/ui-react-storage';
// import '@aws-amplify/ui-react/styles.css';

import outputs from '../amplify_outputs.json';

import { Button } from "@/components/ui/button"

import { z } from "zod";

function App() {
  const [user, setUser] = useState<{ username?: string; givenName?: string; loginId?: string } | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [sampleProductName, setSampleProductName] = useState('');
  const [sampleProductPrice, setSampleProductPrice] = useState('');
  const [editProductId, setEditProductId] = useState<string | null>(null); 
  const [formNameResult, setFormNameResult] = useState('');
  const [formPriceResult, setFormPriceResult] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [formFileResult, setFormFileResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskProductImage, setTaskProductImage] = useState('');

  const apiKey = "thisisasamplesecretkey27!"
  
  const ProductSchema = z.object({
    name: z.string()
    .min(3, {
      message: "Product name must be at least 3 characters.",
    })
    .regex(/[a-zA-Z]/, {
      message: "Product name must contain at least one letter.",
    })
    .refine((val) => {
      if (editProductId) return true; // ✅ Skip check if editing
      return !data.some(name => name.sample_product_name.toLowerCase() === val.toLowerCase());
    }, {
      message: "Product name already exists.",
    }),

    price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
      message: "Price must be a valid number.",
    }),

    ...(editProductId ? {} : { 
      file: z.instanceof(File, { message: "File is required." }) 
    })
  });

  const fetchData = () => { 
    axios.get("https://rnz7auon30.execute-api.ap-southeast-1.amazonaws.com/")
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) { 
          setData(response.data.data);
        } else {
          console.error("Invalid API response format:", response.data);
          setData([]); 
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData([]); 
      });
  };

  useEffect(() => {
    fetchData();
  }, []); 

  // useEffect(() => {
  //   console.log(data.some(name => name === "qweqeqweqwe"))
  // }, [data]); 

  const addProduct = async () => {
    setLoading(true);

    console.log(user?.username, sampleProductName, sampleProductPrice, file)

    await axios.post("https://rnz7auon30.execute-api.ap-southeast-1.amazonaws.com/insert", {
      userId: user?.username,
      sample_product_name: sampleProductName,
      sample_product_price: sampleProductPrice,
      product_image: file ? file.name : null // Include file name
    },
    {
      headers: {
        "x-api-key": apiKey
      }
    })
    .then((response) => {
      console.log(response.data);
      setSampleProductName('');
      setSampleProductPrice('');
      setFile(null); // Reset file after submission
      fetchData();

      Swal.fire({
        toast: true,
        icon: 'success',
        position: 'top-end',
        title: "A new product is added successfully.",
        timerProgressBar: true,
        timer: 3000,
        showCancelButton: false,
        showConfirmButton: false,
      });
    })
    .catch((error) => {
      Swal.fire({
        toast: true,
        icon: 'error',
        position: 'top-end',
        title: `Invalid Input, ${error.response.data.message}`,
        timerProgressBar: true,
        timer: 3500,
        showCancelButton: false,
        showConfirmButton: false,
      });
      console.error(error);
    }).finally(() => {
      setLoading(false);
    });
  };

  const updateProduct = async () => {
    setLoading(true);
    
    try {
      if (file) {
        alert(taskProductImage)

        // remove()
        if (taskProductImage) {
          try {
            await remove({ path: `photos/${taskProductImage}` });
            console.log("Old image removed successfully.");
          } catch (removeError) {
            console.error("Failed to remove old image:", removeError);
          }
        }
        // uploadData
        alert(file.name)
        await uploadData({
          path: `photos/${file.name}`,
          data: file,
          options: {
            contentType: file.type,
          },
        });
        console.log("New image uploaded successfully.");
      }
      // update the data
      await axios.put(
        `https://rnz7auon30.execute-api.ap-southeast-1.amazonaws.com/update/${editProductId}`,
        {
          sample_product_name: sampleProductName,
          sample_product_price: sampleProductPrice,
          product_image: file ? file.name : null, // Store new file name (or keep existing)
        },
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      // Reset form and refresh data
      setSampleProductName('');
      setSampleProductPrice('');
      setEditProductId(null);
      handleReset();
      fetchData();

      Swal.fire({
        toast: true,
        icon: 'success',
        position: 'top-end',
        title: "A product is updated successfully.",
        timerProgressBar: true,
        timer: 3000,
        showCancelButton: false,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        toast: true,
        icon: 'error',
        position: 'top-end',
        title: "Updating is Unsuccessful",
        timerProgressBar: true,
        timer: 3500,
        showCancelButton: false,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (task: any) => {
    setSampleProductName(task.sample_product_name);
    setSampleProductPrice(task.sample_product_price);
    setEditProductId(task.id)
    setTaskProductImage(task.product_image) // product_name to be updated

    setFormNameResult('');
    setFormPriceResult('');
    setFormFileResult('');
  };

  const handleSubmit = (e: React.FormEvent) => {
 
    e.preventDefault();

    const result = ProductSchema.safeParse({
      name: sampleProductName,
      price: sampleProductPrice,
      ...(editProductId ? {} : { file })
    });

    if (result.success) {
      
      // Call either add or update
      if (editProductId) {
        updateProduct();
      } else {
        addProduct();
      }

      setFormNameResult('');
      setFormPriceResult('');
      setFormFileResult('');

    } else {
      console.log('still error ?!?', editProductId)
      // Set form errors in state
      const formatted = result.error.format();

      const nameError = formatted.name?._errors[0] ?? '';
      const priceError = formatted.price?._errors[0] ?? '';  

      setFormNameResult(nameError);
      setFormPriceResult(priceError);

      if (!editProductId && formatted.file) {
        setFormFileResult(formatted.file._errors[0]);
      } else {
        setFormFileResult('');
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
      setFile(null);
      
      // Clear the file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
        fileInputRef.current.focus(); 
    }
  };

  const deleteProduct = async (itemID: number, task: any, index: number) => {
    Swal.fire({
      toast: true,
      icon: 'warning',
      position: 'top-end',
      title: `Are you sure you want to delete Product no.${index}?`,
      timerProgressBar: false,
      confirmButtonColor: '#b33f40',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result: { isConfirmed: any }) => {
    
      if (result.isConfirmed) {
        try {
          // Delete product from API
          await axios.delete(`https://rnz7auon30.execute-api.ap-southeast-1.amazonaws.com/delete/${itemID}`, {
            headers: {
              "x-api-key": apiKey
            }
          });

          console.log(`Product ${index} deleted from database.`);
          fetchData(); // Refresh product list

          // Remove image file from S3
          if (task.product_image) {
            const imagePath = `photos/${task.product_image}`;
            await remove({ path: imagePath });
            console.log(`Image ${task.product_image} deleted from S3.`);
          }

          Swal.fire({
            toast: true,
            icon: 'success',
            position: 'top-end',
            title: "Product deleted successfully.",
            timerProgressBar: true,
            timer: 3000,
            showCancelButton: false,
            showConfirmButton: false,
          });

        } catch (error) {
          Swal.fire({
            toast: true,
            icon: 'error',
            position: 'top-end',
            title: `Error deleting product: ${error}`,
            timerProgressBar: true,
            timer: 3500,
            showCancelButton: false,
            showConfirmButton: false,
          });
          console.error("Delete error:", error);
        }
      }
    });
  };

  // cognito auth

  useEffect(() => {
    // console.log(outputs)
    Amplify.configure(
      outputs
    //   {
    //   Auth: {
    //     Cognito: {
    //       userPoolClientId: "647p68o88lfdi0plo0thqngola",
    //       userPoolId: "ap-southeast-1_HOQQzITYh"
    //     },
    //   }
    // }
    );
  })

  // start of main

  useEffect(() => {
    async function checkUser() {
      try {
        const authUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        setUser({
          username: authUser.username,
          givenName: attributes.given_name ?? "User",
          loginId: authUser.signInDetails?.loginId ?? authUser.username,
        });

        console.log(authUser, 'checkUser')
      } catch (error) {
        setUser(null);
      } finally {
        setLoadingAccount(false);
      }
    }
    checkUser();
  }, []);

  async function handleSignOut() {
    await signOut();
    setUser(null);
  }

  if (loadingAccount) return <h1>Loading...</h1>;

  // end of main

  return (
    <div className="h-svh">
      <main className="pr-5 pt-5 w-full text-right">
        {user ? (
          <>
            <h2>Hello,<b>{user.givenName}!</b></h2>
            <h1>Welcome, {user.username}!</h1>
            <p>Login ID: {user.loginId}</p>
            <Button className="mt-2" onClick={handleSignOut}>Sign out</Button>
          </>
        ) : isRegistering ? (
          <SignUp setIsRegistering={setIsRegistering} />
        ) : (
          <SignIn setUser={setUser} setIsRegistering={setIsRegistering} />
        )}
      </main>
      <div className='flex flex-col lg:flex-row lg:gap-[50px] items-center xl:items-start justify-center mx-10'>
        <ProductForm 
          sampleProductName={sampleProductName}
          formNameResult={formNameResult}
          sampleProductPrice={sampleProductPrice} 
          formPriceResult={formPriceResult}
          setSampleProductName={setSampleProductName}
          setSampleProductPrice={setSampleProductPrice}
          handleSubmit={handleSubmit}
          editProductId={editProductId}
          loading={loading}
          file={file}
          formFileResult={formFileResult}
          setFile={setFile}
          fileInputRef={fileInputRef}
          handleReset={handleReset}
        />
        
        <ProductTable 
          userDetails={user}
          data={data}
          handleEdit={handleEdit}
          deleteProduct={deleteProduct}
        />
      </div>
    </div>
  );
}

export default App;