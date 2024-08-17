import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdAlarm } from "react-icons/io";
import { setTaskDetails, toggleSidebar } from "../Redux/Slice/taskSlice";

const Taskcard = ({ ele }) => {
  const dispatch = useDispatch()
  
  // ---------------------getting User-----------------------
  const {allusers} = useSelector((state) => state.user);
  const {isOpen}= useSelector((state)=>state.task)
  

  // --------------------InitialsGenerator-----------------
  const assignedUser = allusers.filter((user) => user._id === ele.assignedTo);
  const userInitial = assignedUser[0].userName.slice(0, 1).toUpperCase();
  // console.log(userInitial);

  // --------------------Priority generator------------------------
  let priorityColor;
  switch (ele.priority) {
    case "High":
      priorityColor = "red";
      break;
    case "Medium":
      priorityColor = "yellow";
      break;
    case "Low":
      priorityColor = "lightGrey";
      break;
    default:
      priorityColor = "transparent";
      break;
  }
  // --------------------Deadline generator---------------------------
  const today = new Date().toDateString();
  const deadline = new Date(ele.deadline).toDateString();

  let deadlineColor;
  if (deadline === today) {
    deadlineColor = "yellow";
  } else if (deadline < today) {
    deadlineColor = "red";
  } else {
    deadlineColor = "green";
  }
// ------------------------------Handling sidebar----------------------
const handleSidebar = (item)=>{
  // console.log("item",item)
  dispatch(toggleSidebar(true))
  // console.log(isOpen)
  dispatch(setTaskDetails(ele))
 
  
}
  // -------------------------------jsx---------------------------------
  return (
    // send this onlick to redux and let the toggle bar get it from redux including the isOpen status
    <div className="taskCard" onClick={()=>handleSidebar(ele)}>
      <div className="topCard">
        <h5>{ele.taskName}</h5>
      </div>
      <div className="bottomCard">
      <div className={`${priorityColor} priority`}>
          <p>!</p>
        </div>
        <div className="deadlineContainer">
          <div className={`${deadlineColor} deadline`}>
            <IoMdAlarm />
          </div>
          <p>{deadline}</p>
        </div>
        <div className="profileLayout">
          <p className="initialIcon">{userInitial}</p>
        </div>
      </div>
    </div>
  );
};

export default Taskcard;
