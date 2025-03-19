import axios from "axios";
const API_URL = import.meta.env.VITE_SERVER_DOMAIN;

export const ListAllProduct = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const GetProductBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/products/${slug}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with slug ${slug}:`, error);
        throw error;
    }
};

// Lấy sản phẩm theo danh mục
export const GetProductsByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/products/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching products by category ${categoryId}:`, error);
        throw error;
    }
};

// Lấy sản phẩm nổi bật
export const GetFeaturedProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/featured`);
        return response.data;
    } catch (error) {
        console.error('Error fetching featured products:', error);
        throw error;
    }
};

// Lấy sản phẩm liên quan
export const GetRelatedProducts = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}/related`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching related products for ${productId}:`, error);
        throw error;
    }
};

// Tìm kiếm sản phẩm
export const SearchProducts = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/products/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching products with query ${query}:`, error);
        throw error;
    }
};