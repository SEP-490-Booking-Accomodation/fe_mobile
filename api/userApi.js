import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Đăng nhập không thành công");
    }
    // const text = await response.text();
    // console.log("Response text:", text);
    // return JSON.parse(text); // If it’s JSON, this will work; otherwise, it will throw an error

    const data = await response.json();
    return data; // Trả về dữ liệu từ server
  } catch (error) {
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      // Handle server errors
      const errorData = await response.json();
      throw new Error(errorData.message || "Đăng ký thất bại");
    }

    // Return the response data if successful
    return await response.json();
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  const token = await AsyncStorage.getItem("userToken"); // Retrieve token if required
  console.log(token);

  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });
    // console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Không thể lấy thông tin người dùng"
      );
    }

    const data = await response.json();
    return data; // Return user data from the server
  } catch (error) {
    throw error; // Throw error for external handling
  }
};
export const updateUser = async (userId, updatedData) => {
  const token = await AsyncStorage.getItem("userToken"); // Retrieve the token

  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Cập nhật người dùng thất bại");
    }

    const data = await response.json();
    return data; // Return the updated user data from the server
  } catch (error) {
    console.error("Update user error:", error);
    throw error; // Throw error for external handling
  }
};
