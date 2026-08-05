import api from '../../api/axiosConfig.js'

export const getPortfolio = async (userId) => {
    const response = await api.get(`portfolio/${userId}`)
    return response.data
}
