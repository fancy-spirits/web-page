import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
 
  protected _data!: ListItem[];
  protected selectedItems: ListItem[] = [];
  protected isDropdownOpen = true;
  protected _placeholder = "Select";
  private sourceDataType: any = null;
  private sourceDataFields: string[] = [];
  protected filter: ListItem = new ListItem(this.data);
  defaultSettings: DropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    disabledField: 'isDisabled',
    enableCheckAll: false,
    selectAllText: 'Select All',
    unselectAllText: 'Unselect All',
    allowSearchFilter: false,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 2,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
    allowRemoteDataSearch: false,
  };
  protected _settings: DropdownSettings = this.defaultSettings;

  private onClickCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  @Input()
  public set selectionMode(value: "single" | "multiple") {
    this.settings.singleSelection = value === "single";
    this.settings.closeDropDownOnSelection = value === "single";
  }

  @Input()
  public set placeholder(value: string) {
    this._placeholder = !!value ? value : "Select";
  }
  public get placeholder() {
    return this._placeholder;
  }

  @Input() disabled = false;

  @Input()
  public set settings(value: DropdownSettings) {
    this._settings = !!value ? Object.assign(this.defaultSettings, value) : Object.assign(this.defaultSettings);
  }
  public get settings() {
    return this._settings;
  }

  @Input()
  public set data(value: any[]) {
    if (!value) this._data = [];
    else {
      const firstItem = value[0];
      this.sourceDataType = typeof firstItem;
      this.sourceDataFields = this.getFields(firstItem);
      this._data = value.map(item => {
        return typeof item === "string" || item === "number" ? new ListItem(item) : new ListItem({
          id: item[this.settings.idField!],
          text: item[this.settings.textField!],
          isDisabled: item[this.settings.disabledField!]
        })
      })
    }
  }
  public get data() {
    return this._data;
  }

  @Output() filterChange = new EventEmitter<any>();

  @Output() dropdownClose = new EventEmitter<any>();

  @Output() select = new EventEmitter<any>();

  @Output() deselect = new EventEmitter<any>();

  @Output() selectAll = new EventEmitter<Array<any>>();

  @Output() deselectAll = new EventEmitter<Array<any>>();

  onFilterTextChange($event: any) {
    this.filterChange.emit($event);
  }

  constructor(private changeDetector: ChangeDetectorRef) { }

  onItemClick($event: any, item: ListItem) {
    if (this.disabled || item.isDisabled) {
      return;
    }

    const found = this.isSelected(item);
    const allowAdd = this.settings.limitSelection === -1 || (this.settings.limitSelection! > 0 && this.selectedItems.length < this.settings.limitSelection!);

    if (!found) {
      if (allowAdd) {
        this.addSelected(item);
      }
    } else {
      this.removeSelected(item);
    }
    if (this.settings.singleSelection && this.settings.closeDropDownOnSelection) {
      this.closeDropdown();
    }
  }

  writeValue(value: any) {

  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  
  registerOnClick(fn: any) {
    this.onClickCallback = fn;
  }

  @HostListener("blur")
  public onClicked() {
    this.closeDropdown();
    this.onClickCallback();
  }

  trackByFn(item: any) {
    return item.id;
  }

  isSelected(clickedItem: ListItem) {
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem.id === item.id) {
        found = true;
      }
    });
    return found;
  }

  isLimitSelectionReached() {
    return this.settings.limitSelection === this.selectedItems.length;
  }

  isAllItemsSelected() {
    const disabledItemsCount = this.data.filter(item => item.isDisabled).length;
    if ((!this.data || this.data.length === 0) && this.settings.allowRemoteDataSearch) {
      return false;
    }
    return this.data.length === this.selectedItems.length + disabledItemsCount;
  }

  showButton() {
    if (!this.settings.singleSelection) {
      if (!!this.settings.limitSelection && this.settings.limitSelection > 0) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  itemShowRemaining() {
    return this.selectedItems.length - this.settings.itemsShowLimit!;
  }

  addSelected(item: ListItem) {
    if (this.settings.singleSelection) {
      this.selectedItems = [item];
    } else {
      this.selectedItems.push(item);
    }
    this.onChangeCallback(this.emittedValue(this.selectedItems));
    this.select.emit(this.emittedValue(item));
  }

  removeSelected(selectedItem: ListItem) {
    this.selectedItems.forEach(item => {
      if (selectedItem.id === item.id) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this.onChangeCallback(this.emittedValue(this.selectedItems));
    this.deselect.emit(this.emittedValue(selectedItem));
  }

  emittedValue(value: any): any {
    const selected: any = [];
    if (Array.isArray(value)) {
      value.map(item => selected.push(this.objectify(item)));
    } else {
      if (!!value) {
        return this.objectify(value);
      }
    }
    return selected;
  }

  objectify(value: ListItem): any {
    if (this.sourceDataType === "object") {
      const obj: any = {};
      obj[this.settings.idField!] = value.id;
      obj[this.settings.textField!] = value.text;
      if (this.sourceDataFields.includes(this.settings.disabledField!)) {
        obj[this.settings.disabledField!] = value.isDisabled;
      }
      return obj;
    }
    if (this.sourceDataType === "number") {
      return Number(value.id);
    } else {
      return value.text;
    }
  }

  toggleDropdown(event: any) {
    event.preventDefault();
    if (this.disabled && this.settings.singleSelection) {
      return;
    }
    this.settings.defaultOpen = !this.settings.defaultOpen;
    if (!this.settings.defaultOpen) {
      this.dropdownClose.emit();
    }
  }

  closeDropdown() {
    this.settings.defaultOpen = false;
    if (this.settings.clearSearchFilter) {
      this.filter.text = "";
    }
    this.dropdownClose.emit();
  }

  toggleSelectAll(): boolean | undefined {
    if (this.disabled) {
      return false;
    }
    if (!this.isAllItemsSelected()) {
      this.selectedItems = this.data.filter(item => !item.isDisabled).slice();
      this.selectAll.emit(this.emittedValue(this.selectedItems));
    } else {
      this.selectedItems = [];
      this.deselectAll.emit(this.emittedValue(this.selectedItems));
    }
    this.onChangeCallback(this.emittedValue(this.selectedItems));
    return;
  }

  getFields(inputData: any) {
    const fields: any[] = [];
    if (typeof inputData !== "object") {
      return fields;
    }
    for(const property in inputData) {
      fields.push(property);
    }
    return fields;
  }

  ngOnInit(): void {
  }

}


export interface DropdownSettings {
  singleSelection?: boolean;
  idField?: string;
  textField?: string;
  disabledField?: string;
  enableCheckAll?: boolean;
  selectAllText?: string;
  unselectAllText?: string;
  allowSearchFilter?: boolean;
  clearSearchFilter?: boolean;
  maxHeight?: number;
  itemsShowLimit?: number;
  limitSelection?: number;
  searchPlaceholderText?: string;
  noDataAvailablePlaceholderText?: string;
  closeDropDownOnSelection?: boolean;
  showSelectedItemsAtTop?: boolean;
  defaultOpen?: boolean;
  allowRemoteDataSearch?: boolean;
}

export class ListItem {
  id!: String | number;
  text!: String | number;
  isDisabled?: boolean;

  public constructor(source: any) {
    if (typeof source === 'string' || typeof source === 'number') {
      this.id = this.text = source;
      this.isDisabled = false;
    }
    if (typeof source === 'object') {
      this.id = source.id;
      this.text = source.text;
      this.isDisabled = source.isDisabled;
    }
  }
}