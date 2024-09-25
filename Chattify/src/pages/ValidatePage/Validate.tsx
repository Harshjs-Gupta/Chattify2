import Notification from "../../components/Notification/notification";
import Register from "../../components/RegisterPage/Register";
import "./Validate.css";

function Validate() {
  return (
    <div className="validate-container flex h-screen w-screen">
      <Register />
      <Notification />
    </div>
  );
}
export default Validate;
