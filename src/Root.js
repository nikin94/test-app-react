import React from 'react';
import { observable } from 'mobx'

export default function Root({ children }) {
  return (
    <div>
      <h1>ROOOT</h1>
      {children}
    </div>
  )
};