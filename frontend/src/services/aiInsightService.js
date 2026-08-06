import api from '../../api/axiosConfig.js'

export const getAiInsights = async (userId) => {
    const response = await api.get(`ai-insights/${userId}`)
    const data = response?.data ?? {}
    return {
        summary: data.summary ?? '',
        recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
        disclaimer: data.disclaimer ?? '',
        aiGenerated: data.aiGenerated ?? false,
    }
}
