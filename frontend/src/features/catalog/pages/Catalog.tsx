import Header from "../components/Header";
import SearchJobs from "../components/SearchJobs";
import JobsSection from "../components/JobsSection";

function Catalog() {
  return (
    <div id="catalog-page" className="bg-blue-50 w-screen h-screen">
      <Header />
      <div id="content">
        <SearchJobs />
        <JobsSection />
      </div>
    </div>
  );
}

export default Catalog;
