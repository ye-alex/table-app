import React from 'react';
import { CommonTable } from './components/CommonTable';
import './App.scss';

export const App = (): JSX.Element => {
  return (
    <main className="main-content">
      <header className="title">
        <h1>Owner info</h1>
      </header>
      <CommonTable />
    </main>
  );
}
