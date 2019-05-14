import { Directive } from '@angular/core';
import { NG_VALIDATORS,  ValidatorFn, Validator, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';

// validation function
function validateStartAndEndDates() : ValidatorFn {
    return (c: FormGroup) => {      
      console.log('Inside validateStartAndEndDates Function()');
      let isValid = false;
      let startDate:string='';
      let endDate:string='';
      if(c.value){
          startDate=c.value.startDate;
          endDate=c.value.endDate;
          console.log("Start Date : "+startDate);
          console.log("End Date : "+endDate);
      }   

      if(startDate>=(formatDate(Date.now(),'yyyy-MM-dd','en'))){
        if(endDate>=startDate && endDate>(formatDate(Date.now(),'yyyy-MM-dd','en')) ){
            isValid=true;
        }
      }  
      console.log('isValid : '+isValid);
      if(isValid) {
        return null;
      } else {
        return {
          dateValidation: {
            valid: false
          }
        };
      } 
    }
  }
 
  @Directive({
    selector: '[dateValidator]',
    providers: [
      { provide: NG_VALIDATORS, useExisting: DateValidator, multi: true }
    ]
  })
  export class DateValidator implements Validator {
    validator: ValidatorFn;
    
    constructor() {
      console.log('Inside Constructor of DateValidator');
      this.validator = validateStartAndEndDates();
    }
    
    validate(c: FormGroup) {
      console.log('inside Validate() of DateValidator');
      return this.validator(c); 
    }    
}