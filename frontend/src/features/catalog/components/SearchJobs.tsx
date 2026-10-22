import { useEffect, useState } from "react";
import { CrossSVG } from "../../../assets/svg/svgs";

function SearchJobs({ onSearch }: { onSearch: (q: string) => void }) {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
      const t = setTimeout(() => onSearch(searchValue.trim()), 400);
      return () => clearTimeout(t);
    }, [searchValue, onSearch]);

  return (
    <div id="search-jobs" className="p-10 bg-slate-200 ">
      <h2 className="text-3xl">Buscar Prestadores</h2>
      <p className="text-gray-500">
        Encontrá profesionales de mantenimiento según el oficio que necesitás
      </p>
      <div
        id="search-bar"
        className="mt-2.5 flex gap-2.5 items-center bg-white p-2.5 max-w-150 shadow-md =
                  rounded-lg "
      >
        <div className="circle border-2 w-3 h-3 rounded-full border-blue-200"></div>
        <input
          type="text"
          name="searchBar"
          id="search-bar"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar oficios o profesionales"
          className="w-full"
        />
        <button onClick={() => setSearchValue("")}>{<CrossSVG/>}</button>
      </div>
    </div>
  );
}

export default SearchJobs;
