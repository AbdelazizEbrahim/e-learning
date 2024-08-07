import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connect from '../../../utils/db';
import User from '../../../model/User';


// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) =>{

        await connect();
        
        const { email, password } = req.body;
        const signedUser = await User.findOne({ email });
        
        if (!signedUser) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const isMatch = await bcrypt.compare(password, signedUser.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const token = jwt.sign({ userId: signedUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
        
       return res.status(200).json({ token });
}


