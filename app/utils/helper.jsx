import { BASE_URL } from "./constants";

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  return '';
};

export const getCurrentDateTime = (dateTimeString = "") => {
  const date = dateTimeString === "" ? new Date() : new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day} ${month} ${hours}:${minutes}:${seconds}`;
};

const buildFormData = (formData, obj, parentKey = "") => {
  if (Array.isArray(obj)) {
    obj.forEach((element) => {
      buildFormData(formData, element, parentKey);
    });
  } else if (typeof obj === "object" && !(obj instanceof File)) {
    Object.keys(obj).forEach((key) => {
      buildFormData(formData, obj[key], parentKey ? `${parentKey}.${key}` : key);
    });
  } else {
    if (obj == null) return;

    const value = typeof obj === "number" || typeof obj === "boolean" ? obj.toString() : obj;
    formData.append(parentKey, value);
  }
};

export const objectToFormData = (obj) => {
  const formData = new FormData();
  buildFormData(formData, obj);
  return formData;
};

export const extractFilenameFromUrl = (url) => {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1];
};

export const getFloorDecropped_imagetails = (locations, floorId) => {
  for (const location of locations) {
    for (const building of location.buildings) {
      for (const floor of building.floors) {
        if (floor.id === floorId) {
          return {
            floor,
            building,
            location
          };
        }
      }
    }
  }
  return null;
};

export function extractMediaPath(url) {
  const mediaIndex = url?.indexOf('/media');
  console.log(`${BASE_URL}${url?.substring(mediaIndex)}`);
  return mediaIndex !== -1 ? `${BASE_URL}${url?.substring(mediaIndex)}` : url;
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch (error) {
    return 'Invalid Time';
  }
};
