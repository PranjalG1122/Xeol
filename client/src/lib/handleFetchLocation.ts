export const handleFetchLocation = new Promise<{
  city: string;
  country: string;
} | null>((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (!position) {
        reject(null);
      }
      fetch(
        import.meta.env.VITE_LOCATION_API_LINK +
          `/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&addressdetails=1&zoom=10`
      ).then((res) => {
        res.json().then((data) => {
          data &&
            resolve({
              city: data.address.city,
              country: data.address.country,
            });
          reject(null);
        });
      });
    },
    () => {
      reject(null);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
});
