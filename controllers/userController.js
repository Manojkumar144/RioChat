const User = require('../models/user');
const bcrypt =require('bcrypt');

//Add user details to user table
exports.postAddUser = async (req, res, next) => {
    console.log('Received form data:', req.body);
    const { name, email, password,phoneNumber} = req.body;
  
    try {
      const user = await User.findOne({
        where: { email: email }
      });
  
      if (user) {
        return res.status(404).send(`
        <script>
          alert("User already exists, Please login!");
          window.location.href = '/';
        </script>
      `);
      }
    
      //Randomization of strings
      // more saltround value leads to less similarity of password but slows down the application
      const saltRounds=10;
  
      //encrypt the password before storing it
      const hashedPassword= await bcrypt.hash(password, saltRounds);
  
      // Create user
      const createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber
      });
      
      console.log('Created user:', createdUser.name);
      return res.status(404).send(`
          <script>
            alert("User Created Successfully, Please login!");
            window.location.href = '/';
          </script>
        `);
  
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  };