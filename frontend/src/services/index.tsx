import axios, { AxiosRequestConfig, HeadersDefaults } from 'axios';
import { BASE_URL, REFRESH_TOKEN_URL } from '../constants/url.ts';

const refreshToken: any = localStorage.getItem("refreshToken") ?? "null";

interface CommonHeaderProperties extends HeadersDefaults {
  Authorization: string;
}

axios.defaults.headers.common['Content-Type'] = 'application/json';

const getLocalAccessToken = () => {
  const token = localStorage.getItem("token") ?? "null";
  return token;
};

const apiClient: any = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY,
    Authorization: `Bearer ${getLocalAccessToken()}`,
  },
});

const updateAxiosInstance = (accessToken?: string) => {
  apiClient.defaults.headers = {
    Authorization: `Bearer ${getLocalAccessToken()}`,
  } as CommonHeaderProperties;
};

const checkValidToken = (token: any) => {
  if (!token) {
    return false;
  }
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp > currentTime;
};

const performLogout = () => {
  localStorage.removeItem('checkValidToken');
  sessionStorage.removeItem('isLoggedInSession');
};

const updateLocalToken = (idToken: string, refreshToken: string) => {
  localStorage.setItem('token', idToken);
  localStorage.setItem('refreshToken', refreshToken);
};

let refreshTokenPromise: any = null;

apiClient.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const { config, response } = error;
    if (config && response && (response.status === 401 || localStorage.getItem('checkValidToken') === 'true')) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenFunc().then((res: any) => {
          updateLocalToken(res.data.token_response.id_token, res.data.token_response.refresh_token,);
          updateAxiosInstance(res.data.id_token);
          refreshTokenPromise = null;
          return axios({
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${res.data.token_response.id_token}`,
            },
          });
        });
      }

      return refreshTokenPromise.then(() => {
        return axios(config);
      });
    }

    return Promise.reject(error);
  }
);

export function refreshTokenFunc() {
  const refresh_token = refreshToken;

  return apiClient
    .post(
      REFRESH_TOKEN_URL,
      { refresh_token },
      {
        headers: {
          'Content-type': 'application/json',
        },
      },
    )
    .then((res: any) => {
      return res;
    });
}

const getService = async (endpoint: string) => {
  try {
    updateAxiosInstance();
    const response = await apiClient.get(endpoint);
    if (
      response.status === 201 || 
      response.status === 200 || 
      response.status === 204 || 
      response.status === 202
    ) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error making request');
    }
  }
};

const postService = async (
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  try {
    updateAxiosInstance();
    const response = await apiClient.post(endpoint, data, config);

    if (
      response.status === 201 || 
      response.status === 200 || 
      response.status === 204 || 
      response.status === 202
    ) {
      return response.data;
    }

    throw new Error(response.statusText);
  } catch (err) {
    console.error('Error in postService:', err);
    throw new Error('Failed to make POST request');
  }
};

const putService = async (endpoint: string, data?: any) => {
  try {
    updateAxiosInstance();
    const response = await apiClient.put(endpoint, data);
    if (
      response.status === 201 ||
      response.status === 200 ||
      response.status === 204 || 
      response.status === 202
    ) {
      return response.data;
    }
    throw new Error(response.statusText);
  } catch (err: any) {
    return Promise.reject(err.response.data);
  }
};

const deleteService = async (endpoint: string, data?: any) => {
  try {
    updateAxiosInstance();
    const response = await apiClient.delete(endpoint, { data });
    if (
      response.status === 201 ||
      response.status === 200 ||
      response.status === 204 || 
      response.status === 202
    ) {
      return response.data;
    }
    throw new Error(response.statusText);
  } catch (err: any) {
    return Promise.reject(err.response.data);
  }
};

const patchService = async (endpoint: string, data?: any) => {
  try {
    updateAxiosInstance();
    const response = await apiClient.patch(endpoint, data);
    if (
      response.status === 201 ||
      response.status === 200 ||
      response.status === 204 || 
      response.status === 202
    ) {
      return response.data;
    }
    throw new Error(response.statusText);
  } catch (err: any) {
    return Promise.reject(err.response.data);
  }
};

export const useDataService = {
  getService,
  postService,
  putService,
  deleteService,
  patchService,
  checkValidToken,
  performLogout,
};
