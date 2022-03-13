'use strict';



function acl(action){
    return(request,response,next) =>{
        try{
            if(request.user.actions.includes(action)){
                next();
            }
            else{
                next('access denied')
            }
        }
        catch(error){
        return("error at oauth"+error);
        }
    }
}
module.exports = acl;