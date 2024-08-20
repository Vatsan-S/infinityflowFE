import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { IoHandRightSharp } from "react-icons/io5";
import { setForceRerender, setTaskDetails } from "../Redux/Slice/taskSlice";
import { SphereSpinner } from "react-spinners-kit";
import Comment from "./Comment";

const TaskInfo = () => {
  const [requestDetails, setRequestDetails] = useState({});
  const [reqOptIsOpen, setReqOptIsOpen] = useState(false);
  const [taskStatusOptIsOpen, setTaskStatusOptIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentAppStatus, setCurrentAppStatus] = useState("");
  const [taskApprovalOptisOpen, setTaskApprovalOptisOpen] = useState(false);
  const [reqModalisOpen, setReqModalisOpen] = useState(false);
  const [reqContent, setReqContent] = useState("");
  const [reqErrorMsg, setReqErrorMsg] = useState("");
  const [currentReqStatus, setCurrentReqStatus] = useState("");
  const [createSubtaskIsOpen, setCreateSubtaskIsOpen] = useState(false);
  const [editTaskIsOpen, setEditTaskIsOpen] = useState(false);
  const [taskPrioOpen, setTaskPriOpen] = useState(false);
  const [editPriority, setEditPriority] = useState(false);
  const [subtaskList, setSubtaskList] = useState([]);
  const dispatch = useDispatch();
  // ---------------------------loading states----------------------------------
  const [statusLoading, setStatusLoading] = useState(false);
  const [raiseReqLoading, setRaiseReqLoading] = useState(false);
  const [createSubtaskLoading, setCreateSubtaskLoading] = useState(false);
  const [editTaskLoading, setEditTaskLoading] = useState(false);

  // ----------------------------useState for create subtask----------------------------
  const { allusers } = useSelector((state) => state.user);
  const { boxDetails } = useSelector((state) => state.task);
  // console.log(boxDetails.teamMembers);
  const priorityList = ["High", "Medium", "Low"];

  const members = allusers.filter((ele) =>
    boxDetails.teamMembers.includes(ele._id)
  );
  // console.log(members);  
  const [sbTitle, setSbTitle] = useState("");
  const [sbObjective, setSbObjective] = useState("");
  const [sbAssignedTo, setSbAssignedTo] = useState("");
  const [assignedID, setAssignedID] = useState("");
  const [sbDeadline, setSbDeadline] = useState("");
  const [sbCreatedBy, setSbCreatedBy] = useState("");
  const [sbBoxID, setSbBoxID] = useState("");
  const [sbPriority, setSbPriority] = useState("");
  const [maintaskID, setMaintaskID] = useState("");
  const [assignedToIsOpen, setAssignedToIsOpen] = useState(false);
  const [priorityIsOpen, setPriorityIsOpen] = useState(false);
  // -----------------------------states to edit task--------------------------------
  const [editedTaskname, setEditedTaskname] = useState("");
  const [editedObjective, setEditedObjective] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");
  const [editedPriority, setEditedPriority] = useState("");
  //   ----------------------------get user Data-------------------------------------
  const token = localStorage.getItem("authToken");
  let userRole;
  let userID;
  if (token) {
    const decodedToken = jwtDecode(token);
    // console.log("decoded", decodedToken)
    userRole = decodedToken.role;
    userID = decodedToken.id;
  }

  // ----------------------------get task Data------------------------------------------
  const { taskDetails } = useSelector((state) => state.task);
  useEffect(() => {
    setCurrentStatus(taskDetails.taskStatus);
    setEditPriority(taskDetails.priority);
  }, [taskDetails.taskStatus, taskDetails]);

  useEffect(() => {
    setCurrentAppStatus(taskDetails.approvalStatus);
  }, [taskDetails.approvalStatus, taskDetails]);

  // --------------------------------assignedUser---------------------------
  const assignedUser = allusers.filter(
    (user) => user._id === taskDetails.assignedTo
  );
  // console.log("Taskdetails", taskDetails)
  // console.log("assigned",assignedUser)
  const userInitial = assignedUser[0].userName.slice(0, 1).toUpperCase();

  // -----------------------------get subtask details--------------------------------
  const fetchSubtasks = async () => {
    const payload = {
      taskID: taskDetails.taskID,
    };
    await axios
      .post("https://infinityflowbe.onrender.com/api/box/getSubtasks", payload)
      .then((res) => {
        // console.log("subtasks",res.data.subtaskData)
        setSubtaskList(res.data.subtaskData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchSubtasks();
  }, [taskDetails]);
  //   ------------------------------get Request Details-----------------------------
  const fetchRequest = async () => {
    const payload = {
      id: taskDetails.request[0],
    };
    const req = await axios
      .post("https://infinityflowbe.onrender.com/api/box/getRequest", payload)
      .then((res) => {
        setRequestDetails(res.data.request);
        if (res.data.request) {
          setCurrentReqStatus(res.data.request.reqResponse);
        }
      })
      .catch((Err) => console.log(Err));
  };
  useEffect(() => {
    fetchRequest();
    fetchSubtasks();
  }, [taskDetails]);

  //   ----------------------------handle navigation--------------------------------
  const navItems = ["Task Info", "Task Updates", "Subtask"];
  const [activeIndex, setActiveIndex] = useState(0);

  const handlenavClick = (index) => {
    setActiveIndex(index);
  };
  //   ---------------------------Request handling---------------------------------
  const toggleReqOptions = () => {
    setReqOptIsOpen(!reqOptIsOpen);
  };
  const reqStatusItems = ["Pending", "Resolved", "Rejected"];

  const handleReqChange = async (item) => {
    // console.log(item);
    setCurrentReqStatus(item);
    setReqOptIsOpen(false);
    if (item !== "Pending") {
      const payload = {
        id: requestDetails._id,
        ID: taskDetails.taskID,
        status: item,
        boxID: taskDetails.boxID,
      };
      const editRequest = await axios
        .post("https://infinityflowbe.onrender.com/api/box/editRequest", payload)
        .then((res) => {
          setRequestDetails({});
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // --------------------------Priority and deadline handling-------------------------------
  let priorityColor;
  switch (taskDetails.priority) {
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

  const deadline = new Date(taskDetails.deadline).toDateString();

  //   ------------------------Status Change handling--------------------------------------
  const toggletaskStatusOpt = () => {
    setTaskStatusOptIsOpen(!taskStatusOptIsOpen);
  };
  const taskStatusItem = ["Assigned", "In Progress", "Requested", "Completed"];
  const handletaskStatusChange = async (item) => {
    setStatusLoading(true);
    const payload = {
      taskStatus: item,
      taskID: taskDetails.taskID,
      boxID: taskDetails.boxID,
    };

    const updateTaskStatus = await axios
      .put("https://infinityflowbe.onrender.com/api/box/editTask", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStatusLoading(false);
        dispatch(setForceRerender());
        dispatch(setTaskDetails(res.data.taskDetails));
        setTaskStatusOptIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setStatusErrMsg("Status Change Error")
        setStatusLoading(false);
      });
  };
  // ---------------------Manager role approval stat handling----------------------
  const toggleAppStatOpt = () => {
    setTaskApprovalOptisOpen(!taskApprovalOptisOpen);
  };
  const approvalStatItems = ["Approved", "Rejected", "Pending"];

  const handleApprovalChange = async (item) => {
    // console.log(currentStatus);
    if (currentStatus !== "Completed") {
      return console.log("Task isnt completed Yet");
    }
    const payload = {
      approvalStatus: item,
      taskID: taskDetails.taskID,
      boxID: taskDetails.boxID,
    };
    const appStatusChange = await axios
      .put("https://infinityflowbe.onrender.com/api/box/editTask", payload, {
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
    setRaiseReqLoading(true);
    e.preventDefault();
    const payload = {
      reqDescription: reqContent,
      reqResponse: "Pending",
      ID: taskDetails.taskID,
      boxID: taskDetails.boxID,
    };
    const createRequest = await axios
      .post("https://infinityflowbe.onrender.com/api/box/createRequest", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRaiseReqLoading(false);

        dispatch(setTaskDetails(res.data.taskDetails));
        setReqModalisOpen(!reqModalisOpen);
        setReqErrorMsg("");
        setReqContent("");
      })
      .catch((err) => {
        console.log(err);
        setRaiseReqLoading(false);
        setReqErrorMsg(err.response.data.message);
      });
  };
  // ---------------------------------------handling create subtask---------------------------
  const toggleCreateSubtask = () => {
    setCreateSubtaskIsOpen(!createSubtaskIsOpen);
    setSbPriority("");
    setSbDeadline("");
    setSbObjective("");
    setSbAssignedTo("");
    setSbTitle("");
  };

  const handleCreateSubtaskSubmit = async (e) => {
    setCreateSubtaskLoading(true);
    e.preventDefault();
    const payload = {
      subtaskTitle: sbTitle,
      subtaskObjective: sbObjective,
      subtaskAssignedTo: assignedID,
      // extract the userdetail from api and extract or filter out all members of the leader
      subtaskDeadline: sbDeadline,
      subtaskCreatedBy: userID,
      boxID: taskDetails.boxID,
      subtaskPriority: sbPriority,
      maintaskID: taskDetails.taskID,
    };
    console.log(payload);
    const createdSubtask = await axios
      .post("https://infinityflowbe.onrender.com/api/box/createSubtask", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
        setCreateSubtaskLoading(false);
        setCreateSubtaskIsOpen(!createSubtaskIsOpen);
        dispatch(setForceRerender());
      })
      .catch((err) => {
        setCreateSubtaskLoading(false);
        console.log(err);
      });
  };
  // -------------------------------handling assigned To-----------------------
  const handleSelectAssignedTo = (item) => {
    setSbAssignedTo(item.userName);
    setAssignedID(item._id);
    setAssignedToIsOpen(!assignedToIsOpen);
  };
  // -----------------------------handle select priority-------------------------
  const handleSelectPriority = (item) => {
    setSbPriority(item);
    setPriorityIsOpen(!priorityIsOpen);
  };

  // ----------------------------handle edit task---------------------------
  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    setEditTaskLoading(true);
    const payload = {
      taskName: editedTaskname,
      taskObjective: editedObjective,
      deadline: editedDeadline,
      priority: editedPriority,
      taskID: taskDetails.taskID,
      boxID: taskDetails.boxID,
      searchTerm : 'a'
    };
    // console.log(payload)
    const updateTaskStatus = await axios
      .put("https://infinityflowbe.onrender.com/api/box/editTask", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res)=>{
        dispatch(setTaskDetails(res.data.taskDetails))
        setEditTaskIsOpen(false)
        setEditTaskLoading(false)
        dispatch(setForceRerender())
      })
      .catch((err)=>{
        console.log(err)
        setEditTaskLoading(false)
        setEditTaskIsOpen(false)
      })
  };

  const handleEditTaskOpen = ()=>{
    setEditedDeadline(taskDetails.deadline)
    setEditedTaskname(taskDetails.taskName)
    setEditedObjective(taskDetails.taskObjective)
    setEditedPriority(taskDetails.priority)
  }
  // ==========================================================jsx===============================================
  return (
    <div>
      <div className="sidebarTitleSection">
        <h3 className="taskTitle">{taskDetails.taskName}</h3>
        <p className="taskID">{taskDetails.taskID}</p>
      </div>
      <div className="sidebarNavigationSection">
        {/* ------------------------nav elements-------------------------------- */}
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
          {userRole === "Team Lead" && (
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
          {userRole === "Manager" && (
            <div
              className="sidebarEdit"
              onClick={() => {
                setEditTaskIsOpen(!editTaskIsOpen);
                handleEditTaskOpen()
              }}
            >
              <MdEdit />
            </div>
          )}
        </div>
      </div>
      <hr className="sbNavHr" />
      {/* -----------------------edit task form------------------------- */}
      {reqModalisOpen === false && editTaskIsOpen === true && (
        <>
          <form className="form" onSubmit={handleEditTaskSubmit}>
            <label htmlFor="Title" className="statusTitle">
              Title
            </label>
            <input
              type="text"
              id="Title"
              className="input"
              value={editedTaskname}
              onChange={(e)=>setEditedTaskname(e.target.value)}
            />
            <label htmlFor="Objective" className="statusTitle">
              Objective
            </label>
            <input
              type="text"
              id="Objective"
              className="textarea"
              value={editedObjective}
              onChange={(e)=>setEditedObjective(e.target.value)}
            />
            <label htmlFor="deadline" className="statusTitle">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              className="input"
              value={editedDeadline}
              required
              onChange={(e)=>setEditedDeadline(e.target.value)}
            />
            <label htmlFor="priority" className="statusTitle">
              Priority
            </label>
            <input
              type="text"
              className="input"
              value={editedPriority}
              id="priority"
              onClick={() => {
                setTaskPriOpen(!taskPrioOpen);
              }}
              // onChange={(e)=>setEditedPriority(e.target.value)}
            />
            {taskPrioOpen && (
              <ul>
                {priorityList.map((ele, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        setEditedPriority(ele);
                        setTaskPriOpen(false)
                      }}
                    >
                      {ele}
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="actions">
              {editTaskLoading === false ? (
                <>
                  <button className=" submitButton createSubtask" type="submit">
                    Edit Task
                  </button>
                  <p
                    className="cancelText"
                    onClick={() => {
                      setEditTaskIsOpen(!editTaskIsOpen);
                    }}
                  >
                    Cancel
                  </p>
                </>
              ) : (
                <>
                  <button
                    className=" submitButton createSubtask loadingWiText"
                    type="submit"
                    disabled={editTaskIsOpen}
                  >
                    <SphereSpinner
                      size={15}
                      color="#C2DEEB"
                      loading={editTaskIsOpen}
                    />
                    Loading
                  </button>
                </>
              )}
            </div>
          </form>
        </>
      )}
      {/* -----------------------raising request------------------------ */}
      {reqModalisOpen === true && editTaskIsOpen === false && (
        <>
          {reqErrorMsg && <p className="statusTitle">{reqErrorMsg}</p>}

          <div className="reqModal">
            <form onSubmit={submitreq} className="form">
              <textarea
                className="textarea"
                name=""
                id=""
                value={reqContent}
                required
                placeholder="Request Description"
                onChange={(e) => setReqContent(e.target.value)}
              ></textarea>
              {raiseReqLoading === false ? (
                <>
                  <button className="submitButton" type="submit">
                    Raise Request
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="submitButton loadingWiText"
                    disabled={raiseReqLoading}
                  >
                    <SphereSpinner
                      size={15}
                      color="#C2DEEB"
                      loading={raiseReqLoading}
                    />{" "}
                    Loading
                  </button>
                </>
              )}
            </form>
          </div>
          <hr className="sbNavHr" />
        </>
      )}
      {/* -------------------------taskInfo-------------------------- */}
      <div className={`${activeIndex != 0 ? "close" : ""}`}>
        {/* -----------------objective---------------- */}
        <div className="objective">
          <h5 className="objbTitle">Objectives & Key results</h5>
          <p className="objDescription">{taskDetails.taskObjective}</p>
        </div>
        <hr className="sbNavHr" />
        {/* -----------------requestDetails--------------- */}
        {requestDetails && (
          <div className="request">
            <h5 className="reqTitle">Request</h5>
            <p className="reqDescription">{requestDetails.reqDescription}</p>
            {userRole === "Manager" && (
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
                <p>{taskDetails.priority}</p>
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
      {/* ---------------------task Updates-------------------------- */}
      <div className={`${activeIndex != 1 ? "close" : ""}`}>
        <div className="statusUpdateLayout">
          {/* --------------------task status and approval status------------------------------- */}
          <div className="taskStatus">
            {userRole === "Team Lead" ? (
              <>
                <div className="statusContainer">
                  <div className="taskStatus">
                    <p className="statusTitle">Task Status</p>
                    {statusLoading === false ? (
                      <>
                        <input
                          className="statChanger"
                          type="text"
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
                      </>
                    ) : (
                      <>
                        <SphereSpinner
                          size={20}
                          color="#C2DEEB"
                          loading={statusLoading}
                        />
                      </>
                    )}
                  </div>
                  <div className="aprovalStatus">
                    <p className="statusTitle">Approval Status</p>
                    <h5>{taskDetails.approvalStatus}</h5>
                  </div>
                </div>
                <hr className="sbNavHr" />
              </>
            ) : // ----------------user Role manager-----------------------
            userRole === "Manager" ? (
              <>
                <div className="statusContainer">
                  <div className="taskStatus">
                    <p className="statusTitle">Task Status</p>
                    <h5>{taskDetails.taskStatus}</h5>
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
                <hr className="sbNavHr" />
              </>
            ) : (
              // ----------------------for other roles---------------------
              <>
                <div className="statusContainer">
                  <div className="taskStatus">
                    <p className="statusTitle">Task Status</p>
                    <h5>{taskDetails.taskStatus}</h5>
                  </div>
                  <div className="aprovalStatus">
                    <p className="statusTitle">Approval Status</p>
                    <h5>{taskDetails.approvalStatus}</h5>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="commentSection">
          <h6 className="priorityTitle">Comments & Logs</h6>
          <Comment data={taskDetails} type={"Task"} />
        </div>
      </div>
      {/* ---------------------subtasks------------------------------ */}
      <div className={`${activeIndex != 2 ? "close" : ""}`}>
        {userRole === "Team Lead" && (
          <>
            {createSubtaskIsOpen === true && (
              <form className="form" onSubmit={handleCreateSubtaskSubmit}>
                <label htmlFor="Title" className="statusTitle">
                  Title
                </label>
                <input
                  className="input"
                  id="Title"
                  type="text"
                  value={sbTitle}
                  required
                  onChange={(e) => setSbTitle(e.target.value)}
                  placeholder="subtask Title"
                />
                <label htmlFor="AssignedTo" className="statusTitle">
                  AssignedTo
                </label>
                <input
                  className="input"
                  id="AssignedTo"
                  placeholder="Assigned To"
                  type="text"
                  required
                  value={sbAssignedTo}
                  readOnly
                  onClick={() => setAssignedToIsOpen(!assignedToIsOpen)}
                />
                {assignedToIsOpen && (
                  <ul className="statOptions">
                    {members.map((item, index) => {
                      return (
                        <li
                          key={index}
                          onClick={() => handleSelectAssignedTo(item)}
                        >
                          {item.userName}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <label htmlFor="Objective" className="statusTitle">
                  Objective
                </label>
                <textarea
                  id="Objective"
                  placeholder="Subtask Objective"
                  className="textarea"
                  required
                  value={sbObjective}
                  onChange={(e) => setSbObjective(e.target.value)}
                ></textarea>
                <label htmlFor="deadline" className="statusTitle">
                  Deadline
                </label>
                <input
                  id="deadline"
                  className="input"
                  type="date"
                  required
                  value={sbDeadline}
                  onChange={(e) => setSbDeadline(e.target.value)}
                />
                <label htmlFor="Priority" className="statusTitle">
                  Priority
                </label>
                <input
                  type="text"
                  className="input"
                  readOnly
                  value={sbPriority}
                  id="Priority"
                  required
                  placeholder="Select Priority"
                  onClick={() => setPriorityIsOpen(!priorityIsOpen)}
                />
                {priorityIsOpen && (
                  <ul className="statOptions">
                    {priorityList.map((item, index) => {
                      return (
                        <li
                          key={index}
                          onClick={() => handleSelectPriority(item)}
                        >
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="actions">
                  {createSubtaskLoading === false ? (
                    <>
                      <button
                        className=" submitButton createSubtask"
                        type="submit"
                      >
                        Create Subtask
                      </button>
                      <p className="cancelText" onClick={toggleCreateSubtask}>
                        Cancel
                      </p>
                    </>
                  ) : (
                    <>
                      <button
                        className=" submitButton createSubtask loadingWiText"
                        disabled={createSubtaskLoading}
                      >
                        <SphereSpinner
                          size={15}
                          color="#C2DEEB"
                          loading={createSubtaskLoading}
                        />
                        Loading
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
            {createSubtaskIsOpen === false && (
              <button
                onClick={toggleCreateSubtask}
                className=" submitButton createSubtask"
              >
                Create Subtask
              </button>
            )}
          </>
        )}

        <hr className="sbNavHr" />
        <div className="subtaskList">
          <table className="subtaskTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>A</th>
                <th>P</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subtaskList.map((ele, index) => {
                return (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "oddRow" : "evenRow"}
                  >
                    <td className="tableData">{ele.subtaskID}</td>
                    <td className="tableData">{ele.subtaskTitle}</td>
                    <td className="tableData">{userInitial}</td>
                    <td className="tableData">{ele.subtaskPriority}</td>
                    <td className="tableData">{ele.subtaskStatus}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p></p>
        </div>
        <hr className="sbNavHr" />
      </div>
    </div>
  );
};

export default TaskInfo;
