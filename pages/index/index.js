var presenter = require("../../presenter/UserPresenter.js");

Page({
  data: {
    
  },
  
  onLoad: function () {
    
  },


  login:function(e){
   
    presenter.login({
      success :data=>{
       
        console.log(data);
      }
    });
  },

  getUserInfo: function(e){
    presenter.getUserInfo({
      success:data=>{
        console.log(data);
      }
    });
  }
  
})
