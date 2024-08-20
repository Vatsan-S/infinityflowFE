import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Topheader from "../Components/Topheader";
import SearchBar from "../Components/SearchBar";
import ButtonWicon from "../Components/ButtonWicon";
import { jwtDecode } from "jwt-decode";
import { CiMenuKebab } from "react-icons/ci";
import BoxNavigator from "../Components/BoxNavigator";
import Pane from "../Components/Pane";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../Redux/Slice/userSlice";
import Sidebar from "../Components/Sidebar";
import { SphereSpinner } from "react-spinners-kit";
import {
  setBoxDetails,
  setForceRerender,
  setTaskDetails,
  toggleSidebar,
} from "../Redux/Slice/taskSlice";

const Boxdetails = () => {
  const [subtasks, setSubtasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [box, setBox] = useState({});
  const [searchList, setSearchList] = useState([]);
  const dispatch = useDispatch();
  const { forceRerender } = useSelector((state) => state.task);
  // ----------------------states for creating tasks--------------------------
  const [taskName, setTaskName] = useState("");
  const [taskObj, setTaskObj] = useState("");
  const [taskAssignedTo, settaskAssignedTo] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskPriIsOpen, setTaskPriIsOpen] = useState(false);
  const [createTaskIsOpen, setCreateTaskIsOpen] = useState(false);
  const priorityList = ["High", "Medium", "Low"];
  // ------------------for Loading------------------------------------------
  const [paneLoading, setpaneLoading] = useState(false)
  const [createTaskLoading, setCreateTaskLoading] = useState(false)
  // -----------------fetch box data----------------------------------------
  useEffect(() => {
    fetchData();
  }, [forceRerender]);

  const { id } = useParams();
  const token = localStorage.getItem("authToken");
  let userRole;
  let userID;
  if (token) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
    userID = decodedToken.id;
  }
  const fetchData = async () => {
    setpaneLoading(true)
    try {
      const payload = {
        boxID: id,
      };
      const boxData = await axios
        .post("https://infinityflowbe.onrender.com/api/box/getBox", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((boxData) => {
          // console.log(boxData.data.users)
          setpaneLoading(false)
          setTasks(boxData.data.tasks);
          setBox(boxData.data.box);
          dispatch(setBoxDetails(boxData.data.box))
          setSubtasks(boxData.data.subtasks);
          dispatch(setUsers(boxData.data.users));
        })
        .catch((err) => {
          setpaneLoading(false)
          console.log(err);
        });
    } catch (error) {
      setpaneLoading(false)
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
    dispatch(toggleSidebar(false));
    dispatch(setTaskDetails({}));
  }, []);
  // -------------------------------search logic-------------------------
  // let searchList =[];
  const searchFunction = (text) => {
    if (text === "") {
      return setSearchList([]);
    }
    const taskSearch = tasks.filter((ele) =>
      ele.searchTerm.toLowerCase().includes(text.toLowerCase())
    );
    const subtaskSearch = subtasks.filter((ele) =>
      ele.searchTerm.toLowerCase().includes(text.toLowerCase())
    );
    setSearchList([...taskSearch, ...subtaskSearch]);
  };

  //   -------------------------==Sorting Data-------------------------/

  let TL_Backlog = tasks.filter((ele) => ele.taskStatus === "Assigned");
  let TL_Inprogress = tasks.filter((ele) => {
    return (
      ele.taskStatus === "In Progress" ||
      (ele.taskStatus === "Completed" && ele.approvalStatus === "Rejected")
    );
  });
  let TL_Request = tasks.filter((ele) => ele.taskStatus === "Requested");
  let TL_Completed = tasks.filter((ele) => {
    return ele.taskStatus === "Completed" && ele.approvalStatus === "Pending";
  });

  let M_Backlog = subtasks.filter((ele) => ele.subtaskStatus === "Assigned");
  let M_Inprogress = subtasks.filter(
    (ele) => ele.subtaskStatus === "In Progress"
  );
  let M_Request = subtasks.filter((ele) => ele.subtaskStatus === "Requested");
  let M_Completed = subtasks.filter((ele) => ele.subtaskStatus === "Completed");

  let Approved = tasks.filter((ele) => ele.approvalStatus === "Approved");
  // ----------------------------handling task priority----------------------------
  const handleSelectTaskPriority = (item) => {
    setTaskPriority(item);
    setTaskPriIsOpen(!taskPriIsOpen);
  };
  const toggleCreatetask = () => {
    setCreateTaskIsOpen(!createTaskIsOpen);
    setTaskName("");
    setTaskObj("");
    setTaskDeadline("");
    setTaskPriority("");
  };
  // -----------------------------handling create Task------------------------------
  const handleCreatetaskSubmit = async (e) => {
    setCreateTaskLoading(true)
    e.preventDefault();
    const payload = {
      taskName: taskName,
      taskObjective: taskObj,
      assignedTo: box.boxOwner,
      deadline: taskDeadline,
      createdBy: userID,
      boxID: id,
      priority: taskPriority,
    };
    await axios
      .post("https://infinityflowbe.onrender.com/api/box/createTask", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
        setCreateTaskLoading(false)
        setCreateTaskIsOpen(!createTaskIsOpen);
        dispatch(setForceRerender());
        setTaskName("");
        setTaskObj("");
        setTaskDeadline("");
        setTaskPriority("");
      })
      .catch((err) => {
        console.log(err);
        setCreateTaskLoading(false)
      });
    // console.log(payload);
  };

  // ----------------------------------------------handle search item click----------------------------
  const handleSearchItemClick = (ele)=>{
    dispatch(toggleSidebar(true))
    dispatch(setTaskDetails(ele))
    setSearchList([])
  }
  // ================================================jsx=================================================
  return (
    
    <div className="boxDetailsContainer">
      {createTaskIsOpen && (
        <div className="createTaskModal">
          <form className="form" onSubmit={handleCreatetaskSubmit}>
            <label htmlFor="Title" className="statusTitle">
              Title
            </label>
            <input
              className="input"
              id="Title"
              type="text"
              value={taskName}
              required
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task Title"
            />

            <label htmlFor="Objective" className="statusTitle">
              Objective
            </label>
            <textarea
              id="Objective"
              placeholder="Task Objective"
              className="textarea"
              required
              value={taskObj}
              onChange={(e) => setTaskObj(e.target.value)}
            ></textarea>
            <label htmlFor="deadline" className="statusTitle">
              Deadline
            </label>
            <input
              id="deadline"
              className="input"
              type="date"
              required
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
            />
            <label htmlFor="Priority" className="statusTitle">
              Priority
            </label>
            <input
              type="text"
              className="input"
              readOnly
              required
              value={taskPriority}
              id="Priority"
              placeholder="Select Priority"
              onClick={() => setTaskPriIsOpen(!taskPriIsOpen)}
            />
            {taskPriIsOpen && (
              <ul className="statOptions">
                {priorityList.map((item, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => handleSelectTaskPriority(item)}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="actions">
              {createTaskLoading===false?<><button className=" submitButton createSubtask" type="submit">
                Create Task
              </button>
              <p className="cancelText" onClick={toggleCreatetask}>
                Cancel
              </p></>:<><button className=" submitButton createSubtask loadingWiText" type="submit" disabled={createTaskLoading}>
              <SphereSpinner size={15} color="#C2DEEB" loading={createTaskLoading} />Loading
              </button></>}
            </div>
          </form>
        </div>
      )}
      <Topheader />
      <div className="controlsBar">
        <div className="controlsBarLeft">
          <Link to='/box'>{userRole === ("Manager" || "Admin") && <BoxNavigator data={box} />}</Link>
        </div>
        <div className="controlsBarRight">
          <SearchBar searchFunction={searchFunction} />
          {searchList.length > 0 ? (
            <div className="searchResult">
              {searchList.map((ele, index) => {
                return <p onClick={()=>handleSearchItemClick(ele)} className="searchItem" key={index}>{ele.searchTerm.split(",")[0]}</p>;
              })}
            </div>
          ) : (
            <></>
          )}
          {userRole === ("Manager" || "Admin") && (
            <div onClick={toggleCreatetask}>
              <ButtonWicon />
            </div>
          )}
          <CiMenuKebab />
        </div>
      </div>
      <div className="taskOrgContainer">
        <Pane loading={paneLoading} title={"M-Backlog"} data={M_Backlog} type={"Subtask"} />
        <Pane loading={paneLoading} title={"M-In Progress"} data={M_Inprogress} type={"Subtask"} />
        <Pane loading={paneLoading} title={"M-Request"} data={M_Request} type={"Subtask"} />
        <Pane loading={paneLoading} title={"M-Completed"} data={M_Completed} type={"Subtask"} />
        <Pane loading={paneLoading} title={"TL-Backlog"} data={TL_Backlog} type={"Task"} />
        <Pane loading={paneLoading} title={"TL-In Progress"} data={TL_Inprogress} type={"Task"} />
        <Pane loading={paneLoading} title={"TL-Request"} data={TL_Request} type={"Task"} />
        <Pane loading={paneLoading} title={"TL-Completed"} data={TL_Completed} type={"Task"} />
        <Pane loading={paneLoading} title={"Approved"} data={Approved} type={"Task"} />
      </div>
      <div className="sideBarComponent">
        <Sidebar />
      </div>
    </div>
  );
};

export default Boxdetails;
