import React from "react";
import loadable from "@loadable/component";

const Image = loadable(
  () =>
    import("./Image").then(m => {
      return new Promise(resolve => setTimeout(() => resolve(m), 1000));
    }),
  {
    fallback: <span>Loading...</span>
  }
);

const imgs = ["Dynamic 1", "Dynamic 2"];

const style = {
  border: "1px solid black",
  padding: 10
};

const Gallery = () => (
  <div>
    <h3>Gallery.jsx</h3>
    <ul style={style}>
      {imgs.map(img => (
        <li key={img}>
          <Image img={img} />
        </li>
      ))}
    </ul>
  </div>
);

export default Gallery;
