import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

    doRoundingToNumber(num: number){
        return Math.round(num);
    } 

    convertUTCDateToLocal(utcDate: string) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
            hour12: true,
          } as const;
        if (utcDate) {
          
          return new Date(utcDate).toLocaleString('en-US', options);
        }
        return new Date().toLocaleString('en-US', options);;
      }
}