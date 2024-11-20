import { useEffect, useState } from "react";
import Form from "./components/Form.jsx";
import Grid from "./components/Grid.jsx";
import { getData } from "./utils/getData.js";
import Violations from "./components/Violations.jsx";
import Download from "./components/Download.jsx";
import Legend from "./components/Legend.jsx";
import Logout from "./components/Logout.jsx";

function FpApp() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  async function response() {
    await getData(selectedDate, 2).then((r) => {
      setData(r);
    });
  }

  useEffect(() => {
    response();
  }, [selectedDate]);

  return (
    <>
      <div className="flex min-h-[100dvh] place-items-center items-start">
        <div className="flex px-2 py-4 min-h-[100dvh] bg-slate-500 flex-col flex-grow place-content-between place-items-center font-bold">
          <div className="flex flex-col place-items-center">
            <label className="text-slate-100" htmlFor="selected-date">
              Select Date to View:
            </label>
            <input
              type="date"
              name="selected-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <Form data={data} setData={setData} />
          <Download />
          <Logout />
        </div>
        <div className="h-[100dvh]">
          {data && <Grid date={selectedDate} data={data} setData={setData} />}
        </div>
        <div className="h-[100dvh] flex-grow">
          <Violations />
        </div>
      </div>
      <Legend />
    </>
  );
}

export default FpApp;