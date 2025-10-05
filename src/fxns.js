// fxnsMeta should be a list mapped from useFxns
export function useFxns() {

  return {
    objTemplateCreator: {
      description: "Creates a new object template",
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
    tracker: { description: "Opens a container that tracks info" },
    objTemplateCreator: { description: "Creates an object template" },
  };
