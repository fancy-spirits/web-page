import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from './multi-select/multi-select.component';

@Pipe({
  name: 'listFilter'
})
export class ListFilterPipe implements PipeTransform {

  transform(items: ListItem[], filter: ListItem): ListItem[] {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => this.applyFilter(item, filter));
  }

  applyFilter(item: ListItem, filter: ListItem) {
    if (typeof item.text === "string" && typeof filter.text === "string") {
      return !(filter.text && item.text && item.text.toLowerCase().indexOf(filter.text.toLowerCase()) === -1);
    } else {
      return !(
        filter.text &&
        item.text &&
        item.text
          .toString()
          .toLowerCase()
          .indexOf(filter.text.toString().toLowerCase()) === -1
      );
    }
  }

}
