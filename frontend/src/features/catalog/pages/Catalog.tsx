import SearchJobs from "../components/SearchJobs";
import JobsSection from "../components/JobsSection";
import { useState } from "react";

function Catalog() {
  const [search, setSearch] = useState("");
  return (
    <div id="catalog-page" className="bg-blue-50 w-full min-h-screen">
      <div id="content">
        <SearchJobs onSearch={setSearch} />
        <JobsSection search={search} />
      </div>
    </div>
  );
}

export default Catalog;
