const express=require('express');
const router=express.Router();
const {signup,userSignupValidator,signin,signout,userbyid,update,remove,users}=require('../controller/user');
router.post('/signup',userSignupValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);
router.get('/users',users);
router.get('/:UserId',(req,res)=>{
    res.json({
        user:req.profile
    })
})  
router.put('/:UserId/update',update);
router.delete('/:UserId/delete',remove);


router.param('UserId',userbyid);

module.exports=router;