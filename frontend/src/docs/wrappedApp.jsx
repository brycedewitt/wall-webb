import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { Homepage } from "./pages/index";

const WrappedApp = ({}) => {

  return (
    <Routes>
      <Route path="/" element={(<Homepage />)} />
    </Routes>
  );
};

export default WrappedApp;