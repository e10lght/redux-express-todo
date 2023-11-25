import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../store/store';
import { fetchUser } from '../userActions';
import { Profile } from './Profile';
import { UserList } from './UserList';

export const Users = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser())
      .unwrap()
      .then(data => {
        console.log(data); // 正常系のデータをログに出力
      })
      .catch(err => {
        console.log(err.status);
        console.log(err.message);
        navigate('/');
      });
  });
  // 単一ユーザの場合と複数ユーザの場合はそれぞれProfileとUserListに分岐して表示する
  return (
    <div>
      Users
      <Profile />
      <UserList />
    </div>
  );
};
