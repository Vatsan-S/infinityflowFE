
import React from "react";
import { IoMdAlarm } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setTaskDetails, toggleSidebar } from "../Redux/Slice/taskSlice";

const SubtaskCard = ({ ele }) => {
    const dispatch = useDispatch()
    // ---------------------getting user-----------------------------
  const {allusers} = useSelector((state) => state.user);

  //   ----------------------User initial Generator-------------------
  const assignedUser = allusers.filter(
    (user) => user._id === ele.subtaskAssignedTo
  );
  const userInitial = assignedUser[0].userName.slice(0, 1).toUpperCase();
  // console.log(userInitial);
  //   -----------------------Priority Generator-----------------------
  let priorityColor;
  switch (ele.subtaskPriority) {
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
  //   ---------------------deadline date generator--------------------
  const today = new Date().toDateString();
  const deadline = new Date(ele.subtaskDeadline).toDateString();

  let deadlineColor;
  if (deadline === today) {
    deadlineColor = "yellow";
  } else if (deadline < today) {
    deadlineColor = "red";
  } else {
    deadlineColor = "green";
  }
// -----------------------------handling Click-------------------
const handleClick = (ele)=>{
dispatch(toggleSidebar(true))
dispatch(setTaskDetails(ele))
}
//   ---------------------------jsx------------------------------
  return (
    <div className="subtaskCard" onClick={()=>handleClick(ele)}>
      <div className="topCard">
        <h5>{ele.subtaskTitle}</h5>
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

export default SubtaskCard;
