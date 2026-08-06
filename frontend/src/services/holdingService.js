import api from '../../api/axiosConfig.js'

const extractRows = (root) => {
    const rows =
        root?.data?.holdings ??
        root?.data?.items ??
        root?.holdings ??
        root?.items ??
        root?.data ??
        root

    return Array.isArray(rows) ? rows : []
}

export const getHoldingsByUser = async (userId) => {
    if (!userId) return []
    const response = await api.get(`holdings/user/${userId}`)
    return extractRows(response?.data ?? {})
}

export const createHolding = async (payload) => {
    const response = await api.post('holdings', payload)
    return response?.data
}

export const updateHolding = async (holdingId, payload) => {
    const response = await api.put(`holdings/${holdingId}`, payload)
    return response?.data
}

export const deleteHolding = async (holdingId) => {
    const response = await api.delete(`holdings/${holdingId}`)
    return response?.data
}