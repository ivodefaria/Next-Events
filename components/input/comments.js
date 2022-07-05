import { useState } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';
import { useEffect } from 'react';
import { useContext } from 'react';
import NotificationContext from '../../store/notification-context';

function Comments(props) {
  const { eventId } = props;

  const notificationCtx = useContext(NotificationContext);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);

  useEffect(() => {
    if(showComments){
      setIsFetchingComments(true);
      fetch("/api/comments/" + eventId)
        .then(response => response.json())
        .then(data => {
          setComments(data.comments);
          setIsFetchingComments(false);
        });
    }

  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {

    notificationCtx.showNotification({
      title: "Sending Comment...",
      message: "Your comment is being stored on our database...",
      status: "pending"
    });

    fetch("/api/comments/" + eventId, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then(data => {
          throw new Error(data.message || "Something went wrong!");
        });
      })
      .then(data => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Your comment was successfully submitted!",
          status: "success"
        });
      }).catch(error => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "something went wrong",
          status: "error"
        });
      })
      
    // send data to API
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isFetchingComments && <CommentList items={comments} />}
      {showComments && isFetchingComments && <p>Loading...</p>}
    </section>
  );
}

export default Comments;
