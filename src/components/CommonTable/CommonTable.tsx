import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { cloneDeep, throttle } from 'lodash';
import Pagination from 'rc-pagination';
import { UserProfilesData } from './types';
import { Spinner } from '../Spinner';
import { Search } from '../Search';
import 'rc-pagination/assets/index.css';
import './CommonTable.scss';

export const CommonTable = (): JSX.Element => {
  const countPerPage = 10;
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<UserProfilesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [collection, setCollection] = useState<UserProfilesData[]>([]);

  const updatePage = (value: number) => {
    setCurrentPage(value);

    const to = countPerPage * value;
    const from = to - countPerPage;

    setCollection(cloneDeep(data.slice(from, to)));
  };

  const searchData = useRef(
    throttle((query: string, data: UserProfilesData[]) => {
      setCurrentPage(1);

      const filteredData = cloneDeep(
        data
          .filter(
            (item) =>
              item.name.includes(query) ||
              item.owner.login.includes(query)
          )
          .slice(0, countPerPage)
      );

      setCollection(filteredData);
    }, 400)
  );

  const fetchUserProfiles = (): void => {
    axios
      .get('https://api.github.com/repositories')
      .then((response: AxiosResponse<UserProfilesData[]>) => {
        const slicedData = cloneDeep(response.data.slice(0, countPerPage));

        setData(response.data);
        setCollection(slicedData);
        setLoading(false);
      })
      .catch(({ error }) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      searchData.current(value, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Search value={value} setValue={setValue} />
      <table className='table'>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Owner Name</th>
            <th>Repo name</th>
            <th>Repo URL</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody className='table__body'>
          {collection.map((item: UserProfilesData) => {
            const { id, owner, name, description } = item;

            return (
              <tr key={id} className='table__row'>
                <td className='table__avatar'>
                  <img src={owner.avatar_url} alt='avatar' />
                </td>
                <td>
                  <span>{owner.login}</span>
                </td>
                <td>
                  <span>{name}</span>
                </td>
                <td>
                  <span>{owner.repos_url}</span>
                </td>
                <td>
                  <span>{description}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        pageSize={countPerPage}
        onChange={updatePage}
        current={currentPage}
        total={data.length}
      />
    </>
  );
};
