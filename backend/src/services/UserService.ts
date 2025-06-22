import User from '../models/User';

class UserService {
  async createUser(data: any, tenantId: number) {
    return User.create({ ...data, tenantId });
  }

  async getUserById(id: number, tenantId: number) {
    return User.findOne({ where: { id, tenantId } });
  }

  async updateUser(id: number, data: any, tenantId: number) {
    return User.update(data, { where: { id, tenantId } });
  }

  async deleteUser(id: number, tenantId: number) {
    return User.destroy({ where: { id, tenantId } });
  }
}

export default new UserService(); 