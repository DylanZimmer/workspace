// fxnsMeta should be a list mapped from useFxns
export function useFxns() {

  return {
    objCreator: {
      description: "Creates a new object in memory",
      fxn: () => {
        console.log("Hit objCreator");
      }
    },
    tracker: {
      description: "Opens a container that tracks info",
      fxn: () => {
        //toggleShowTracker(true);
        //setLeftWidth(60);
        console.log("Hit tracker")
      }
    }
  };
}

export const fxnsMeta = {
    objCreator: { description: "Creates a new object in memory" },
    tracker: { description: "Opens a container that tracks info" },
    setTrackingList: { description: "Tells the tracker what to keep track of"}
  };
