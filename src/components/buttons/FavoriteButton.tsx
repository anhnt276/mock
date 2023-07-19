import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import { RootState } from '../../store/type';

export const FavoriteButton = ({ currentArticle, setCurrentArticle, text }: any) => {
  const navigate = useNavigate();
  const currentUser = useSelector((store: RootState) => store.user.currentUser);
  const [favorited, setFavorited] = useState<boolean>(currentArticle.favorited);
  const [favoritesCount, setFavoritesCount] = useState<number>(currentArticle.favoritesCount);
  const buttonText = `${favorited ? "Unfavorite" : "Favorite" } Article (${favoritesCount})`;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setFavorited(currentArticle.favorited);
    setFavoritesCount(currentArticle.favoritesCount);
  },[currentArticle])


  const handleFavorite = () => {
    if (!currentUser) navigate('/login');
    favorited ? setFavoritesCount(favoritesCount - 1) : setFavoritesCount(favoritesCount + 1);
    setFavorited(!favorited);
    setLoading(true);

    const request = currentArticle.favorited ? axiosInstance.delete : axiosInstance.post;
    request(`/articles/${currentArticle.slug}/favorite`)
      .then((response) => {
        setFavorited(response.data.article.favorited);
        setCurrentArticle(response.data.article);
      })
      .catch(() => {
        setFavoritesCount(favoritesCount);
        setFavorited(favorited);
      })
      .finally(() => setLoading(false))
  }

  return (
    <Button 
      variant={favorited ? "success" : "outline-success"} 
      className="d-flex gap-1 align-items-center"
      size="sm"
      onClick={handleFavorite}
      disabled={loading}
    >
      <i className="fa-solid fa-heart"></i>
      <div>{text ? buttonText : favoritesCount}</div>
    </Button>
  );
};

