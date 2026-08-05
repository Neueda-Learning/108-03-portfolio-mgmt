import api from '../../api/axiosConfig.js'

export const getUsers = async () => {
    const response = await api.get('users') // no leading slash
    console.log('getUsers response:', response.data) // temp debug
    return Array.isArray(response.data) ? response.data : []
}