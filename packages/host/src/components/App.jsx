import * as React from "react";

const App = ({ comps }) => {
  const elements = Object.entries(comps).map(([compType, Comp]) => (
    <Comp key={compType} />
  ));
  return (
    <div>
      <h1>App.tsx</h1>
      {elements}
    </div>
  );
};

export default App;
