// imports/ui/UserProfilePage.jsx
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileCard from './ProfileCard';
import ContentList from './ContentList';
import CustomWatchLists from './CustomWatchLists';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [userLists, setUserLists] = useState([]);

  // Use useTracker to subscribe to userData and fetch user details
  const userProfile = useTracker(() => {
    const handler = Meteor.subscribe('userData', userId);
    if (handler.ready()) {
      const user = Meteor.users.findOne({ _id: userId });
      console.log('Fetched user data:', user);
      if (user) {
        return {
          avatarUrl: user.avatarUrl || './default-avatar.png',
          userName: user.username || 'Unknown User',
          followers: user.followers?.length || '0',
          following: user.following?.length || '0',
          userRealName: user.realName || 'No Name Provided',
          userDescription: user.description || 'No description provided.',
          _id: userId,
        };
      }
    }
    return null;
  }, [userId]);

  useEffect(() => {
    if (userProfile) {
      console.log('Fetching user lists for userId:', userId);
      Meteor.call('list.read', { userId }, (error, result) => {
        if (error) {
          console.error('Error fetching user lists:', error);
        } else {
          console.log('User lists fetched:', result);
          setUserLists(result);
        }
      });
    }
  }, [userId, userProfile]);

  const favouritesList = userLists.find((list) => list.listType === 'Favourite');
  const toWatchList = userLists.find((list) => list.listType === 'To Watch');
  const customWatchlists = userLists.filter((list) => list.listType === 'Custom');


  console.log("USER PROFILE")
  console.log(userProfile)
  
  return (
    <Fragment>
      {userProfile ? (
        <div className="flex flex-col gap-6">
          <ProfileCard
            user={userProfile}
            onFollow={() => {
              // Define follow logic here
            }}
            showFollowButton={Meteor.userId() !== userId}
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
