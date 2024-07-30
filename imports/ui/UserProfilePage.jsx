import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import ContentList from './ContentList';
import CustomWatchLists from './CustomWatchLists';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const currentUser = Meteor.userId();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = await Meteor.users.findOne({ _id: userId });
      if (user) {
        setUserProfile({
          avatarUrl: user.avatarUrl || './default-avatar.png',
          userName: user.username || 'Unknown User',
          followers: user.followers.length || '0',
          following: user.following.length || '0',
          userRealName: user.realName || 'No Name Provided',
          userDescription: user.description || 'No description provided.',
          _id: userId,
        });
      }
    };

    const fetchUserLists = () => {
      Meteor.call('list.read', { userId }, (error, result) => {
        if (error) {
          console.error('Error fetching user lists:', error);
        } else {
          setUserLists(result);
        }
      });
    };

    fetchUserProfile();
    fetchUserLists();
  }, [userId]);

  const favouritesList = userLists.find((list) => list.listType === 'Favourite');
  const toWatchList = userLists.find((list) => list.listType === 'To Watch');
  const customWatchlists = userLists.filter((list) => list.listType === 'Custom');

  return (
    <Fragment>
      {userProfile ? (
        <div className="flex flex-col gap-6">
          <ProfileCard
            user={userProfile}
            onFollow={() => {
              // Define follow logic here
            }}
            showFollowButton={currentUser !== userId}
          />
          {favouritesList && <ContentList key={favouritesList._id} list={favouritesList} />}
          {toWatchList && <ContentList key={toWatchList._id} list={toWatchList} />}
          <CustomWatchLists listData={customWatchlists} />
        </div>
      ) : (
        <div>Loading user profile...</div>
      )}
    </Fragment>
  );
};

export default UserProfilePage;
