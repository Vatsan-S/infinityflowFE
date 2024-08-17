import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { SphereSpinner } from "react-spinners-kit";

const Comment = ({ data, type }) => {
  // console.log(data)
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");
  const [reRender, setReRender] = useState(false);

  // ---------------------------loading states----------------------------------
  const [commentLoading, setCommentLoading] = useState(false);
  const [createCommentLoading, setCreateCommentLoading] = useState(false)


  // ---------------------------error message states----------------------------
  const [createErrMsg,setCreateErrMsg]= useState('')
  let identification;
  if (type === "Task") {
    identification = data.taskID;
  } else {
    identification = data.subtaskID;
  }
  const fetchComments = async () => {
    setCommentLoading(true)
    const payload = {
      id: identification,
    };
    await axios
      .post("https://infinityflowbe.onrender.com/api/box/getAllComments", payload)
      .then((res) => {
        // console.log(res)
        setCommentList(res.data.commentsList.reverse());
        setCommentLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setCommentLoading(false)
      });
  };
  useEffect(() => {
    fetchComments();
  }, [data, reRender]);
  //   ----------------------------------handling comment submit------------------
  const handleSubmit = async (e) => {
    setCreateErrMsg('')
    if(comment===''){
      setCreateErrMsg('Comment Box Is Empty')
    }
    setCreateCommentLoading(true)
    e.preventDefault();
    const payload = {
      commentDescription: comment,
      ID: identification,
      boxID: data.boxID,
    };
    await axios
      .post("https://infinityflowbe.onrender.com/api/box/createComment", payload)
      .then((res) => {
        // console.log(res);
        setCreateCommentLoading(false)
        setReRender(!reRender);
        setComment("");
      })
      .catch((err) => {
        console.log(err);
        setCreateErrMsg('Error Creating Comment')
        setCreateCommentLoading(false)
      });
    // console.log(payload);
  };

  return (
    <div className="commentSection">
      {createErrMsg && <p className="errMsg">{createErrMsg}</p>}
      {commentLoading=== false ?(commentList.map((ele, index) => {
        const date = new Date(ele.commentCreatedAt).toDateString();
        return (
          <div key={index} className="comment">
            <p className="commentDate">{date}</p>
            <p className="commentDescription">{ele.commentDescription}</p>
          </div>
        );
      })):(<><SphereSpinner size={20} color="#C2DEEB" loading={commentLoading} /></>)}
      
      <form className="commentForm" onSubmit={handleSubmit}>
        
        <div className="commentBox">
          <input
            type="text"
            value={comment}
            placeholder="Your comment here"
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        
        {createCommentLoading === false?<button className="iconButton" type="submit">
          <IoMdSend />
        </button>:<button className="iconButton"  >
          <SphereSpinner size={15} color="#C2DEEB" loading={createCommentLoading} />
        </button>}
        
        
      </form>
    </div>
  );
};

export default Comment;
