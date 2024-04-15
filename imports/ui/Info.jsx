import React from 'react';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import Content from '../db/Content';

export const Info = () => {
  const { content, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe("content");

    if (!handler.ready()) {
      return { content: [], isLoading: true };
    }

    const content = Content.find().fetch()

    return { content: content, isLoading: false }

  })

  if(isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Content loaded:</h2>
      <ul>{content.map(
        con => <li key={con._id}>
          {con.title}
        </li>
      )}</ul>
    </div>
  );
};
