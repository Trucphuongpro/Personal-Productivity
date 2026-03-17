import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entities/user.entity';

//tạo decorate để getuser thay vì dùng req
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest<{ user: User }>(); // gặp lỗi any hãy xác bỏ tạo ki
    return req.user; // nó như cấp danh tính để có thể truy cập
  },
);
