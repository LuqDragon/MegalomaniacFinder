export interface TradeQuery {
  query: Query;
  sort: Sort;
}

export interface Filter {
  id: string;
}

export interface Query {
  status: Status;
  stats: Array<Stat>;
  name: string;
  type: string;
}

export interface Sort {
  price: string;
}

export interface Stat {
  type: string;
  filters: Array<Filter>;
  value?: Value;
}

export interface Status {
  option: string;
}

export interface Value {
  min: number;
}
