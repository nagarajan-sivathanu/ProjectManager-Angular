import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {

    console.log("Search Text : "+searchText);
    if(!items) return [];
    if(!searchText) return items;
    console.log("Items Length: "+items.length);
      searchText = searchText.toLowerCase();
      searchText = searchText.trim();
      searchText = searchText.replace(" ","");
      return items.filter( 
        //it => { return it.toLowerCase().includes(searchText); }
        item => { return (
          (item.empID.toLowerCase().includes(searchText))|
          (item.empFirstName.toLowerCase().includes(searchText))|
          (item.empLastName.toLowerCase().includes(searchText))|
          ((item.empFirstName.trim()+item.empLastName.trim()).toLowerCase().includes(searchText))
          )
        }
      );
    }

}
