import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  brands:Brand[]=[];
  currentBrand?:Brand;
  filterText="";
  constructor(private brandService:BrandService) { }

  ngOnInit(): void {
    this.getBrands();
  }

  ngOnUpdate() : void {
    console.log(this.filterText);
  }

  valueChange() :void{
    if(this.filterText !== ""){
      this.brands = this.brands.filter(i => i.brandName.includes(this.filterText))
    }
      else this.getBrands();
  }

  getBrands(){
    this.brandService.getBrands().subscribe(response=>{this.brands=response.data})
    
  }

  setCurrentBrand(brand:Brand){
    this.currentBrand=brand;
  }
  clearCurrentBrand(){
    this.currentBrand=undefined;
  }

  getCurrentBrandClass(brand:Brand){
    if (brand==this.currentBrand) {
      return "list-group-item active"
    } else {
      return "list-group-item"
    }
  }

  getAllBrandClass(){
    if (!this.currentBrand) {
      return "list-group-item active"
    } else {
      return "list-group-item"
    }
  }

  
}
