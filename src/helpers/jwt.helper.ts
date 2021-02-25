
import jwt from 'jsonwebtoken';
import { singleton } from 'tsyringe';

@singleton()
class JWTHelper {
    generateToken = (user, secretSignature, tokenLife): Promise<string | undefined> => {
        return new Promise((resolve, reject) => {
            const userData = {
                id: user.id,
                display_name: user.display_name,
                user_email: user.user_email,
            }

            jwt.sign(
                { data: userData },
                secretSignature,
                {
                    expiresIn: tokenLife,
                },
                (error, token) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(token);
                });
        });
    }

    verifyToken = (token, secretKey): Promise<string> => {
        return new Promise((resolve) => {
            jwt.verify(token, secretKey, (error, decoded) => {
                if (error) {
                    throw {
                        error_name: error.name,
                        error_message: error.message,
                        expired_at: error.expiredAt,
                    };
                }
                resolve(decoded);
            });
        });
    }
}
export default JWTHelper;