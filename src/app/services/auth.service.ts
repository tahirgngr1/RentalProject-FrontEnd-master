import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { LoginModel } from '../models/loginModel';
import { RegisterModel } from '../models/registerModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { LocalstorageService } from './localstorage.service';

import { UserModel } from '../models/userModel';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwtDecode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  decodedTokenKey:any
  user:UserModel
  apiUrl = 'https://localhost:44345/api/auth/';
  constructor(private httpClient:HttpClient,private localStorageService:LocalstorageService,private jwtHelper:JwtHelperService) { }

  login(loginModel:LoginModel){
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"login",loginModel)
  }

    isAuthenticated(){
      if(localStorage.getItem("token")){
        return true;
        
      }
      else{
        return false;
      }
    }

      isAdmin() : boolean{
    
            const users = this.getUserInfo();
            let bool :boolean =false
            if(users.roles && users.roles != undefined && this.user.roles === 'admin'){
             bool = !bool
            }
            console.log(bool)
              return bool; 
            
            
          
      }

    register(registerModel:RegisterModel):Observable<SingleResponseModel<TokenModel>>{
      return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"register",registerModel)
    }
    


    decodedToken(token:any){
      return this.jwtHelper.decodeToken(token)
    }


    loggedIn(){
      if(this.localStorageService.getToken()){
        return this.jwtHelper.isTokenExpired()// true/false 
      }
      else{
        return false;
      }
    }


    getUserInfo(){
      let decodedToken = this.decodedToken(this.localStorageService.getToken())
      if (decodedToken) {
        if (this.loggedIn()) {
          let tokenInfoName= Object.keys(decodedToken).filter(u=> u.endsWith('/name'))[0]
          var splitted=String(decodedToken[tokenInfoName]).split(" ")
          let firstName=splitted[0];
          let lastName=splitted[1]

          let tokenInfoId= Object.keys(decodedToken).filter(x=> x.endsWith('/nameidentifier'))[0]
          let userId= Number(decodedToken[tokenInfoId]);

          let claimInfo = Object.keys(decodedToken).filter(x=> x.endsWith('/role'))[0]
          let roles= decodedToken[claimInfo];
          let emailInfo= decodedToken.email; 
          
          this.user={
            userId:userId,
            firstName:firstName,
            lastName:lastName,
            email:emailInfo,
            roles:roles,

          }      
        }
      }
      return this.user;
    }

}
