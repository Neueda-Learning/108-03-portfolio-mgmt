import api from '../../api/axiosConfig.js'

export const getInsights = async (userId) => {
    const response = await api.get(`insights/${userId}`)
    const payload = response?.data?.data ?? response?.data ?? {}

    return {
        holdingClusters: Array.isArray(payload.holdingClusters) ? payload.holdingClusters : [],
        clusterCounts: payload.clusterCounts ?? {},
        summary: payload.summary ?? '',
    }
}