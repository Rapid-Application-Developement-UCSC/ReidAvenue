import { Outlet } from "react-router-dom";
import LandingFooter from "../components/layout/LandingFooter";
import LandingHeader from "../components/layout/LandingHeader";

export default function LandingLayout() {
  return (
    <div className="landng-layout">
      <Outlet />
      <LandingFooter />
    </div>
  );
}
