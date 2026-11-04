import { Link } from "react-router-dom";

function LogoContract() {
  return (
    <div>
      <Link
        to={"/inicio"}
        id="logo-contract"
        className="text-blue-500 flex items-center gap-3"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-sky-800 font-bold text-white">
          C
        </span>
        <span className="text-xl font-bold text-gray-900">Contract</span>
      </Link>
    </div>
  );
}

export default LogoContract;
