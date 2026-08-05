import api from '../../api/axiosConfig.js'

export const getPortfolio = async (userId) => {
    const response = await api.get(`portfolio/${userId}`)
    const payload = response?.data?.data ?? response?.data ?? {}

    return {
        userInfo: payload.userInfo ?? null,
        positions: Array.isArray(payload.positions) ? payload.positions : [],
        totals: payload.totals ?? null,
        assets: Array.isArray(payload.assets) ? payload.assets : [],
        asOf: payload.asOf ?? null,
    }
}
