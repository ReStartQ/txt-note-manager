import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification(){
  const notify = () => {
    toast.success("Saving");
  }
  

  return (
    <div>
      <button onClick={notify}>Notify!</button>
      <ToastContainer autoClose={200} position='bottom-right' theme='dark'/>
    </div>
  );
}

export default Notification;