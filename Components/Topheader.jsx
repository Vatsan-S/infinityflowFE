import React from "react";
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
const Topheader = () => {
    // -------------------------------handling dropdown---------------------------
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const dropdownList = ["Log Out"];
  const handleProfileClick = () => {
    setDropdownIsOpen(!dropdownIsOpen);
  };
//   --------------------------------handling options click--------------------------
const navigate = useNavigate()
const handleOptionsClick = (item)=>{
    console.log(item)
    if(item==="Log Out"){
        console.log("Working")
        localStorage.removeItem('authTokem')
        navigate('/')
    }
}
  return (
    <div className="topHeader">
      <div className="logo"><img src="https://res.cloudinary.com/ddycjnke1/image/upload/fl_preserve_transparency/v1723705278/Frame_134_rglxh8.jpg?_s=public-apps" alt="" /></div>
      <div className="profileLayout" onClick={() => handleProfileClick()}>
        <p className="profileIcon">V</p>
        <ul className="statOptions profileOptions">
          {dropdownIsOpen && (dropdownList.map((item, index) => {
            return (
              <li
                onClick={() => {
                  handleOptionsClick(item);
                }}
                key={index}
              >
                {item}
              </li>
            );
          }))}
        </ul>
      </div>
    </div>
  );
};

export default Topheader;
