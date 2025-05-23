import React, { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import { toast } from 'react-toastify';
import Logout from "./Logout";
import { userService } from "../services/userService";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First try to get from localStorage for immediate display
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
          setIsLoading(false);
        }

        // Then fetch fresh data from the server
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-gradient-to-r from-cyan-800 to-sky-100 shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      {/* Left: User Info */}
      <div className="flex items-center space-x-4">
        <UserCircle className="w-16 h-16 text-sky-50" />
        <div>
          <p className="text-xl font-bold">
            {isLoading ? 'Loading...' : 
              user ? `${user.first_name} ${user.last_name}` : 'Guest'}
          </p>
          <p className="text-sky-50">
            {isLoading ? 'Loading...' : user?.email}
          </p>
        </div>
      </div>

      <Logout />
    </div>
  );
};

export default Header;
