export const getNavItems = (gender?: string | null) => {
  const getPossessivePronoun = () => {
    if (!gender) return "Her";
    return gender === "MALE" ? "His" : "Her";
  };

  const getObjectPronoun = () => {
    if (!gender) return "Her";
    return gender === "MALE" ? "Him" : "Her";
  };

  return [
    { id: "dream", label: `${getPossessivePronoun()} Dream` },
    { id: "activity", label: "Activity" },
    { id: "about", label: `About ${getObjectPronoun()}` },
    { id: "fulfilled", label: "Fulfilled" },
    { id: "received", label: "Received" },
  ];
};
