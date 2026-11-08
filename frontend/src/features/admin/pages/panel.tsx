import AdminSidebar from "../../../components/layout/AdminSidebar";
import UsersPage from "../../admin-users/pages/UsersPage";

function Panel() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <UsersPage />
      </div>
    </div>
  );
}

export default Panel;
