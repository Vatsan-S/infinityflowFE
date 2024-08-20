import React from "react";
import { MdEdit } from "react-icons/md";
import { IoHandRightSharp } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setForceRerender, setTaskDetails } from "../Redux/Slice/taskSlice";
import Comment from "./Comment";
import { SphereSpinner } from "react-spinners-kit";

const SubtaskInfo = () => {
  const [requestDetails, setRequestDetails] = useState({});
  const [reqOptIsOpen, setReqOptIsOpen] = useState(false);
  const [taskStatusOptIsOpen, setTaskStatusOptIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentAppStatus, setCurrentAppStatus] = useState("");
  const [taskApprovalOptisOpen, setTaskApprovalOptisOpen] = useState(false);
  const [reqModalisOpen, setReqModalisOpen] = useState(false);
  const [reqErrorMsg, setReqErrorMsg] = useState("");
  const [reqContent, setReqContent] = useState("");
  const [currentReqStatus, setCurrentReqStatus] = useState("");
  const dispatch = useDispatch();

  // -------------------states to edit subtask---------------------
  const [editSbtaskLoading, setEditSbTaskLoading] = useState(false)
  const priorityList = ["High", "Medium", "Low"];
  const [sbtaskPriOpen, setSbtaskPriOpen]= useState(false)
  const [editSbTaskIsOpen, setEditSbTaskIsOpen] = useState(false);
  const [editedSbTaskName, setEditedSbTaskName] = useState("");
  const [editedSbObj, setEditedSbObj] = useState("");
  const [editedSbDeadline, setEditedSbDeadline] = useState("");
  const [editedSbPriority, setEditedPriority] = useState("");

  // -----------------get Data---------------------------------
  const { taskDetails } = useSelector((state) => state.task);
  useEffect(() => {
    setCurrentStatus(taskDetails.subtaskStatus);
  }, [taskDetails.subtaskStatus, taskDetails]);
  useEffect(() => {
    setCurrentAppStatus(taskDetails.subtaskApprovalStatus);
  }, [taskDetails.subtaskApprovalStatus, taskDetails]);
  //   ------------------------------get Request Details-----------------------------
  const fetchRequest = async () => {
    const payload = {
      id: taskDetails.request[0],
    };
    const req = await axios
      .post("https://infinityflowbe.onrender.com/api/box/getRequest", payload)
      .then((res) => {
        // console.log(res.data.request)
        setRequestDetails(res.data.request);
        if (res.data.request) {
          // console.log("Working")
          setCurrentReqStatus(res.data.request.reqResponse);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (taskDetails && Object.keys(taskDetails).length > 0) {
      fetchRequest();
    }
  }, [taskDetails]);
  //   ---------------getUser data-----------------------------
  const token = localStorage.getItem("authToken");
  let userRole;
  if (token) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
  }
  //   ---------------handleNavigation-----------------------------------
  const navItems = ["Task Info", "Task Updates"];
  const [activeIndex, setActiveIndex] = useState(0);

  const handlenavClick = (index) => {
    setActiveIndex(index);
  };
  //   ---------------------------Request handling---------------------------------
  const toggleReqOptions = () => {
    setReqOptIsOpen(!reqOptIsOpen);
  };
  const reqStatusItems = ["Pending", "Resolved", "Rejected"];
  //   ------------------------Status Change handling--------------------------------------
  const toggletaskStatusOpt = () => {
    setTaskStatusOptIsOpen(!taskStatusOptIsOpen);
  };
  const taskStatusItem = ["Assigned", "In Progress", "Requested", "Completed"];
  const handleReqChange = async (item) => {
    // console.log(item)
    setReqOptIsOpen(false);
    if (item !== "Pending") {
      const payload = {
        id: requestDetails._id,
        ID: taskDetails.subtaskID,
        status: item,
        boxID: taskDetails.boxID,
      };
      const editRequest = await axios
        .post("https://infinityflowbe.onrender.com/api/box/editRequest", payload)
        .then((res) => {
          setRequestDetails(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // --------------------------Priority and deadline handling-------------------------------
  let priorityColor;
  switch (taskDetails.subtaskPriority) {
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

  const deadline = new Date(taskDetails.subtaskDeadline).toDateString();
  //  -------------------------handle status Change-----------------------------
  const handletaskStatusChange = async (item) => {
    setCurrentStatus(item);
    const payload = {
      subtaskID: taskDetails.subtaskID,
      boxID: taskDetails.boxID,
      subtaskStatus: item,
    };
    const changeStatus = await axios
      .put("https://infinityflowbe.onrender.com/api/box/editSubtask", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
        dispatch(setForceRerender());
        setTaskStatusOptIsOpen(false);
      })
      .catch((err) => console.log(err));
  };
  // -------------------------handle approval change------------------------
  const toggleAppStatOpt = async () => {
    if (taskDetails.subtaskStatus !== "Completed") {
      return console.log("Subtask not completed Yet");
    }
    setTaskApprovalOptisOpen(!taskApprovalOptisOpen);
  };
  const approvalStatItems = ["Approved", "Rejected", "Pending"];

  const handleApprovalChange = async (item) => {
    const payload = {
      subtaskApprovalStatus: item,
      subtaskID: taskDetails.subtaskID,
      boxID: taskDetails.boxID,
    };
    const appStatusChange = await axios
      .put("https://infinityflowbe.onrender.com/api/box/editSubtask", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(setForceRerender());
        dispatch(setTaskDetails(res.data.taskDetails));
        setTaskApprovalOptisOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // ------------------------------------------handle request raising-------------------------------------

  const submitreq = async (e) => {
    e.preventDefault();
    const payload = {
      reqDescription: reqContent,
      reqResponse: "Pending",
      ID: taskDetails.subtaskID,
      boxID: taskDetails.boxID,
    };
    const createRequest = await axios
      .post("https://infinityflowbe.onrender.com/api/box/createRequest", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data.message)
        dispatch(setTaskDetails(res.data.taskDetails));
        setReqModalisOpen(!reqModalisOpen);
        setReqErrorMsg("");
        setReqContent("");
      })
      .catch((err) => {
        console.log(err);
        setReqErrorMsg(err.response.data.message);
      });
  };
  // ----------------------------------------------handle edit subtask----------------------------
  const handleEditSbTaskSubmit=async(e)=>{
e.preventDefault()
setEditSbTaskLoading(true)
const payload ={
  subtaskPriority:editedSbPriority,
  subtaskDeadline:editedSbDeadline,
  subtaskObjective:editedSbObj,
  subtaskTitle : editedSbTaskName,
  subtaskID: taskDetails.subtaskID,
  boxID: taskDetails.boxID,
  searchTerm : 'a',
  maintaskID: taskDetails.maintaskID
}

const updateSubtask = await axios.put('https://infinityflowbe.onrender.com/api/box/editSubtask',payload,{
  headers:{
    "Authorization": `Bearer ${token}`
  }
})
.then((res)=>{
  // console.log(res)
  dispatch(setTaskDetails(res.data.taskDetails))
  dispatch(setForceRerender());
  setEditSbTaskIsOpen(false)
  setEditSbTaskLoading(false)
})
.catch((err)=>{
  console.log(err)
  setEditSbTaskLoading(false)
})
  }
  const handleEditSbTaskOpen = () => {
    setEditedPriority(taskDetails.subtaskPriority);
    setEditedSbDeadline(taskDetails.subtaskDeadline);
    setEditedSbObj(taskDetails.subtaskObjective);
    setEditedSbTaskName(taskDetails.subtaskTitle);
  };
  //  ==============================jsx===========================================================
  return (
    <div>
      <div className="sidebarTitleSection">
        <h3 className="taskTitle">{taskDetails.subtaskTitle}</h3>
        <p className="taskID">{taskDetails.subtaskID}</p>
      </div>
      <div className="sidebarNavigationSection">
        <div className="sidebarDetailsNavigators">
          {navItems.map((ele, index) => {
            return (
              <p
                key={index}
                onClick={() => handlenavClick(index)}
                className={`sbContentNavi ${
                  activeIndex === index ? "navActive" : ""
                }`}
              >
                {ele}
              </p>
            );
          })}
        </div>
        <div className="iconSection">
          {userRole === "Member" && (
            <div
              className="sidebarRequest"
              onClick={() => {
                setReqModalisOpen(!reqModalisOpen);
                setReqErrorMsg("");
                setReqContent("");
              }}
            >
              <IoHandRightSharp />
            </div>
          )}
          {userRole === "Team Lead" && (
            <div
              className="sidebarEdit"
              onClick={() => {
                setEditSbTaskIsOpen(!editSbTaskIsOpen);
                handleEditSbTaskOpen();
              }}
            >
              <MdEdit />
            </div>
          )}
        </div>
      </div>
      <hr className="sbNavHr" />
      {/* -----------------------edit Subtask Form--------------------- */}
      {editSbTaskIsOpen === true && (
        <>
          <form className="form" onSubmit={handleEditSbTaskSubmit}>
            <label htmlFor="Title" className="statusTitle">
              Title
            </label>
            <input
              type="text"
              id="Title"
              className="input"
              value={editedSbTaskName}
              onChange={(e) => setEditedSbTaskName(e.target.value)}
            />
            <label htmlFor="Objective" className="statusTitle">Objective</label>
            <input type="text"
            id="Objective"
            className="textarea"
            value={editedSbObj}
            onChange={(e)=>setEditedSbObj(e.target.value)}
            />
            <label htmlFor="deadline" className="statusTitle">Deadline</label>
            <input type="date"
            id="deadline"
            className="input"
            required
            value={editedSbDeadline}
            onChange={(e)=>setEditedSbDeadline(e.target.value)}
            />
            <label htmlFor="priority" className="statusTitle">Priority</label>
            <input 
            type="text"
            className="input"
            value={editedSbPriority}
            readOnly
            onClick={()=>{
              setSbtaskPriOpen(!sbtaskPriOpen)
            }}
            />
            {sbtaskPriOpen&&(
                <ul className="statOptions">
                  {priorityList.map((ele,index)=>{
                    return (
                      <li key={index} onClick={()=>{
                        setEditedPriority(ele)
                        setSbtaskPriOpen(false)
                      }}>{ele}</li>
                    )
                  })}
                </ul>
              )
            }
            <div className="actions">
              {editSbtaskLoading===false?(
                <>
                <button className="submitButton createSubtask" type="submit">Edit Subtask</button>
                <p className="cancelText" onClick={()=>{
                  setEditSbTaskIsOpen(!editSbTaskIsOpen)
                }}>Cancel</p>
                </>
              ):(<>
              <button
                    className=" submitButton createSubtask loadingWiText"
                    type="submit"
                    disabled={editSbtaskLoading}
                  >
                    <SphereSpinner
                      size={15}
                      color="#C2DEEB"
                      loading={editSbtaskLoading}
                    />
                    Loading
                  </button>
              </>)}
            </div>
          </form>
        </>
      )}
      {/* -----------------------raising request------------------------ */}
      {reqModalisOpen === true && (
        <>
          {reqErrorMsg && <p className="statusTitle">{reqErrorMsg}</p>}

          <div className="reqModal">
            <form onSubmit={submitreq} className="form">
              <textarea
                className="textarea"
                name=""
                id=""
                value={reqContent}
                placeholder="Request Description"
                onChange={(e) => setReqContent(e.target.value)}
              ></textarea>
              <button className="submitButton" type="submit">
                Raise Request
              </button>
            </form>
          </div>
          <hr className="sbNavHr" />
        </>
      )}
      <div className={`${activeIndex != 0 ? "close" : ""}`}>
        {/* -----------------objective---------------- */}
        <div className="objective">
          <h5 className="objbTitle">Objectives & Key results</h5>
          <p className="objDescription">{taskDetails.subtaskObjective}</p>
        </div>
        <hr className="sbNavHr" />
        {/* -----------------requestDetails--------------- */}
        {requestDetails && (
          <div className="request">
            <h5 className="reqTitle">Request</h5>
            <p className="reqDescription">{requestDetails.reqDescription}</p>
            {userRole === "Team Lead" && (
              <>
                <input
                  type="text"
                  readOnly
                  className="statChanger"
                  defaultValue={currentReqStatus}
                  onClick={toggleReqOptions}
                />
                {reqOptIsOpen === true && (
                  <ul className="statOptions limitedWidth">
                    {reqStatusItems.map((item, index) => {
                      return (
                        <li key={index} onClick={() => handleReqChange(item)}>
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
            <hr className="sbNavHr" />
          </div>
        )}

        {/* -----------------priority and deadline-------------------- */}
        <div className="otherTaskInfo">
          <div className="taskPriority">
            <h6 className="priorityTitle">Priority</h6>
            <div className="priorityContent ">
              <div className={`${priorityColor} priority`}>
                <p>!</p>
              </div>
              <div className="bxContent">
                <p>{taskDetails.subtaskPriority}</p>
              </div>
            </div>
          </div>
          <div className="taskDeadline bxContent">
            <h6 className="deadlineTitle">Deadline</h6>
            <p>{deadline}</p>
          </div>
        </div>
        <hr className="sbNavHr" />
      </div>
      {/* ---------------------Task updates------------------------------- */}
      <div className={`${activeIndex != 1 ? "close" : ""}`}>
        <div className="statusUpdateLayout">
          {/* -------------------------task status and aprovalstatus------------------ */}
          <div className="taskStatus">
            {userRole === "Member" ? (
              <>
                <div className="statusContainer">
                  <div className="taskStatus">
                    <p className="statusTitle">Task Status</p>
                    <input
                      type="text"
                      className="statChanger"
                      readOnly
                      defaultValue={currentStatus}
                      onClick={toggletaskStatusOpt}
                    />
                    {taskStatusOptIsOpen === true && (
                      <ul className="statOptions">
                        {taskStatusItem.map((item, index) => {
                          return (
                            <li
                              key={index}
                              onClick={() => handletaskStatusChange(item)}
                            >
                              {item}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  <div className="aprovalStatus">
                    <p className="statusTitle">Approval Status</p>
                    <h5>{taskDetails.subtaskApprovalStatus}</h5>
                  </div>
                </div>
                <hr className="sbNavHr" />
              </>
            ) : // -------------------------user Team lead-----------------------
            userRole === "Team Lead" ? (
              <>
                <div className="statusContainer">
                  <div className="taskStatus">
                    <p className="statusTitle">Subtask Status</p>
                    <h5>{taskDetails.subtaskStatus}</h5>
                  </div>
                  <div className="aprovalStatus">
                    <p className="statusTitle">Approval Status</p>
                    <input
                      type="text"
                      readOnly
                      className="statChanger"
                      defaultValue={currentAppStatus}
                      onClick={toggleAppStatOpt}
                    />
                    {taskApprovalOptisOpen === true && (
                      <ul className="statOptions">
                        {approvalStatItems.map((item, index) => {
                          return (
                            <li
                              key={index}
                              onClick={() => handleApprovalChange(item)}
                            >
                              {item}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // --------------------Other users-----------------------
              <>
                <div className="statusContainer">
                  <div className="taskStatus">
                    <p className="statusTitle">Subtask Status</p>
                    <h5>{taskDetails.subtaskStatus}</h5>
                  </div>
                  <div className="aprovalStatus">
                    <p className="statusTitle">Approval Status</p>
                    <h5>{taskDetails.subtaskApprovalStatus}</h5>
                  </div>
                </div>
                <hr className="sbNavHr" />
              </>
            )}
          </div>
          <hr className="sbNavHr" />
        </div>
        <div className="commentSection">
          <h6 className="priorityTitle">Comments & Logs</h6>
          <Comment data={taskDetails} type={"Subtask"} />
        </div>
      </div>
    </div>
  );
};

export default SubtaskInfo;
