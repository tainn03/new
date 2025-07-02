export class PasswordChecker{
    check(password: string | null){
        if(password === null  || password === ''){
            throw Error('Password is required');
        }
        if(password.length < 8){
            throw Error('Password must be at least 8 characters');
        }
    };
}
