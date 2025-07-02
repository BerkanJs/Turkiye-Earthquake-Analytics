import React from "react";

export default function Filters({
  minMag,
  maxMag,
  location,
  date,
  setMinMag,
  setMaxMag,
  setLocation,
  setDate,
  onClear,
}) {
  const handleMinMagChange = (e) => {
    const val = e.target.value;
    if (val === "" || (!isNaN(val) && Number(val) >= 0 && Number(val) <= 10)) {
      setMinMag(val);
    }
  };

  const handleMaxMagChange = (e) => {
    const val = e.target.value;
    if (val === "" || (!isNaN(val) && Number(val) >= 0 && Number(val) <= 10)) {
      setMaxMag(val);
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  return (
    <div className="bg-gray-900 text-gray-200 px-6 py-4 rounded-md flex flex-wrap items-center gap-6">
      <div>
        <label htmlFor="minMag" className="mr-2 font-semibold">
          Min Büyüklük:
        </label>
        <input
          id="minMag"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={minMag}
          onChange={handleMinMagChange}
          placeholder="0"
          className="rounded px-3 py-1 w-20 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="maxMag" className="mr-2 font-semibold">
          Max Büyüklük:
        </label>
        <input
          id="maxMag"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={maxMag}
          onChange={handleMaxMagChange}
          placeholder="10"
          className="rounded px-3 py-1 w-20 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="mr-2 font-semibold">
          Konum:
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={handleLocationChange}
          placeholder="Şehir veya Bölge"
          className="rounded px-3 py-1 w-40 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="date" className="mr-2 font-semibold">
          Tarih:
        </label>
        <input
          id="date"
          type="date"
          value={date}
          max={new Date().toISOString().slice(0, 10)} 
          onChange={handleDateChange}
          className="rounded px-3 py-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={onClear}
        className="ml-auto bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 px-4 py-2 rounded font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        type="button"
      >
        Filtreleri Temizle
      </button>
    </div>
  );
}
