import React from "react";

export const AccountContext = React.createContext({token: "", role: "", userId: 0, setToken: (x) => {}})
