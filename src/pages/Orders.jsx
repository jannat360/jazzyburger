import React, { useContext, useEffect } from "react";
import CartContext from "../context/CartContext";
import AuthContext from "../context/AuthContext";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Orders = () => {
  const { cart, totalPrice } = useContext(CartContext);
  const {loggedIn} = useContext(AuthContext)
  const recipient = JSON.parse(localStorage.getItem("recipient"));
  const address = JSON.parse(localStorage.getItem("address"));
  const token = localStorage.getItem('token')

  const navigate = useNavigate()


  const orderFtn = {
    orderItems:cart,
    recipient,
    address,
    payment:"transfer",
    totalprice:totalPrice
  }
  const order = async()=>{
    const fetcher = await fetch('http://localhost:5757/api/user/isloggedin',{
        method:"POST",
        headers:{
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,

          },
          body: JSON.stringify(orderFtn),
    });
    const res = await fetcher.json();
    console.log(res);
    if(res.success === true){
        toast.success(res.message)
        navigate('/')
        return
        
        
    }
    if(res.success === false){
        toast.error(res.message)
        
        
    }
  }
  useEffect(()=>{
    if(!loggedIn){
      toast.error('unauthorized,please login/signup')
        navigate('/Signin')
        
    }
  },[])
  return (
    <>
      <main className="container my-5 border">
        <h2>Order page</h2>
        {cart.length < 1 ? <> <h2>no order </h2> </> :  <> {cart.map((cartItx) => {
          const { _id, image, title, description, price, quantity, category } =
            cartItx;
          return (
            <div key={_id}>
              <h2> {title} </h2>
              <img src={image} alt="" />
              <p> {description} </p>
              <p> {price} </p>
              <p> {quantity} </p>
              <p> {category} </p>
            </div>
          );
        })}
        <h2> {totalPrice} </h2>  </>}
       
        <hr />
        {/* recipient */}
        <h2> Recipient details </h2>
        <p>email: {recipient.email}</p>
        <p>firstname: {recipient.firstname} </p>
        <p>lastname: {recipient.lastname}</p>
        <p>phonenumber: {recipient.phonenumber}</p>
        <hr />
        {/* address */}
        <h2> Recipient address </h2>
        <p>city: {address.city}</p>
        <p>street: {address.street} </p>
        <p>housenumber: {address.housenumber}</p>
        {/* <p>phonenumber: {recipient.phonenumber}</p> */}
     <Link to='/'>   <button className="btn btn-success w-100" onClick={order}>
            place order
        </button></Link>
      </main>
    </>
  );
};

export default Orders;