import React, {useState, useEffect} from 'react';
import { Log } from 'meteor/logging';
import ContentList from './ContentList';
import RatingStar from './RatingStar';

export default HomePage = ({ listData }) => {

  const [searchString, setSearchString] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  // If we wanted to use live updating, which I don't think we do for content. But the below works!
  // https://react-tutorial.meteor.com/simple-todos/10-publications
  /*
  const { content, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe("content");

    if (!handler.ready()) {
      return { content: [], isLoading: true };
    }

    const content = Content.find().fetch()

    return { content: content, isLoading: false }

  })*/


  /**
   * Retrieves data from the database using a Meteor call (as opposed to using a subscribe, like shown above)
   */
  getData = () => {
    setIsLoading(true);

    Meteor.call("content.read", {searchString}, (err, res) => {
      if (err) { alert(err) }
      else {
        Log.debug(res);
        Log.debug(`Searchstring: ${searchString}`)
        setContentData(res);
        setIsLoading(false);
      }
    });

    
  } 

  /**
   * Creates a movie in the database using Meteor methods. Passes the title of the movie in before refreshing the content on the page.
   */
  handleCreate = () => {
    if (title == "") return;
    
    Meteor.call("content.create", {
      title: title
    }, (err, res) => {
      if (err) {
        alert(res)
      } else {
        getData();
      }
    })

  }


  handleSearchChange = (e) => {
    setSearchString(e.target.value);
  }

  // Refresh the data source every time the search string is updated
  useEffect(() => {
    getData();
  }, [searchString])

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto' }}>
      {listData.map((list) => (
        <ContentList
          key={list.listId}
          list={list} // Now passing the entire list object
        />
      ))}
    </div>
  );
};
