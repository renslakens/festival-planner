import { UserService } from '@festival-planner/backend/user';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
    private readonly logger = new Logger(AdminGuard.name);

    constructor(private jwtService: JwtService, private userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            this.logger.log('No token found');
            throw new UnauthorizedException();
        }

        try {
            // Verify the token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env['JWT_SECRET'] || 'secretstring',
            });
            this.logger.log('JWT payload:', payload);
            this.logger.debug('User ID:', payload.user_id);

            // Fetch the user from the database using the userId from the payload
            const user = await this.userService.findOne(payload.user_id); // Replace with your actual method
            if (!user) {
                this.logger.log('User not found');
                throw new UnauthorizedException();
            }

            // Check if the user has the 'admin' role
            if (user.role !== 'Admin') {
                this.logger.log('User is not an admin');
                throw new UnauthorizedException('Insufficient permissions');
            }

            // Assign the user to the request object for downstream use
            request['user'] = user;
        } catch (error) {
            this.logger.error('Error during guard execution', error);
            throw new UnauthorizedException();
        }

        // Grant access if the user is authenticated and has the 'admin' role
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
