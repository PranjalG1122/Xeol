export const handleFetchLocation = (
  setLocation: React.Dispatch<
    React.SetStateAction<{
      city: string;
      country: string;
    } | null>
  >
): void => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (!position) {
        setLocation(null);
        return;
      }
      fetch(
        import.meta.env.VITE_LOCATION_API_LINK +
          `/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&addressdetails=1&zoom=10`
      ).then((res) => {
        res.json().then((data) => {
          if (data)
            return setLocation({
              city: data.address.city,
              country: data.address.country,
            });
          return setLocation(null);
        });
      });
    },
    (error) => {
      console.log(error);
      setLocation(null);
      return;
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
};
