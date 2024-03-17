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

//Check the exisitng users
exports.postLoginUser = async (req, res, next) => {
    console.log('Received login form data:', req.body);
    const { email, password } = req.body;
  
    try {
      // Check if the user with the given email exists
      const user = await User.findOne({
        where: { email: email }
      });
  
      if (!user) {
        // User not found
        return res.status(404).send(`
          <script>
            alert("User does not exist, Please sign up!");
            window.location.href = '/';
          </script>
        `);
      }
      
      const isPassword = await bcrypt.compare(password, user.password);
  
      // Check if the provided password matches the stored password
      if (!isPassword) {
        // Password doesn't match
        return res.status(401).send(`
          <script>
            alert("Incorrect password, please try again!");
            window.location.href = '/';
          </script>
        `);
      }
  
      // Password is valid, user is authenticated
      console.log('Successfully logged in');
      res.status(200).json({success: true, message:`User Logged in succesfully`});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };