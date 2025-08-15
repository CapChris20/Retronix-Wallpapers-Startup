import LiveGrid from "../components/LiveGrid";
import StaticGrid from "../components/StaticGrid";
import React from "react";

function PremiumGrid({ filter, setFilter }) {
  return (
    <div className="container no-top-pad">
      <div className="category-header-wrap">
     
      </div>

      {filter === "all" && (
        <>
          <StaticGrid filter="static" limit={8} />
          <LiveGrid filter="live" limit={8} />
        </>
      )}
      {filter === "static" && <StaticGrid filter="static" limit={8} />}
      {filter === "live" && <LiveGrid filter="live" limit={8} />}
    </div>
  );
}

export default PremiumGrid;
