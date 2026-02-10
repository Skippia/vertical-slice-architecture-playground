export class UserOutDto {
  id: string;
  email: string;
  name: string;
  createdAt: string;

  static from(user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  }): UserOutDto {
    const dto = new UserOutDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
