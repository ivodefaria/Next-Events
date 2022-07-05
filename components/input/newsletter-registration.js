import { useRef, useState, useContext } from 'react';

import classes from './newsletter-registration.module.css';
import NotificationContext from "../../store/notification-context";

function NewsletterRegistration() {

  const emailInputRef = useRef();
  const notificationCtx = useContext(NotificationContext);
  const [isInvalid, setIsInvalid] = useState(false);
  
  function registrationHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;

    if (
      !enteredEmail ||
      enteredEmail.trim() === '' ||
      !enteredEmail.includes('@')
    ) {
      setIsInvalid(true);
      return;
    }

    notificationCtx.showNotification({
      title: "Signing up...",
      message: "Registering for newsletter",
      status: "pending"
    });

    fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email: enteredEmail }),
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
          message: "Successfully registered for newsletter!",
          status: "success"
        });
      }).catch(error => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "something went wrong",
          status: "error"
        });
      });
    
    // fetch user input (state or refs)
    // optional: validate input
    // send valid data to API
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type='email'
            id='email'
            placeholder='Your email'
            aria-label='Your email'
            ref={emailInputRef}
          />
          <button>Register</button>
        </div>
        {isInvalid && <p>Please enter a valid email address and comment!</p>}
      </form>
    </section>
  );
}

export default NewsletterRegistration;
