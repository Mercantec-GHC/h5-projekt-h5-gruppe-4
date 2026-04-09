import { api } from '@/config/config';

const deleteAvatar = async (userId) => {
    const res = await api().delete(`/api/userdata/removeAvatar?userId=${userId}`);
    return res.data;
};

export default deleteAvatar;