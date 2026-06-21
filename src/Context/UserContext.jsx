import { createContext, useEffect, useState } from "react";

export let UserContext = createContext();

export default function UserContextProvider(props) {
  const [userLogin, setUserLogin] = useState(() => {
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('dawaya_users') || '[]');
      const defaultUserEmail = 'user@dawaya.com';
      const defaultUserPassword = 'Password123!';
      const defaultUserToken = 'mock_token_for_dawaya_auth';
      
      const hasDefaultUser = users.some(u => u.email.toLowerCase() === defaultUserEmail.toLowerCase());
      if (!hasDefaultUser) {
        users.push({
          username: 'مستخدم تجريبي',
          phone: '01012345678',
          email: defaultUserEmail,
          password: defaultUserPassword,
          gender: 'male',
          age: 25,
          role: 'user',
          token: defaultUserToken
        });
        localStorage.setItem('dawaya_users', JSON.stringify(users));
      }

      let token = localStorage.getItem("userToken");
      const loggedOut = localStorage.getItem("dawaya_logged_out") === "true";
      if (!token && !loggedOut) {
        localStorage.setItem('userToken', defaultUserToken);
        localStorage.setItem('dawaya_current_email', defaultUserEmail);
        localStorage.setItem('dawaya_current_password', defaultUserPassword);
        token = defaultUserToken;
      }
      return token;
    }
    return null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setUserLogin(localStorage.getItem("userToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ userLogin, setUserLogin }}>
      {props.children}
    </UserContext.Provider>
  );
}
