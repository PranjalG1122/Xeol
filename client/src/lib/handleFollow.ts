export const handleFollow = (username: string) => {
  return new Promise<{ success: boolean }>((resolve, reject) => {
    fetch(new URL("/api/user/follow/" + username, window.location.href), {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: { success: boolean }) => {
        if (data.success) {
          return resolve({
            success: true,
          });
        }
        return reject({
          success: false,
        });
      });
  });
};
