import React, { createContext, useState } from 'react';

export const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <AuthModalContext.Provider value={{ showModal, setShowModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}
