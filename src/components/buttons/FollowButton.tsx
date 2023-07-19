import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import { IProfile } from '../../pages/Profile';
import { RootState } from '../../store/type';

interface IProps {
  profile: IProfile
}

export const FollowButton = ({ profile }: IProps) => {
  const navigate = useNavigate();
  const currentUser = useSelector((store: RootState) => store.user.currentUser);
  const [following, setFollowing] = useState<boolean>(profile.following);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFollow = () => {
    if (!currentUser) navigate('/login');
    setFollowing(!following);
    setLoading(true);

    const request = following ? axiosInstance.delete : axiosInstance.post
    request(`/profiles/${profile.username}/follow`)
      .then((response) => {
        setFollowing(response.data.profile.following);
      })
      .catch(() => {
        setFollowing(following);
      })
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <Button 
        variant={`${following ? "secondary" : "outline-secondary" }`}
        className="d-flex gap-1 align-items-center"
        onClick={handleFollow}
        size="sm"
        disabled={loading}
      >
        {following ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i>}
        {following ? "Unfollow" : "Follow"} {profile.username}
      </Button>
    </div>
  );
};