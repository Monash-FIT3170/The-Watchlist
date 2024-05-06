import React from "react";
import { IconContext } from 'react-icons';
import { Link } from "react-router-dom";
import { MdMovieFilter } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


export default function Navbar({ staticNavData, listData }) {

  const navigate = useNavigate();

  const handleNavigate = (listId) => {
    navigate(`/${listId}`);
  };

  return (
    <div className="flex flex-col h-screen"> 
      <IconContext.Provider value={{ size: '20px' }}>
        <div className="flex flex-col w-64 p-0" style={{ margin: '1rem', marginRight: '0.5rem', marginLeft: '0.5rem', height: 'calc(100vh - 2rem)' }}> {/* Use viewport height (vh) if full height is needed */}

          <div className="bg-darker rounded-lg shadow-lg pt-4 px-2 mb-4 flex-none">
            <nav>
              <ul className="flex flex-col w-full">
                {staticNavData.map((item, index) => (
                  <li key={index} className={item.cName}>
                    <Link to={item.path} className="nav-link">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="bg-darker rounded-lg shadow-lg p-2 flex-grow overflow-hidden">
            <nav>
              <h2 className="nav-link"> <MdMovieFilter /> Your Watchlists</h2>
              <div style={{ height: '100%', overflowY: 'auto' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px',
                  padding: '1px',
                }}>
                  {listData.map((list) => (
                    <div key={list.listId} onClick={() => handleNavigate(list.listId)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '5px',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                      padding: '10px'
                    }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3d3838'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#181818'}
                    >
                      <img
                        src={list.content[0]?.image_url || './path_to_default_image.jpg'}
                        alt={list.title}
                        style={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '5px' }}
                      />
                      {list.title}
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </IconContext.Provider>
    </div>
  );
}