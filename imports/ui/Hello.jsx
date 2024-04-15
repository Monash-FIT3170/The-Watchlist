import React, { useState } from 'react';

export const Hello = () => {
  const [title, setTitle] = useState("");

  handleCreate = () => {
    if (title == "") return;
    
    Meteor.call("content.create", {
      title: title
    }, (err, res) => {
      if (err) {
        alert(res)
      } else {
        alert("Successfully added movie!")
      }
    })

  }

  getData = () => {
    Meteor.call("content.create", {myValue: 5}, (err, res) => {
      if (err) {
        alert(err)
      } else {
        setCounter(res)
      }
    })
  }

  return (
    <div>
      <p>Add a new movie!</p>
      <input value={title} onChange={e => setTitle(e.target.value)}/>
      <button onClick={() => handleCreate()}>Create Movie</button>
    </div>
  );
};
