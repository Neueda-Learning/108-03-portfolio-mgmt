import api from '../../api/axiosConfig.js'

export const createHolding = async (payload) => {
    const response = await api.post('holdings', payload)
    return response?.data
}

export const updateHolding = async (holdingId, payload) => {
    const response = await api.put(`holdings/${holdingId}`, payload)
    return response?.data
}