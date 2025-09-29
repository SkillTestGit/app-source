import { Outlet } from "react-router-dom";
import { Stack } from '@mui/material';
import SideBar from "./SideBar";

const DashboardLayout = ({ children }) => {
  return (
    <Stack direction='row'>
      {/* SideBar */}
      <SideBar/>
      {children || <Outlet />}
    </Stack>
    
  );
};

export default DashboardLayout;
