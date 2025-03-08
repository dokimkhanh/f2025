import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_DOMAIN;

// Get all categories
export const ListAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get category by ID
export const GetCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

// Get category by slug
export const GetCategoryBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    throw error;
  }
};