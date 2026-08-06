import api from '../../api/axiosConfig.js'

export const getAssets = async () => {
    const response = await api.get('assets')
    return Array.isArray(response.data) ? response.data : []
}

export const getAssetById = async (assetId) => {
    const response = await api.get(`assets/${assetId}`)
    const root = response?.data?.data ?? response?.data ?? {}
    return root
}