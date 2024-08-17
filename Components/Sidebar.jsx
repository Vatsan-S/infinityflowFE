import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTaskDetails, toggleSidebar } from "../Redux/Slice/taskSlice";
import TaskInfo from "./TaskInfo";
import SubtaskInfo from "./SubtaskInfo";
import { IoClose } from "react-icons/io5";

const Sidebar = () => {
    const dispatch = useDispatch()
  const { isOpen } = useSelector((state) => state.task);
  const{taskDetails} = useSelector((state)=> state.task)

  const handleClick = ()=>{
    dispatch(toggleSidebar(false))
    dispatch(setTaskDetails({}))
  }
 
  return (
  <div className={`sidebar ${isOpen ? "" : "close"}`}>
  <div className="sidebarTopSection">
  <p onClick={handleClick}><IoClose /></p>
  </div>
  
  {taskDetails.taskName?<><TaskInfo/></>:<><SubtaskInfo/></>}
  </div>)
};

export default Sidebar;
