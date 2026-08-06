import api from '../../api/axiosConfig.js'

export const getAssets = async () => {
    const response = await api.get('assets')
    return Array.isArray(response.data) ? response.data : []
}