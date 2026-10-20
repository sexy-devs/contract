function SearchJobs() {
  return (
    <div id="search-jobs" className="p-10 bg-slate-200 ">
      <h2 className="text-3xl">Buscar Prestadores</h2>
      <p className="text-gray-500">
        Encontrá profesionales de mantenimiento según el oficio que necesitás
      </p>
      <div
        id="search-bar"
        className="mt-2.5 flex gap-2.5 items-center bg-white p-2.5 w-[50vw] shadow-md rounded-lg"
      >
        <div className="circle border-2 w-3 h-3 rounded-full border-blue-200"></div>
        <input
          type="text"
          name="searchBar"
          id="search-bar"
          placeholder="Buscar oficios o profesionales"
          className="w-full"
        />
      </div>
    </div>
  );
}

export default SearchJobs;
