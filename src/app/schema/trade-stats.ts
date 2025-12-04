export interface TradeStats {
  result: Result[];
}

export interface Result {
  id: string;
  label: string;
  entries: Entry[];
}

export interface Entry {
  id: string;
  text: string;
  type: string;
  option?: Option;
}

export interface Option {
  options: Option2[];
}

export interface Option2 {
  id: number;
  text: string;
}
