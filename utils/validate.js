const axios = require("axios");



const validateProduct = async (productId) => {
    try {
        const response = await axios.get(`http://localhost:3003/api/products/getproduct/${productId}`);
        return response.data ? true : false;
    } catch (error) {
        return false;
    }
};

module.exports = { validateProduct };

