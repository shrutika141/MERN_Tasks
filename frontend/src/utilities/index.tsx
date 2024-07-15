const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.refreshToken;
  };
  
  const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.accessToken;
  };
  
  const updateLocalToken = (accessToken: string, refreshToken: string) => {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    localStorage.setItem('user', JSON.stringify(user));
  };

const getStoreData = (key: string) =>
  localStorage.getItem(key) ? localStorage.getItem(key) : null;

  const tokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalToken,
    getStoreData
  }


  export default tokenService;