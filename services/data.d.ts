export interface PageProps<T> {
  params?: T | any;
  children?: React.ReactNode;
}

export interface Category {
  father_id: number;
  id: number;
  level: number;
  name: string;
  subCategory: null | Category[];
}
