import { objectToFormData } from "../utils/helper";
import axiosInstance from "./index";

export const postAPI = (url, data = {}, config = {}, asFormData = false) => {
  const requestData = asFormData ? objectToFormData(data) : data;
  return axiosInstance.post(url, requestData, config);
};

export const getAPI = (url, ...rest) => {
  return axiosInstance.get(url, ...rest);
};

export const deleteAPI = (url, ...rest) => {
  return axiosInstance.delete(url, ...rest);
};

export const patchAPI = (url, data = {}, config = {}, asFormData = false) => {
  const requestData = asFormData ? objectToFormData(data) : data;
  return axiosInstance.patch(url, requestData, config);
};
