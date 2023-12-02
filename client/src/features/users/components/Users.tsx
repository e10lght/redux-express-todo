import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../store/store';
import { User } from '../../../types/user';
import { fetchUser } from '../userActions';
import { Profile } from './Profile';

export const Users = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    dispatch(fetchUser())
      .unwrap()
      .then(data => {
        console.log(data); // 正常系のデータをログに出力
        if (!data) throw new Error('ユーザが存在しません');
        setUser(data);
      })
      .catch(err => {
        console.log(err.status);
        console.log(err.message);
        navigate('/');
      });
  }, []);
  return <>{user && <Profile user={user} />}</>;
};
