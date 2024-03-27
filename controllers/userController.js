const User = require('../models/user');
const Chat = require('../models/chat');
const Group = require('../models/group');
const GroupMember = require('../models/groupMembers');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const path =require('path');

//encrypting the id of the user using jwt 
function generateToken(id)
{
   return jwt.sign({userId :id}, process.env.ACCESS_TOKEN_SECRET);
}

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
            alert("User not found, Please sign up!");
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
      res.status(200).json({success: true, message:`User Logged in succesfully`,accessToken: generateToken(user.id),name:user.name});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.getUserDetails = async (req, res) => {
    try{
      const { groupId } = req.query;

      const groupDetails = await Group.findOne({
        where: { groupId: groupId }
    });

      const userDetails = await GroupMember.findAll(
        {where: { groupId: groupId},
            order: ["createdAt"]   
        }
      )
     
      const userIds = userDetails.map(userDetail => userDetail.userId);

      const groupName = groupDetails ? groupDetails.groupName : "Unknown Group";

      // Fetch users corresponding to userIds
      const users = await User.findAll({
          where: { id: userIds },
          order: ["name"]   
      });

      res.status(200).json({groupName,users,accessToken: generateToken(users.id)})     
  } catch (err){
  console.log(err)
  res.status(500).json(err)
  }
    };


 // to  get the chat page
 exports.getChat = (req, res) => {
  res.sendFile(path.join(__dirname, '../views', '/home.html'));
};

  //store the  chat message in the db
  exports.postChatMessage = async (req, res, next) => {
    const { chat,groupId } = req.body;
    console.log("Inside the post chat message....");
    console.log("req....", req.body);
    console.log("groupId.....",req.groupId);
  
    try {
      // Create message
      const createdMessage = await Chat.create({
        userId: req.user.id,
        name: req.user.name,
        message: chat,
        groupId:groupId
      });
  
      if (!createdMessage) {
        return res.status(404).send("Error creating message");
      }
  
      // Return success response
      return res.status(200).send("Message added successfully");
    } catch (err) {
      console.error("Error creating message:", err);
      return res.status(500).send("Internal Server Error");
    }
  };
  

//api to fetch chat messages;
exports.getChatMessages = async (req, res) => {
  try{
    console.log("inside the getChatMessages");
    const groupId = req.query.groupId;
    console.log("the groupId in the getChat messages....",groupId );
    const chatMessages = await Chat.findAll({where: { 
      groupId: groupId},
        order: ["createdAt"]   
    })
    console.log(" all the chat messages...",chatMessages);
    res.status(200).json({chatMessages:chatMessages})     
} catch (err){
console.log(err)
res.status(500).json(err)
}
  };


 
  