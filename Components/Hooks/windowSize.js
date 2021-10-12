import { useState, useEffect } from "react";

// Usage
// function App() {
//   const size = useWindowSize();

//   return (
//     <div>
//       {size.width}px / {size.height}px
//     </div>
//   );
// }

// Hook
const useWindowSize=() =>{
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    size:undefined
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.screen.width,
        height: window.innerHeight,
        size:window.screen.height,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}
export default useWindowSize;