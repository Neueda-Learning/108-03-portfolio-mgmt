import api from '../../api/axiosConfig.js'

export const createHolding = async (payload) => {
    const response = await api.post('holdings', payload)
    return response?.data
}