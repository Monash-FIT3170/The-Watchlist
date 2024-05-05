import React, {useState, useEffect} from 'react';
import { Log } from 'meteor/logging';
import ContentList from './ContentList';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  const handleNavigate = (listId) => {
    navigate(`/${listId}`);
  };

  const favoriteList = listData.filter(list => list.listType === 'Favourite');
  const toWatchList = listData.filter(list => list.listType === 'To Watch');
  const customLists = listData.filter(list => list.listType === 'Custom');

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto' }}>

      {/* Displaying Custom lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', padding: '10px' }}>
        {customLists.map(list => (
          <div key={list.listId} onClick={() => handleNavigate(list.listId)} style={{
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#282525',  // Dark background
            borderRadius: '5px',
            color: 'white',  // Ensure text is visible on dark background
            cursor: 'pointer',  // Indicates the item is clickable
            transition: 'background-color 0.3s',  // Smooth transition for hover effect
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3d3838'}  // Lighter color on hover
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#282525'}  // Revert on mouse leave
          >
            <img 
              src={list.content[0]?.image_url || './path_to_default_image.jpg'}  // Use first image in list or a default one
              alt={list.title}
              style={{ width: '60px', height: '60px', marginRight: '10px' }}  // Adjust size as necessary
            />
            {list.title}
          </div>
        ))}
      </div>

      {/* Displaying Favourite and To Watch lists */}
      {favoriteList.map(list => (
        <ContentList key={list.listId} list={list} />
      ))}
      {toWatchList.map(list => (
        <ContentList key={list.listId} list={list} />
      ))}

      
    </div>
  );
}