import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskSearch'
})
export class TaskSearchPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    
        console.log("Search Text : "+searchText);
        if(!items) return [];
        if(!searchText) return items;
        console.log("Items Length: "+items.length);
          searchText = searchText.toLowerCase();
          searchText = searchText.trim();
          searchText = searchText.replace(" ","");
          return items.filter( 
            item => { return (
              (item.taskName.toLowerCase().includes(searchText))
              )
            }
          );
        }

}
