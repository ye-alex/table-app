import React, { ChangeEvent, FC } from 'react';
import './Search.scss';

type SearchProps = {
    value: string
    setValue: (item: string) => void;
}

export const Search: FC<SearchProps> = ({ value, setValue }): JSX.Element => (
    <div className="search">
        <input
            placeholder="Search..."
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
        />
    </div>
);
