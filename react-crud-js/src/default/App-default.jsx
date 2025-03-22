import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [sample_product_name, setSampleProductName] = useState('');
  const [sample_product_price, setSampleProductPrice] = useState('');
  const [editProductId, setEditProductId] = useState(null); // Track which product is being edited

  useEffect(() => {
    fetchData();
  }, []);

  // const handleEdit = (product) => {
  //   setSampleProductName(product.sample_product_name);
  //   setSampleProductPrice(product.sample_product_price);
  //   setEditProductId(product.id);
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (editProductId) {
  //     updateProduct(); // If editing, update the product
  //   } else {
  //     addProduct(); // If not editing, add a new product
  //   }
  // };

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

  const addProduct = async () => {
    await axios.post("https://rnz7auon30.execute-api.ap-southeast-1.amazonaws.com/insert", {
      sample_product_name: sample_product_name,
      sample_product_price: sample_product_price
    })
    .then((response) => {
      console.log(response.data);
      setSampleProductName('');
      setSampleProductPrice('');
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
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'okay, re-login',
        cancelButtonText: 'Later'
      })
    })
    .catch((error) => {
      Swal.fire({
        toast: true,
        icon: 'error',
        position: 'top-end',
        title: "Invalid Input",
        timerProgressBar: true,
        timer: 3500,
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'okay, re-login',
        cancelButtonText: 'Later'
      })
      console.error(error)
    });
  };

  const updateProduct = async () => {
    await axios.put(`https://rnz7auon30.execute-api.ap-southeast-1.amazonaws.com/update/${editProductId}`, {
      sample_product_name: sample_product_name,
      sample_product_price: sample_product_price
    })
    .then((response) => {
      console.log(response.data);
      setSampleProductName('');
      setSampleProductPrice('');
      setEditProductId(null);
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
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'okay, re-login',
        cancelButtonText: 'Later'
      })
    })
    .catch((error) => {
      Swal.fire({
        toast: true,
        icon: 'error',
        position: 'top-end',
        title: "Invalid Input",
        timerProgressBar: true,
        timer: 3500,
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'okay, re-login',
        cancelButtonText: 'Later'
      })
      console.error(error)
    });
  };
 
  const handleEdit = (task) => {
    setSampleProductName(task.sample_product_name);
    setSampleProductPrice(task.sample_product_price);
    setEditProductId(task.id)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(editProductId){
      updateProduct();
    }else{
      addProduct();
    }
  }

  const deleteProduct = async (itemID) => {
    Swal.fire({
      toast: true,
      icon: 'success',
      position: 'top-end',
      title: "Are you sure to delete this Product?",
      timerProgressBar: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#b33f40',
      confirmButtonText: 'delete',
      cancelButtonText: 'cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`https://rnz7auon30.execute-api.ap-southeast-1.amazonaws.com/delete/${itemID}`)
        .then((response) => {
          console.log(response.data);
          fetchData();

          Swal.fire({
            toast: true,
            icon: 'success',
            position: 'top-end',
            title: "A product is deleted successfully.",
            timerProgressBar: true,
            timer: 3000,
            showCancelButton: false,
            showConfirmButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'okay, re-login',
            cancelButtonText: 'Later'
          })
        })
        .catch((error) => {
          Swal.fire({
            toast: true,
            icon: 'error',
            position: 'top-end',
            title: `Can't Delete ${error}`,
            timerProgressBar: true,
            timer: 3500,
            showCancelButton: false,
            showConfirmButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'okay, re-login',
            cancelButtonText: 'Later'
          })
          console.error(error)
        });
      }
    });
  }


  return (
    <div className='flex flex-col items-center justify-center'>
      {/* FORM */}
      <div>
        <h1 className='text-2xl mb-2'>{editProductId ? 'Edit Product' : 'Add a New Product'}</h1>
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <label>Enter a Product Name</label>
          <input
            value={sample_product_name} 
            onChange={(e) => setSampleProductName(e.target.value)}
            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Name" />
          
          <label>Enter a Product Price</label>
          <input 
            value={sample_product_price}
            onChange={(e) => setSampleProductPrice(e.target.value)}
            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Price" />
          
          <button className='border border-gray-600 rounded-lg my-2'>
            {editProductId ? 'Update' : 'Add'} Product
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className='list mt-5'>
        <h1 className='text-2xl mb-2'>List of Products</h1>
        <table className='shadow-lg'>
          <thead>
            <tr className='*:border *:border-gray-400 *:p-2'>
              <th>Id</th>
              <th>Product Name</th> 
              <th>Product Price</th> 
              <th>Created Date</th> 
              <th>Actions</th> 
            </tr>
          </thead>
          <tbody>
            {data.map((task, index) => (
              <tr key={index} className='border border-gray-400 *:p-2'>
                <td className='border border-gray-400 p-2'>{task.id}</td>
                <td className='border border-gray-400 p-2'>{task.sample_product_name}</td>
                <td className='border border-gray-400 p-2'>{task.sample_product_price}</td>
                <td className='border border-gray-400 p-2'>{new Date(task.created_at).toISOString().split('T')[0]}</td>
                <td className='grid sm:grid-cols-2 gap-2 border'>
                  <button className='shadow border p-2 bg-green-300 rounded-md' onClick={() => handleEdit(task)}>Edit</button>
                  <button className='shadow border p-2 bg-red-300 rounded-md' onClick={() => deleteProduct(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
